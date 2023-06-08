# RESTful API Sample Project

This project implements a [REST](https://en.wikipedia.org/wiki/Representational_state_transfer)ful [API](https://en.wikipedia.org/wiki/API) in [typescript](https://www.typescriptlang.org/) that provides easy access to the data stored in the database, this allowing you to perform [CRUD operations](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete).
The code designed to be easily modified, extended and maintained.

## 📖 Documentation

For the documentation about supported endpoints and their usage, please import [this collection](https://gist.githubusercontent.com/Ami-hub/6de2c4f52b8c2b9f4a9fce7daa7b2034/raw/a32e1e380eaafbeab16115e8c4cd4052461fccca/Mfix%2520API.postman_collection.json) to your [Postman](https://www.postman.com/) app. The collection contains all the information you need to use the API, including detailed examples.

#

## 🚀 Quick start

### ⬇️ Clone the repo from github

```
$ git clone https://github.com/Ami-hub/Sample-RESTful-API.git
```

### 🚗 Go to the app directory

```
$ cd Sample-RESTful-API
```

### 📦 Install dependencies

```
$ npm i
```

### ⚙️ Set up the environment variables

Linux:

```
$ cp .env.example .env
```

Windows:

```
$ copy .env.example .env
```

Now fill in the values by your needs in the .env file.

### 🛠️ Build the app

```
$ npm run build
```

### 👟 Run the app

```
$ npm run start
```

### 🎉 Done!

You can open your browser and go to http://localhost:<.envPort>/api/v1/

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
