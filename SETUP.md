# Setup

*Note*: This project requires a Supabase, Courier and Redis instance. You can get them from [Supabase](https://supabase.io), [Courier](https://courier.com) and [Redis](https://redis.io/).


First, clone the repo and install the dependencies:

```bash
git clone https://github.com/n4ze3m/real-me.git
```

Next, create a `.env` file in the root of the project and add the following:

```bash
cp .env.example .env
```

Then, add the following environment variables to the `.env` file:

```bash

If you open the `.env` file, you'll see the following:

```bash
# Required
DATABASE_URL=""
REDIS_URL=""
COURIER_AUTH_TEMPLATE_ID=""
COURIER_API_KEY=""
ACCESS_TOKEN_PRIVATE_KEY=""
ACCESS_TOKEN_PUBLIC_KEY=""
REFRESH_TOKEN_PRIVATE_KEY=""
REFRESH_TOKEN_PUBLIC_KEY=""
NEXT_PUBLIC_COURIER_CLIENT_KEY=""
COURIER_API_KEY_NOTIFICATIONS=""
COURIER_NOTIFICATION_TEMPLATE_ID=""
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
# Optional
HOST_URL=""
```

- `DATABASE_URL`: The URL of your Supabase database. You can get it from the Supabase dashboard.
- `REDIS_URL`: The URL of your Redis instance. You can get it from the Redis dashboard.
- `COURIER_AUTH_TEMPLATE_ID`: The ID of the Courier template
- `COURIER_API_KEY`: The API key of your Courier account. You can get it from the Courier dashboard.
- `ACCESS_TOKEN_PRIVATE_KEY`: The private key for the access token. You can generate it using `openssl genrsa -out access_token_private.pem 2048`.
- `ACCESS_TOKEN_PUBLIC_KEY`: The public key for the access token. You can generate it using `openssl rsa -in access_token_private.pem -pubout -out access_token_public.pem`.
- `REFRESH_TOKEN_PRIVATE_KEY`: The private key for the refresh token. You can generate it using `openssl genrsa -out refresh_token_private.pem 2048`.
- `REFRESH_TOKEN_PUBLIC_KEY`: The public key for the refresh token. You can generate it using `openssl rsa -in refresh_token_private.pem -pubout -out refresh_token_public.pem`.
- `NEXT_PUBLIC_COURIER_CLIENT_KEY`: The client key of your Courier account. You can get it from the Courier dashboard.
- `COURIER_API_KEY_NOTIFICATIONS`: The API key of your Courier account. You can get it from the Courier dashboard.
- `COURIER_NOTIFICATION_TEMPLATE_ID`: The ID of the Courier template
- `NEXT_PUBLIC_SUPABASE_URL`: The URL of your Supabase database. You can get it from the Supabase dashboard.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The anonymous key of your Supabase database. You can get it from the Supabase dashboard.
- `HOST_URL`: The URL of your application. This is optional, but if you want to use the `Forgot Password` feature, you'll need to set this.

After you've added the environment variables, Next step is to migrate the database. You can do that by running the following command:

```bash
npx prisma db push
```

*Note*: This is only required for the first time. After that, you can use `npx prisma migrate dev` to migrate the database.

Next, install the dependencies and run the development server:

```bash
npm install
```

And lastly, run the following command to start the application:

```bash
npm run dev
```