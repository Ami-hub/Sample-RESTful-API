# ⚙️ Environment Variables Configuration Explanation

This document provides an explanation of the environment variables for the configuration of the application.  
Ensure that you have set these environment variables appropriately in your deployment environment or in the `.env` file in the root directory of the project.

## 💾 Database

### MONGODB_URI (Required!)

- **Description:** The MongoDB URI to connect to the cluster (without the database name or any other parameters)
- **Example:**
  ```env
  MONGODB_URI=mongodb+srv://username:password@cluster0.1a2b3c4.mongodb.net/
  ```
- **Additional information:** For more information on the MongoDB Connection String URI Format, refer to the [MongoDB Connection Strings documentation](https://docs.mongodb.com/manual/reference/connection-string/).  
  When using Docker and local Redis, make sure you set the network properly.

### DB_NAME (Required!)

- **Description:** The name of the database to use.
- **Example:**
  ```env
  DB_NAME=sample_mflix
  ```

### CONNECT_DB_TIMEOUT_MS

- **Description:** The maximum time to wait for a database connection to be established.
- **Default value:** `15000` (15 seconds).

### MAX_DB_POOL_SIZE

- **Description:** The maximum pool size of the database connections.
- **Default value:** `20`.
- **Additional information:** For more information, refer to [Connection Pooling in MongoDB](https://mongodb.com/blog/post/server-side-connections-are-coming-to-the-node-js-driver).

### MIN_DB_POOL_SIZE

- **Description:** The minimum pool size of the database connections.
- **Default value:** `10`.
- **Additional information:** For more information, refer to [Connection Pooling in MongoDB](https://mongodb.com/blog/post/server-side-connections-are-coming-to-the-node-js-driver).

### MAX_IDLE_TIME_DB_MS

- **Description:** The maximum time a connection can remain idle in the pool before being removed and closed.
- **Default value:** `60000` (1 minute).
- **Additional information:** For more information, refer to [Connection Pooling in MongoDB](https://mongodb.com/blog/post/server-side-connections-are-coming-to-the-node-js-driver).

### WRITE_CONCERN

- **Description:** The write concern level of the database.
- **Available choices:** `majority`, `0`, `1`, `2`.
- **Default value:** `majority`.
- **Additional information:** For more information, refer to [MongoDB Write Concern](https://mongodb.com/docs/manual/reference/write-concern/).

### WRITE_CONCERN_TIMEOUT

- **Description:** The write concern timeout of the database in milliseconds.
- **Default value:** `3000` (3 seconds).
- **Additional information:** For more information, refer to [MongoDB Write Concern](https://mongodb.com/docs/manual/reference/write-concern/).

### RECONNECTING_INTERVAL_DB_S

- **Description:** The interval in which the application will try to reconnect to the database if the connection fails (in seconds).
- **Default value:** `15`

## 🌐 Network

### PORT

- **Description:** The exposed port of the application.
- **Default value:** `3000`.
- **Additional information:** Make sure the port you choose is not already in use!

### ENABLE_LISTENING_TO_ALL_INTERFACES

- **Description:** Whether to listen to all network interfaces or not.
- **Default value:** `true`.
- **Additional information:** While [using Docker](dockerStart.md), this must be set to `true`.

## 🔐 Authentication

### JWT_SECRET

- **Description:** The secret of the JSON Web Token (JWT) used for authentication.
- **Default value:** A base64 encoded string of 256 random bytes.
- **Example:**
  ```env
  JWT_SECRET=OGUxNGE2M2hkM2YyMzAwMDE3NmQ4MmYxYz...
  ```

### JWT_EXPIRES_MINUTES

- **Description:** The expiration time of the JWT in minutes.
- **Default value:** `30`.

## 📝 Logging

### ENABLE_LOGGING

- **Description:** Whether to enable any logging or not.
- **Default value:** `true`.

### LOG_LEVEL

- **Description:** The log level of the application.
- **Available choices:** `fatal`, `error`, `warn`, `info`, `debug`, `trace`.
- **Default value:** `info`.

## 📖 Pagination

### DEFAULT_PAGE_SIZE

- **Description:** The default amount of entities to return per request.
- **Default value:** `15`.

### MAX_PAGE_SIZE

- **Description:** The maximum amount of entities to return per request.
- **Default value:** `50`.

## ⛔ Rate Limiting

### ENABLE_RATE_LIMITING

- **Description:** Whether to enable rate limiting or not.
- **Default value:** `false`.
- **Additional information:** If you disable rate limiting, the following environment variables will be ignored.

### RATE_LIMIT_WINDOW_MS

- **Description:** The time window in which the rate limit is applied (in milliseconds).
- **Default value:** `60000` (1 minute).

### RATE_LIMIT_MAX_REQUESTS

- **Description:** The maximum number of requests allowed in the time window.
- **Default value:** `30`.

### REDIS_URI

- **Description:** The Redis URI to use for the rate limiting.
- **Default value:** `redis://localhost:6379`.
- **Additional information:** When using Docker and local Redis, make sure you set the network properly.
