# JobHunt — Backend

A Node.js/Express/MongoDB API for tracking job applications: signup/login with
JWT cookie auth, and full CRUD on job applications scoped to the logged-in user.

## Tech stack

- **Runtime:** Node.js, Express 5
- **Database:** MongoDB via Mongoose
- **Auth:** JWT (`jsonwebtoken`) stored in an httpOnly cookie (`cookie-parser`)
- **Passwords:** Hashed with Bcrypt
- **Validation:** `validator` (email format, password strength)
- **Dev tooling:** Nodemon

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root (same level as `package.json`):

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=777
```

Never commit `.env` — it's already covered by `.gitignore`. See `.env.example`
for the expected shape.

### 3. Run it

```bash
npm run dev
```

Starts on `http://localhost:777` (or whatever `PORT` is set to). Nodemon
restarts automatically on file changes.

The server only starts listening **after** the MongoDB connection succeeds —
if you see a connection error on startup, the process exits rather than
silently running without a working database.

## Project structure

```
src/
├── app.js                 # Express app entry point
├── config/
│   └── dataBase.js        # MongoDB connection
├── middleware/
│   └── userAuth.js        # JWT cookie verification, attaches req.user
├── models/
│   ├── userSchema.js      # User model + password/JWT helper methods
│   └── jobs.js            # Job application model
├── routes/
│   ├── authRouter.js      # /signup, /login, /logout
│   └── jobRouter.js       # Job CRUD routes
└── utils/
    └── validate.js        # Input validation helpers
```

## Data models

### User

| Field | Type | Notes |
|---|---|---|
| `firstName` | String | required |
| `lastName` | String | required |
| `email` | String | required, unique |
| `password` | String | required, stored as a Bcrypt hash |
| `profilePic` | String | optional |
| `createdAt` / `updatedAt` | Date | auto |

Instance methods:
- `getjwt()` — signs and returns a JWT containing the user's `_id`
- `verifyPassword(password)` — compares a plaintext password against the stored hash

### Job application

| Field | Type | Notes |
|---|---|---|
| `user` | ObjectId (ref `User`) | required — owner of the application |
| `title` | String | required, trimmed |
| `company` | String | required, trimmed |
| `location` | String | required, trimmed |
| `status` | String (enum) | `Applied` \| `Interviewing` \| `Rejected` \| `Offered` — default `Applied` |
| `date` | Date | default: now |
| `jobPosition` | String (enum) | `Internship` \| `Full Time` \| `Part Time` — default `Full Time` |
| `jobType` | String (enum) | `onsite` \| `Hybrid` \| `Work from home` — default `onsite` |
| `createdAt` / `updatedAt` | Date | auto |

## API reference

Base URL: `http://localhost:777` (all routes mounted at `/`).

### Auth — `authRouter.js`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/signup` | No | Creates a user, hashes password, sets `token` cookie (8h expiry) |
| POST | `/login` | No | Verifies credentials, sets `token` cookie (8h expiry) |
| POST | `/logout` | Yes | Clears the `token` cookie |

**Signup/Login body:**
```json
{ "firstName": "Ada", "lastName": "Lovelace", "email": "ada@example.com", "password": "Str0ng!Pass" }
```
Login only needs `email` and `password`. Passwords must satisfy
`validator.isStrongPassword` (8+ chars, upper + lower + number + symbol).

### Jobs — `jobRouter.js`

All routes require a valid `token` cookie.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/jobs` | Returns all job applications belonging to the authenticated user |
| POST | `/addPost` | Creates a job application for the authenticated user |
| PATCH | `/updatepost/:job_id` | Updates one or more of: `title`, `company`, `location`, `status`, `jobPosition`, `jobType` |
| POST | `/deletepost/:job_id` | Deletes the specified job application |

> Note: `/deletepost/:job_id` is intentionally a `POST`, not a `DELETE`,
> matching the existing route definition — a client should call it as `POST`.

**Add/update body example:**
```json
{ "title": "Frontend Engineer", "company": "Acme Inc.", "location": "Remote", "status": "Interviewing" }
```

## Auth flow

1. `/signup` or `/login` succeeds → server signs a JWT (`{ _id }`) and sets it
   as an **httpOnly** cookie named `token`.
2. Because it's httpOnly, client-side JavaScript can never read it — the
   browser just attaches it automatically on future requests to this origin.
3. `userAuth` middleware reads `req.cookies.token` on protected routes,
   verifies it with `JWT_SECRET`, loads the user, and attaches it as `req.user`.
4. `/logout` clears the cookie. The cookie also expires on its own after 8 hours.

## Known gaps / things worth adding next

- **No session-check endpoint.** There's no `GET /me` to ask "who am I,
  am I still logged in" — clients currently have to infer this from a 401 on
  any protected call. Adding a thin `GET /me` that returns `req.user` (reusing
  `userAuth`) would make frontend session handling more robust.
- **No server-side filter/sort/search on `GET /jobs`.** It currently returns
  the full list; query params (`?status=Applied&search=...`) aren't read yet.
  Building this out with Mongoose query filters would let clients filter
  large lists without pulling everything down first.
- **CORS isn't configured** for cross-origin deployments. If the frontend and
  backend end up on different domains in production, add the `cors` package:
  ```js
  app.use(cors({ origin: 'https://your-frontend-domain.com', credentials: true }));
  ```
  and set the cookie with `secure: true, sameSite: 'none'` in `authRouter.js`.

## Environment variables reference

| Variable | Required | Description |
|---|---|---|
| `MONGO_URI` | Yes | MongoDB Atlas connection string, including database name |
| `JWT_SECRET` | Yes | Secret used to sign/verify JWTs |
| `PORT` | No (default `777`) | Port the server listens on |
