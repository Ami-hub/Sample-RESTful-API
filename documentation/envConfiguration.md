# ⚙️ Environment Variables Configuration Explanation

This document provides an explanation of the environment variables for the configuration of the application. The environment variables are used to customize various aspects of the application behavior. Ensure that you have set these environment variables appropriately in your deployment environment or in the `.env` file in the root directory of the application.

Below is the list of environment variables along with their descriptions and default values:

## Required Environment Variables

### MONGODB_URI

- **Description:** The MongoDB URI to connect to the cluster (without the database name or any other parameters)
- **Example:**
  ```env
  MONGODB_URI=mongodb+srv://username:password@cluster0.1a2b3c4.mongodb.net/
  ```
- **Additional information:** For more information on the MongoDB Connection String URI Format, refer to the [MongoDB Connection Strings documentation](https://docs.mongodb.com/manual/reference/connection-string/).

### DB_NAME

- **Description:** The name of the database to use.
- **Example:**
  ```env
  DB_NAME=sample_mflix
  ```

## Optional Environment Variables

### LOG_LEVEL

- **Description:** The log level of the application.
- **Available choices:** `error`, `warn`, `info`, `http`, `verbose`, `debug`, `silly`.
- **Default value:** `http`.

### PORT

- **Description:** The exposed port of the application.
- **Default value:** `3000`.
- **Additional information:** Make sure the port you choose is not already in use!

### DEFAULT_PAGE_SIZE

- **Description:** The default amount of entities to return per request.
- **Default value:** `15`.

### MAX_PAGE_SIZE

- **Description:** The maximum amount of entities to return per request.
- **Default value:** `50`.

### CONNECT_DB_TIMEOUT_MS

- **Description:** The maximum time to wait for a database connection to be established.
- **Default value:** `15000` (15 seconds).

### ENABLE_LISTENING_TO_ALL_INTERFACES

- **Description:** Whether to listen to all network interfaces or not.
- **Default value:** `true`.
- **Additional information:** While [using Docker](dockerStart.md), this must be set to `true`.

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

### ENABLE_RECONNECTING

- **Description:** Whether to enable reconnecting to the database if the connection fails.
- **Default value:** `true`.

### RECONNECTING_INTERVAL_MS

- **Description:** The interval in which the application will try to reconnect to the database if the connection fails.
- **Default value:** `15000` (15 seconds).
- **Additional information:** If [`ENABLE_RECONNECTING`](#enable_reconnecting) is false, this property will be ignored.

### ENABLE_CACHING

- **Description:** Whether to enable caching of the responses or not.
- **Available choices:** `true`, `false`.
- **Default value:** `true`.

### REDIS_URI

- **Description:** The Redis URI to connect to the cluster
- **Example:**
  ```env
  REDIS_URI=redis://alice:foobared@awesome.redis.server:6380
  ```
- **Default value:** `redis://localhost:6379`.
- **Additional information:** The connection string is in this format:
  `redis[s]://[[username][:password]@][host][:port][/db-number]`

### DEFAULT_CACHE_EXPIRY_SEC

- **Description:** The default time to keep a response as valid in the cache in seconds.
- **Default value:** `300` (5 minutes).

Please make sure to set these environment variables according to your specific deployment environment to ensure the proper functioning of the application.
