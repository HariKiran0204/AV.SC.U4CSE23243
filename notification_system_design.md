# Notification System Design

## Stage 1: API Design and Contracts
1. Requirements
- Send, store, fetch, and mark notifications.
- Support realtime delivery and historical query.

2. High-Level Design
- API Gateway -> Notification Service -> Queue -> Worker -> DB.
- WebSocket gateway for live delivery.

3. API Design
- `POST /api/v1/notifications`
- `GET /api/v1/users/{userId}/notifications?cursor=&limit=`
- `PATCH /api/v1/notifications/{id}/read`

Request example:
```json
{ "userId": "u1", "type": "ORDER", "title": "Order shipped", "body": "Track your order", "priority": 8 }
```
Response example:
```json
{ "id": "n1", "status": "queued" }
```

4. Database Design
- notifications(id, user_id, type, title, body, priority, read_at, created_at)
- indexes: (user_id, created_at desc), (user_id, read_at, created_at desc)

5. Scaling Strategy
- Partition by user_id hash or created_at month.
- Separate write path and read path.

6. Performance Bottlenecks
- Large unread scans, hot users, queue spikes.

7. Optimization Techniques
- Cursor pagination, Redis cache for first page, batched writes.

8. Tradeoffs
- Eventual consistency for speed vs strict sync writes.

9. Reliability
- Retry with backoff, idempotency key, DLQ.

10. Fault Tolerance
- Multi-AZ DB, replicated queue, consumer groups.

## Stage 2: DB Selection and Scaling
1. Requirements
- High write throughput, filter by user/time/read state, durable history.

2. High-Level Design
- PostgreSQL primary + read replicas + Redis cache.

3. API Design
- Keep same contracts; add `before` cursor.

4. Database Design
- SQL chosen for transactional consistency and rich indexing.
- Table partitioning by month for long-term growth.

5. Scaling Strategy
- Read replicas, connection pooling, partition pruning.

6. Performance Bottlenecks
- Offset pagination, unbounded result sets.

7. Optimization Techniques
- Cursor-based pagination on `(user_id, created_at, id)`.

8. Tradeoffs
- SQL schema migration overhead vs NoSQL flexibility.

9. Reliability
- WAL archiving and PITR backups.

10. Fault Tolerance
- Automatic failover with managed Postgres.

## Stage 3: Slow Query Optimization
1. Requirements
- Fast unread + recent notifications query.

2. High-Level Design
- Query only needed columns and use covering index.

3. API Design
- `GET /users/{userId}/notifications?unread=true&limit=20&before=...`

4. Database Design
- Composite index: `(user_id, read_at, created_at DESC, id DESC)` include `(title, type, priority)`.

5. Scaling Strategy
- Route reads to replicas.

6. Performance Bottlenecks
- Full scans on unread filter and offset pagination.

7. Optimization Techniques
- Cursor pagination + index-only scan.

8. Tradeoffs
- Extra index storage vs low latency.

9. Reliability
- Slow query log monitoring.

10. Fault Tolerance
- Fallback to primary if replica lag too high.

Optimized SQL:
```sql
SELECT id, type, title, priority, created_at
FROM notifications
WHERE user_id = $1
  AND read_at IS NULL
  AND (created_at, id) < ($2, $3)
ORDER BY created_at DESC, id DESC
LIMIT $4;
```

## Stage 4: Fetch Optimization
1. Requirements
- Smooth inbox UX at scale.
2. High-Level Design
- Redis cache for first-page unread + WebSocket push.
3. API Design
- Cursor endpoints only.
4. Database Design
- Keep composite indexes and partitioning.
5. Scaling Strategy
- Cache warming for active users.
6. Performance Bottlenecks
- Re-fetching same first page.
7. Optimization Techniques
- Infinite scrolling + lazy loading + batch hydration.
8. Tradeoffs
- Cache invalidation complexity.
9. Reliability
- TTL + stale-while-revalidate.
10. Fault Tolerance
- Graceful degradation to DB reads.

## Stage 5: Bulk Notification Sending
1. Requirements
- Large campaigns with retries and observability.
2. High-Level Design
- Producer -> Kafka/RabbitMQ -> workers -> provider adapters.
3. API Design
- `POST /campaigns/{id}/dispatch`
4. Database Design
- delivery_attempts table with idempotency key.
5. Scaling Strategy
- Partition queue by tenant/campaign.
6. Performance Bottlenecks
- Provider throttling.
7. Optimization Techniques
- Batch sends + rate limiting + adaptive backoff.
8. Tradeoffs
- Throughput vs ordering guarantee.
9. Reliability
- Retries, jitter, DLQ.
10. Fault Tolerance
- Multi-worker redundancy.

Pseudocode:
```text
for each batch in campaign_recipients:
  enqueue(batch, idempotencyKey)
worker:
  msg = consume()
  if alreadyProcessed(msg.idempotencyKey): ack
  try send(msg)
      markProcessed()
      ack
  catch transient:
      retryWithBackoff(msg)
  catch fatal:
      pushDLQ(msg)
      ack
```

## Stage 6: Priority Inbox
1. Requirements
- Show Top N relevant notifications quickly.
2. High-Level Design
- Compute score and maintain max-heap per user window.
3. API Design
- `GET /users/{id}/priority-inbox?limit=20`
4. Database Design
- Store `priority_score` (optional) and update on events.
5. Scaling Strategy
- Real-time score updates via stream processing.
6. Performance Bottlenecks
- Full sort on every fetch.
7. Optimization Techniques
- Heap for Top N (`O(m log n)`), pre-filter by freshness.
8. Tradeoffs
- Slightly stale scores vs lower latency.
9. Reliability
- Deterministic scoring function versioning.
10. Fault Tolerance
- Rebuild scores from event log.

Weighted score:
`score = 0.5*priority + 0.3*recency + 0.2*engagement`
