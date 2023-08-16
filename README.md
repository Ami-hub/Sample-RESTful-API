# ❤️‍🔥 RESTful API Sample Project

A sample [REST](https://en.wikipedia.org/wiki/Representational_state_transfer)ful [API](https://en.wikipedia.org/wiki/API) based on the data of [Mflix sample dataset](https://www.mongodb.com/docs/atlas/sample-data/sample-mflix/) using [typescript](https://www.typescriptlang.org/), [mongoDB](https://www.mongodb.com/),
and [fastify](https://www.fastify.io/). The API provides an easy way to perform [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations on the data, with fast response times. Feel free to use it as a template for your own projects or as a reference for learning.

<div style="text-align: center;">
  <img src="https://i.ibb.co/bFHnVP6/sample-api-logo.png" alt="sample-api-logo" width="55%">
</div>

# 📖 Documentation

For the documentation about supported endpoints and their usage, please import [this collection](https://gist.githubusercontent.com/Ami-hub/6de2c4f52b8c2b9f4a9fce7daa7b2034/raw/a32e1e380eaafbeab16115e8c4cd4052461fccca/Mfix%2520API.postman_collection.json) to your [Postman](https://www.postman.com/) app. The collection contains all the information you need to use the API, including detailed examples.

<br>
<br>

# 🚀 Quick start or [quick start with Docker](./documentation/dockerStart.md)

## 📚 Prerequisites

- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/) cluster with [mflix sample data](https://www.mongodb.com/docs/atlas/sample-data/sample-mflix/) loaded (see how to [load sample data](https://www.mongodb.com/docs/guides/atlas/sample-data/))

<br>

## 🚀 Let's get started!

### ⬇️ Clone the repo from github

```
git clone https://github.com/Ami-hub/Sample-RESTful-API.git
```

### 🚗 Go to the app directory

```
cd Sample-RESTful-API
```

### 📦 Install dependencies

```
npm i
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

2. Modify the `.env` file to match your needs and environment, see [environment variables documentation](./documentation/envConfiguration.md).  
    For example:

   ```env
   MONGODB_URI=mongodb+srv://name:pass@cluster0.1a2b3c4.mongodb.net/
   DB_BASE_NAME=sample_mflix
   LOG_LEVEL=silly
   ...
   ```

### 🛠️ Build the app

```
npm run build
```

### 👟 Run the app

```
npm run start
```

### 🎉 Done!

You can open your browser and go to `http://localhost:3000/` (or whatever port you chose) to see the welcome message.

You should see the following message:

```json
{
  "message": "Welcome to the API"
}
```

<br>
<br>

# 🏰 Visit my deployed version [here](https://mysite-om0l.onrender.com/)!

### 🌟 Essence

- This deployed version can help you to test the API without installing anything on your computer.

### ❗Important

- It use the free tier of [render](https://render.com/), so **the first response may take about 1 minute to load**. For more information [click here](https://render.com/docs/free#free-web-services).

- Due to this version is open to the public, some features like
  `DELETE` and `PATCH` requests are disabled.  
   For more information about the deployed version see the [render deployed branch]()

<br>
<br>

# ✍🏽 Authors

- [AmiHub](https://github.com/Ami-hub)

<br>
<br>

# 🪪 License

- [MIT License](https://github.com/Ami-hub/Sample-RESTful-API/blob/main/LICENSE)
