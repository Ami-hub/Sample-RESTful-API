# RESTful API Sample Project

This project implements a [REST](https://en.wikipedia.org/wiki/Representational_state_transfer)ful [API](https://en.wikipedia.org/wiki/API) in [typescript](https://www.typescriptlang.org/) that provides easy access to the data stored in the database, this allowing you to perform [CRUD operations](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete).
The code designed to be easily modified, extended and maintained.

See the [full API documentation](documentation/api.md) for the information about supported endpoints and their usage.

#

## 🦾 Technologies used

- 🔒 [bcrypt](https://github.com/kelektiv/node.bcrypt.js#readme)
- 🪗 [express](https://expressjs.com/)
- 🗝️ [jwt](https://jwt.io/)
- 🍃 [mongo\*](https://www.mongodb.com/)
- 📒 [node](https://nodejs.org/en/)
- 📦 [npm](https://www.npmjs.com/)
- 📐 [prisma](https://www.prisma.io/)
- 🌀 [typescript](https://www.typescriptlang.org/)
- 📝 [winston](https://github.com/winstonjs/winston#readme)
- 🔪 [zod](https://zod.dev/)

This project sample data is [Sample Mflix Dataset](https://www.mongodb.com/docs/atlas/sample-data/sample-mflix/) in [MongoDB](https://www.mongodb.com/), but can be easily modified to work with any other dataset in any other database.

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

You can open your browser and go to http://localhost:${.envPort}/api

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

- It use the free tier of [render](https://render.com/), so the **first** response may take a about **1 minute** to load.  
  For more information [click here](https://render.com/docs/free#free-web-services).
  <br>

- Due to this version is open to the public, `DELETE` and `PATCH` requests are disabled.  
  For more information about the deployed version see the [render deployed branch]()
  <br>

#

## ✍🏽 Authors

- [AmiHub](https://github.com/Ami-hub)

## 🪪 License

- [MIT License](https://github.com/Ami-hub/Sample-RESTful-API/blob/main/LICENSE)
