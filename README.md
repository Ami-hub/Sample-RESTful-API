# 🏰 RESTful API Sample Project Deployed on [Render](https://render.com/)

This deployed version can help you to test the API without running the project locally.  
It stores some sample in its database, so you can test the API without creating any sample.

<p align="center">
  <img src="https://i.ibb.co/bFHnVP6/sample-api-logo.png" alt="sample-api-logo" width="50%">
</p>

# 📚 Prerequisites

- 📮 [Postman](https://www.postman.com/).

<br>

# 📜 Documentation

For the documentation about supported endpoints and their usage, please import [this collection](https://gist.githubusercontent.com/Ami-hub/6de2c4f52b8c2b9f4a9fce7daa7b2034/raw/a32e1e380eaafbeab16115e8c4cd4052461fccca/Mfix%2520API.postman_collection.json) to your [Postman](https://www.postman.com/) app. The collection contains all the information you need to use the API, including detailed examples.

<br>

# 🚀 Quick Start

### ⏬ Download the [Postman collection](https://gist.githubusercontent.com/Ami-hub/6de2c4f52b8c2b9f4a9fce7daa7b2034/raw/a32e1e380eaafbeab16115e8c4cd4052461fccca/Mfix%2520API.postman_collection.json) of the API.
<br>

### 📖 [Import](https://learning.postman.com/docs/getting-started/importing-and-exporting/importing-data/) the collection into Postman.

<br>

### ✅ [Put](https://learning.postman.com/docs/sending-requests/variables/#defining-collection-variables) this [URL](https://mysite-om0l.onrender.com/api) in the variable `BASE URL` of the Postman collection.
<br>

### 👤 Use one of these to login:
  ```json
  {
    "email": "user@gmail.com",
    "password": "123"
  }
  ```
  ```json
  {
    "email": "admin@gmail.com",
    "password": "admin"
  }
  ```
<br>

### 🎉 Done!
You should see the following response for the  `Welcome` request:

```json
{
  "message": "Welcome to the API"
}
```

<br>

## ❗Important

- It use the free tier of [render](https://render.com/), so **the first response may take about 1 minute to load**. For more information [click here](https://render.com/docs/free#free-web-services).

- Due to this version is open to the public, some features like
  `DELETE` and `PATCH` requests are disabled.
