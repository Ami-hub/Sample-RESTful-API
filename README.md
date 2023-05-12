# RESTful API Sample Project

This app implements a RESTful API for the [Sample Analytics Dataset](https://www.mongodb.com/docs/atlas/sample-data/sample-analytics/) in MongoDB. This app is designed to provide easy access to the data stored in the database, allowing you to perform CRUD (Create, Read, Update, Delete) operations, and [even more](documentation/api.md).

## 🔗 Dependencies

- 📒 [node](https://nodejs.org/en/)
- 📦 [npm](https://www.npmjs.com/)
- 🍃 [mongo](https://www.mongodb.com/)

<br>

#

## 🚀 Quick start

### ⬇️ Clone the repo from github

```
$ git clone https://github.com/Ami-hub/Sample-RESTful-API.git
```

### 🚶🏽‍♀️ Go to the app directory

```
$ cd RESTful-API-Example
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

You can open your browser and go to http://localhost:${.envPort}/api

You should see the following message:

```json
{
  "message": "Welcome to the API"
}
```

<br>

#

## 🏰 Visit my deployed version [here](https://mysite-om0l.onrender.com/api)!

### 🌟 Essence

- This deployed version can help you to test the API without installing anything on your computer.

### ❗Important

- It use the free tier of [render](https://render.com/), so the **first** response may take a about 10 seconds to load.  
  For more information [click here](https://render.com/docs/free#free-web-services).
  <br>

- Due to this version is open to the public, `DELETE` and `PUT` requests are disabled.  
  For more information about the deployed version see the [render deployed branch]()
  <br>

#

## ✍🏽 Authors

- [AmiHub](https://github.com/Ami-hub)

<br>

## 📝 License

- [MIT License ©](https://github.com/Ami-hub/Sample-RESTful-API/blob/main/LICENSE)
