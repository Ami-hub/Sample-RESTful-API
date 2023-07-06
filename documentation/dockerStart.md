# 🐳 Quick start with [Docker](https://www.docker.com/)

## 📚 Prerequisites

- [Docker](https://www.docker.com/)
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
docker build -t sample-restful-api .
```

### 👟 Run the app using docker

The default port is `3000`, but you can change it to any other free port you want, just set the `PORT` variable in the `.env` file and use the same port in the `docker run` command.

```
docker run -p 3000:3000 --env-file .env sample-restful-api
```

### 🎉 Done!

You can open your browser and go to `http://localhost:3000/api/v1` (or whatever port you chose) to see the welcome message.

You should see the following message:

```json
{
  "message": "Welcome to the API"
}
```
