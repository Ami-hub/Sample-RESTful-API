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

2. Modify the `.env` file to match your needs and environment, see [environment variables documentation](envConfiguration.md).  
   For example:

   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.1a2b3c4.mongodb.net/
   DB_NAME=sample_mflix
   LOG_LEVEL=debug
   ...
   ```

### 🖼️ Build the docker image

Make sure your Docker daemon is running!

```
docker build -t sample-restful-api .
```

### 👟 Run the app using docker

Make sure the port you write after `-p` (`3000` in this example) matches the port you wrote in the `.env` file.  
If you didn't set a port in the `.env` file, the default port is `3000`.

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
