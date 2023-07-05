# 🐳 Quick start with [Docker](https://www.docker.com/)

## 📚 Prerequisites

- [Docker](https://www.docker.com/)
- [Npm](https://www.npmjs.com/) with [ts-node](https://www.npmjs.com/package/ts-node) installed globally
- [MongoDB](https://www.mongodb.com/) cluster with [mflix sample data](https://www.mongodb.com/docs/atlas/sample-data/sample-mflix/) loaded (see how to [load sample data](https://www.mongodb.com/docs/guides/atlas/sample-data/))

#

## 🚀 Let's get started!

### ⬇️ Clone the repo from github

```
git clone https://github.com/Ami-hub/Sample-RESTful-API.git
```

### 🚗 Go to the app directory

```
cd Sample-RESTful-API
```

### ⚙️ Set up the environment variables

1. Create a `.env` file based on the `.env.example` file:  
   🐧 Linux:

   ```
   cp .env.example .env
   ```

   🪟 Windows:

   ```
   copy .env.example .env
   ```

2. Modify the `.env` file to match your needs and environment, e.g.:

   ```env
   ENABLE_LISTENING_TO_ALL_INTERFACES=true # Must be true when using docker!
   MONGODB_URI=mongodb+srv://name:pass@cluster0.1a2b3c4.mongodb.net/
   DB_BASE_NAME=sample_mflix
   LOG_LEVEL=debug
   ...
   ```

### 🖼️ Build the docker image

```
npm run docker-build
```

### 👟 Run the app using docker

Make sure there is no other app running on the port you set in the `.env` file!

```
npm run docker-start
```

### 🎉 Done!

You can open your browser and go to `http://localhost:<.env.Port>/api/v1` to see the welcome message.

You should see the following message:

```json
{
  "message": "Welcome to the API"
}
```
