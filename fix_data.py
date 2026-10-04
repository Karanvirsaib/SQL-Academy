with open('lib/data.ts') as f:
    content = f.read()
# For each exercise, replace hint:... with hints:[..., ..., starter or partial]
replacements = [
    ("hint:'Filter city in WHERE, then sort lifetime_value DESC.'",
     "hints:['Filter city in WHERE, then sort lifetime_value DESC.','SELECT customer_id, name, lifetime_value\nFROM customers\nWHERE city = \'Delhi\'\nORDER BY lifetime_value DESC;','SELECT customer_id, name, lifetime_value\nFROM customers\nWHERE city = \'Delhi\'\nORDER BY lifetime_value DESC;']"),
    ("hint:'The city is in customers; amount is in orders.'",
     "hints:['The city is in customers; amount is in orders.','SELECT c.city, SUM(o.amount) AS revenue\nFROM customers c\nJOIN orders o ON c.customer_id=o.customer_id\nGROUP BY c.city\nORDER BY revenue DESC;','SELECT c.city, SUM(o.amount) AS revenue\nFROM customers c\nJOIN orders o ON c.customer_id=o.customer_id\nGROUP BY c.city\nORDER BY revenue DESC;']"),
    ("hint:'Aggregate first, rank inside each city second.'",
     "hints:['Aggregate first, rank inside each city second.','WITH revenue AS (SELECT c.city,c.name,SUM(o.amount) revenue FROM customers c JOIN orders o ON c.customer_id=o.customer_id GROUP BY 1,2) SELECT * FROM revenue;','WITH revenue AS (SELECT c.city,c.name,SUM(o.amount) revenue FROM customers c JOIN orders o ON c.customer_id=o.customer_id GROUP BY 1,2), ranked AS (SELECT *,ROW_NUMBER() OVER(PARTITION BY city ORDER BY revenue DESC) rn FROM revenue) SELECT city,name,revenue FROM ranked WHERE rn=1 ORDER BY city;']"),
    ("hint:'CASE evaluates conditions from top to bottom.'",
     "hints:['CASE evaluates conditions from top to bottom.','SELECT name, CASE WHEN lifetime_value>=50000 THEN \'VIP\' WHEN lifetime_value>=25000 THEN \'Core\' ELSE \'Emerging\' END AS segment FROM customers;','SELECT name, CASE WHEN lifetime_value>=50000 THEN \'VIP\' WHEN lifetime_value>=25000 THEN \'Core\' ELSE \'Emerging\' END AS segment FROM customers;']"),
    ("hint:'The fact table is claims and paid_amount is the spend measure.'",
     "hints:['The fact table is claims and paid_amount is the spend measure.','SELECT drug, SUM(paid_amount) AS spend\nFROM claims\nGROUP BY drug\nORDER BY spend DESC;','SELECT drug, SUM(paid_amount) AS spend\nFROM claims\nGROUP BY drug\nORDER BY spend DESC;']"),
    ("hint:'Filter the provider dimension after joining it to claims.'",
     "hints:['Filter the provider dimension after joining it to claims.','SELECT p.provider_name, SUM(c.paid_amount) AS spend\nFROM claims c JOIN providers p ON c.provider_id=p.provider_id\nGROUP BY p.provider_name;','SELECT p.provider_name, SUM(c.paid_amount) AS spend\nFROM claims c JOIN providers p ON c.provider_id=p.provider_id\nWHERE p.network_status=\'Out of Network\'\nGROUP BY p.provider_name;']"),
    ("hint:'Average handle_seconds, then convert seconds to minutes.'",
     "hints:['Average handle_seconds, then convert seconds to minutes.','SELECT queue, AVG(handle_seconds) AS avg_handle_sec\nFROM calls\nGROUP BY queue;','SELECT queue, AVG(handle_seconds)/60.0 AS avg_handle_minutes\nFROM calls\nGROUP BY queue\nORDER BY avg_handle_minutes DESC;']"),
    ("hint:'Build numerator and denominator at the same grain.'",
     "hints:['Build numerator and denominator at the same grain.','SELECT SUM(CASE WHEN abandoned THEN 1 ELSE 0 END) AS abandoned_calls, COUNT(*) AS total_calls FROM calls;','SELECT SUM(CASE WHEN abandoned THEN 1 ELSE 0 END)::DOUBLE / COUNT(*) AS abandonment_rate\nFROM calls;']"),
    ("hint:'Viewing is event-level; aggregate minutes by subscriber.'",
     "hints:['Viewing is event-level; aggregate minutes by subscriber.','SELECT subscriber_id, SUM(minutes) AS total_minutes\nFROM viewing\nGROUP BY subscriber_id;','SELECT subscriber_id, SUM(minutes) AS total_minutes\nFROM viewing\nGROUP BY subscriber_id\nORDER BY total_minutes DESC;']"),
    ("hint:'Use LEFT JOIN to preserve subscribers with no viewing events.'",
     "hints:['Use LEFT JOIN to preserve subscribers with no viewing events.','SELECT s.subscriber_id, s.plan FROM subscribers s LEFT JOIN viewing v ON s.subscriber_id=v.subscriber_id WHERE s.plan=\'Premium\';','SELECT s.subscriber_id, COALESCE(SUM(v.minutes),0) AS total_minutes\nFROM subscribers s LEFT JOIN viewing v ON s.subscriber_id=v.subscriber_id\nWHERE s.plan=\'Premium\'\nGROUP BY s.subscriber_id\nORDER BY total_minutes DESC;']"),
]
for old, new in replacements:
    content = content.replace(old, new)
with open('lib/data.ts', 'w') as f:
    f.write(content)
print('done replacements')
