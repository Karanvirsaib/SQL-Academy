"""Bounded local stream simulation. Not Kafka/Kinesis or a Spark runtime.
Run: python stream_replay.py
Exercise: add versioned updates, delete tombstones, and a late-event policy.
"""
import json
import tempfile
from pathlib import Path

EVENTS = [
    {'event_id': 'e1', 'event_time': '10:00', 'amount': 20},
    {'event_id': 'e2', 'event_time': '10:01', 'amount': 30},
    {'event_id': 'e1', 'event_time': '10:00', 'amount': 20},
    {'event_id': 'e3', 'event_time': '09:59', 'amount': 10},
]


def consume(events, state):
    for event in events:
        previous = state.get(event['event_id'])
        if previous is not None and previous != event:
            raise ValueError('conflicting payload for event_id')
        state[event['event_id']] = event
    return state


def summarize(state):
    totals = {}
    for event in state.values():
        minute = event['event_time']
        totals[minute] = totals.get(minute, 0) + event['amount']
    return dict(sorted(totals.items()))


if __name__ == '__main__':
    with tempfile.TemporaryDirectory() as directory:
        checkpoint = Path(directory) / 'checkpoint.json'
        state = consume(EVENTS[:2], {})
        checkpoint.write_text(json.dumps(state), encoding='utf-8')
        restored = json.loads(checkpoint.read_text(encoding='utf-8'))
        # Replay all events after restart; duplicates must not inflate the result.
        consume(EVENTS, restored)
        result = summarize(restored)
        assert result == {'09:59': 10, '10:00': 20, '10:01': 30}
        assert sum(result.values()) == 60
        assert summarize(consume(EVENTS, restored)) == result
        print('PASS: restart and replay total = 60; raw arrival total = 80')
        print(result)
        print('Limit: bounded in-memory event IDs; production needs a durable state/offset contract.')
