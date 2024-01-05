# Web Programming Group 18 Final Project - NewTaste

## Run the project

1. Install dependencies
   ```bash
   yarn
   ```
2. Get Pusher credentials
   Please refer to the [Pusher Setup](#pusher-setup) section for more details.

3. Get Cloundinary assets
   Follow the instruction in https://youtu.be/PGPGcKBpAk8?t=17549 to get cloundinary cloud name and cloud preset.

4. Create `.env.local` and copy `.env.example` to `.env.local`. Add the following content:

   ```text
    POSTGRES_URL=

    PUSHER_ID=
    NEXT_PUBLIC_PUSHER_KEY=
    PUSHER_SECRET=
    NEXT_PUBLIC_PUSHER_CLUSTER=

    AUTH_SECRET=RANDOM_STRING_2

    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
    NEXT_PUBLIC_CLOUDINARY_CLOUD_PRESET=

    NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

5. If you wish to use docker to build a postgresql server then use this command to start the database
   ```bash
   docker compose up -d
   ```
   After executing this, the `POSTGRES_URL` should be
   ```
   postgres://postgres:postgres@localhost:5432/leftover
   ```
6. Run migrations
   ```bash
   yarn migrate
   ```
7. Start the development server
   ```bash
   yarn dev
   ```
8. Open http://localhost:3000 in your browser
9. Test account, no need to sign up, use this to login
   ```text
   帳號：test123
   密碼：test123
   ```

## Distribution of work

吳郁心: backend, including API, pusher and some frontend function (e.g. reservation). (Me)

李宇軒: backend, including DB schema, NextAuth and image uploading function.

劉倍嘉: frontend and some backend API (e.g. fetch data based on category).
