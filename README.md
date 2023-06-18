# RESTful API Sample Project

Sample [REST](https://en.wikipedia.org/wiki/Representational_state_transfer)ful [API](https://en.wikipedia.org/wiki/API) for [Mflix sample dataset](https://www.mongodb.com/docs/atlas/sample-data/sample-mflix/) based on [Node.js](https://nodejs.org/en/) ([typescript](https://www.typescriptlang.org/)), [mongoDB](https://www.mongodb.com/)
and [Express](https://expressjs.com/). Provides an easy way to perform [CRUD operations](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) on the data. Feel free to use it as a template for your own projects or as a reference for learning.

## 📖 Documentation

For the documentation about supported endpoints and their usage, please import [this collection](https://gist.githubusercontent.com/Ami-hub/6de2c4f52b8c2b9f4a9fce7daa7b2034/raw/a32e1e380eaafbeab16115e8c4cd4052461fccca/Mfix%2520API.postman_collection.json) to your [Postman](https://www.postman.com/) app. The collection contains all the information you need to use the API, including detailed examples.

#

## 📚 Prerequisites

- [Node.js](https://nodejs.org/en/) (v14.17.0 or higher)
- [MongoDB](https://www.mongodb.com/) (v4.4.6 or higher)
- TODO - add instructions to import the sample data

#

## 🚀 Quick start

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

🐧 Linux:

```
cp .env.example .env
```

🪟 Windows:

```
copy .env.example .env
```

Change variable's values by your needs in the .env file.

### 🛠️ Build the app

```
npm run build
```

### 👟 Run the app

```
npm run start
```

### 🎉 Done!

You can open your browser and go to `http://localhost:<.envPort>/api/v1/` to see the welcome message.

You should see the following message:

```json
{
  "message": "Welcome to the API"
}
```

#

## 🏰 Visit my deployed version [here](https://mysite-om0l.onrender.com/api)!

### 🌟 Essence

- This deployed version can help you to test the API without installing anything on your computer.

### ❗Important

- It use the free tier of [render](https://render.com/), so **the first response may take about 1 minute to load**. For more information [click here](https://render.com/docs/free#free-web-services).

- Due to this version is open to the public, some features like
  `DELETE` and `PATCH` requests are disabled.  
   For more information about the deployed version see the [render deployed branch]()

#

## ✍🏽 Authors

- [AmiHub](https://github.com/Ami-hub)

## 🪪 License

- [MIT License](https://github.com/Ami-hub/Sample-RESTful-API/blob/main/LICENSE)
