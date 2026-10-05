"""Project A starter: Python standard library only. Run in a practice directory.

python batch_pipeline.py --self-test
python batch_pipeline.py --input orders.csv --output output

Outputs contain synthetic practice data. Inputs require explicit UTC timestamps.
This is a local teaching pipeline, not a cloud deployment or production template.
"""
import argparse
import csv
import hashlib
import json
import os
import sqlite3
import tempfile
from contextlib import closing
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation
from pathlib import Path


def parse(row):
    order_id = int(row['order_id'])
    if order_id <= 0:
        raise ValueError('order_id must be positive')
    updated = datetime.fromisoformat(row['updated_at'].replace('Z', '+00:00'))
    if updated.tzinfo is None:
        raise ValueError('updated_at must include timezone')
    day = datetime.strptime(row['ordered_date'], '%Y-%m-%d').date().isoformat()
    amount = Decimal(row['amount'])
    if not amount.is_finite() or amount < 0 or amount != amount.quantize(Decimal('0.01')):
        raise ValueError('amount must be nonnegative with at most two decimal places')
    status = row['status']
    if status not in ('paid', 'cancelled'):
        raise ValueError('unknown status')
    return (order_id, updated.astimezone(timezone.utc).isoformat(), day, int(amount * 100), status)


def run(source, destination):
    destination.mkdir(parents=True, exist_ok=True)
    accepted, rejected, total = [], [], 0
    with source.open(newline='', encoding='utf-8') as stream:
        reader = csv.DictReader(stream)
        required = {'order_id', 'updated_at', 'ordered_date', 'amount', 'status'}
        if not required.issubset(reader.fieldnames or []):
            raise ValueError('missing required CSV columns')
        for number, row in enumerate(reader, 2):
            total += 1
            try:
                accepted.append(parse(row))
            except (ValueError, KeyError, TypeError, InvalidOperation) as error:
                # Retain row number and reason, not an entire possibly sensitive row.
                rejected.append({'line': number, 'reason': str(error)})
    assert total == len(accepted) + len(rejected)
    # Reject ambiguous source versions instead of letting arrival order choose a value.
    versions = {}
    for row in accepted:
        identity = row[:2]
        if identity in versions and versions[identity] != row:
            raise ValueError('conflicting records for identical key/version')
        versions[identity] = row
    with closing(sqlite3.connect(destination / 'orders.sqlite')) as conn:
        conn.execute('CREATE TABLE IF NOT EXISTS orders (order_id INTEGER PRIMARY KEY, updated_at TEXT NOT NULL, ordered_date TEXT NOT NULL, amount_cents INTEGER NOT NULL, status TEXT NOT NULL)')
        with conn:
            for row in accepted:
                prior = conn.execute('SELECT * FROM orders WHERE order_id=?', (row[0],)).fetchone()
                if prior and prior[1] == row[1] and tuple(prior) != row:
                    raise ValueError('incoming version conflicts with stored version')
                conn.execute('''INSERT INTO orders VALUES (?, ?, ?, ?, ?)
                    ON CONFLICT(order_id) DO UPDATE SET updated_at=excluded.updated_at,
                    ordered_date=excluded.ordered_date, amount_cents=excluded.amount_cents,
                    status=excluded.status WHERE excluded.updated_at > orders.updated_at''', row)
            report = conn.execute("SELECT ordered_date, SUM(amount_cents) FROM orders WHERE status='paid' GROUP BY ordered_date ORDER BY ordered_date").fetchall()
    # Publish a complete report through replacement on the same filesystem.
    staged = destination / 'daily_revenue.csv.tmp'
    with staged.open('w', newline='', encoding='utf-8') as stream:
        writer = csv.writer(stream)
        writer.writerow(['ordered_date', 'paid_revenue'])
        writer.writerows((day, f'{Decimal(cents) / 100:.2f}') for day, cents in report)
    os.replace(staged, destination / 'daily_revenue.csv')
    (destination / 'rejects.json').write_text(json.dumps(rejected, indent=2), encoding='utf-8')
    manifest = {'input_sha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'input_rows': total,
                'accepted_input_rows': len(accepted), 'rejected_input_rows': len(rejected),
                'logical_orders': len({r[0] for r in accepted}),
                'limitations': 'Local upserts; no delete events; manifest/report/database are not one distributed transaction.'}
    (destination / 'manifest.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
    return report, manifest


def self_test():
    with tempfile.TemporaryDirectory() as directory:
        root = Path(directory)
        source = root / 'orders.csv'
        source.write_text('order_id,updated_at,ordered_date,amount,status\n'
                          '1,2026-01-01T10:00:00Z,2026-01-01,100,paid\n'
                          '2,2026-01-01T11:00:00Z,2026-01-01,50,cancelled\n'
                          '1,2026-01-02T09:00:00Z,2026-01-01,120,paid\n'
                          '3,2026-01-02T10:00:00Z,2026-01-02,80,paid\n'
                          '4,2026-01-02T11:00:00Z,2026-01-02,bad,paid\n', encoding='utf-8')
        first, manifest = run(source, root / 'output')
        original = (root / 'output/daily_revenue.csv').read_bytes()
        second, _ = run(source, root / 'output')
        assert first == second == [('2026-01-01', 12000), ('2026-01-02', 8000)]
        assert original == (root / 'output/daily_revenue.csv').read_bytes()
        assert manifest['input_rows'] == 5 and manifest['rejected_input_rows'] == 1
        # A malformed schema cannot replace last-good published output.
        source.write_text('wrong_column\n1\n', encoding='utf-8')
        try:
            run(source, root / 'output')
        except ValueError:
            pass
        else:
            raise AssertionError('schema failure should stop the load')
        assert original == (root / 'output/daily_revenue.csv').read_bytes()
    print('PASS: corrected revenue, quarantine, replay, and failed-input publication checks')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--self-test', action='store_true')
    parser.add_argument('--input', type=Path)
    parser.add_argument('--output', type=Path, default=Path('output'))
    args = parser.parse_args()
    if args.self_test:
        self_test()
    elif args.input:
        result, manifest = run(args.input, args.output)
        print(json.dumps(manifest, indent=2))
        print('Report:', args.output / 'daily_revenue.csv')
    else:
        parser.error('supply --self-test or --input orders.csv')
