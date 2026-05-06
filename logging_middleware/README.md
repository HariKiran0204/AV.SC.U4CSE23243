# Logging Middleware

## Features
- Structured log payload
- Request correlation ID (`x-request-id`)
- Runtime validation (Zod)
- Global request logging middleware
- Retry with exponential backoff (3 attempts)
- Safe fallback (never crashes app)

## Endpoint
- `POST /api/v1/logs`

## Log Payload
```json
{
  "stack": "backend",
  "level": "info",
  "package": "middleware",
  "message": "Request completed",
  "requestId": "optional",
  "metadata": {},
  "timestamp": "optional"
}
```

## Run
```bash
npm install
npm run build
npm start
```
