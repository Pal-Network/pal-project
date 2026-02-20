# Pal API

## Development

```bash
npm run dev -w @pal/api
```

## Health Check

`GET /api/v1/health` returns a 200 response with a timestamp.

## Stellar Testnet Wallet Helper

Ensure your `.env` contains `STELLAR_FRIENDBOT_URL` and `STELLAR_HORIZON_URL`.

```bash
npm run fund:testnet -w @pal/api
```

The script prints the funded public and secret keys to the console.
