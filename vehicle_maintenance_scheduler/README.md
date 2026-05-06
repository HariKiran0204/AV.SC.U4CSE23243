# Vehicle Maintenance Scheduler Microservice

## Document-Aligned Flow
This module follows the evaluation document constraints:
- Uses protected external APIs from `http://20.207.122.201/evaluation-service`
- Does **not** use app-level user registration/login for business APIs
- Uses reusable logging function exactly as:

```ts
Log(stack, level, package, message)
```

## External APIs Used
- `POST /evaluation-service/auth`
- `GET /evaluation-service/depots`
- `GET /evaluation-service/vehicles`
- `POST /evaluation-service/logs`

## Local APIs (your app)
- `GET /api/v1/depots`
- `GET /api/v1/vehicles`
- `POST /api/v1/depots/:depotId/schedule`

## Scheduler Output (exact)
```json
{
  "depotId": "1",
  "availableHours": 60,
  "selectedTasks": [],
  "totalHoursUsed": 0,
  "totalImpactScore": 0
}
```

## Setup
1. Copy `.env.example` to `.env`
2. Fill values from the evaluation email/form:
- `EMAIL`
- `NAME`
- `ROLL_NO`
- `ACCESS_CODE`
- `CLIENT_ID`
- `CLIENT_SECRET`

3. Run:
```bash
npm install
npm run dev
```

## Postman
For each local API call, pass header:
`Authorization: Bearer <any-token>`

(Protected-route behavior in this app checks Bearer presence; external service auth is handled server-side.)
