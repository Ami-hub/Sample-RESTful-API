# Full API Documentation

This documentation provides a guide for using the RESTful API for the [Sample Mflix Dataset](https://www.mongodb.com/docs/atlas/sample-data/sample-mflix/) in MongoDB. See here all routes and examples of requests and responses.

## Base URL

In the following documentation, we will assume that the API is hosted at https://mySite/.

## Authentication

### `POST /login`

To get access to the API, you need to provide a valid token in the `Authorization` header of your request. The token is a [JSON Web Token](https://jwt.io/introduction) that you can get by logging in with a valid user account. The token will be valid for **12 hours**.

#### Example Request

```powershell
curl -X POST -H "Content-Type: application/json" -d '{"email":"my@email.com", "password":"myPassword"}' "https://www.mySite.com/api/v1/login"
```

#### Example Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXvCJ9..."
}
```

Now, you can use the token to access the API. Just add the token to the `Authorization` header of your request. See examples in the following sections.

## Endpoints

### `GET /entitiesName`

Returns all the data in the collection.

#### Example Request

```powershell
curl -H "Authorization: eyJhb..." "https://www.mySite.com/api/v1/accounts/"
```

#### Example Response

```json
[
  {
    "_id": "5ca4bbc7a2dd94ee581625cb",
    "account_id": 614528,
    "limit": 10000,
    "products": [
      "Derivatives",
      "Commodity",
      "CurrencyService",
      "InvestmentFund",
      "InvestmentStock"
    ]
  },
  {
    "_id": "5ca4bbc7a2dd94ee581625d3",
    "account_id": 343230,
    "limit": 10000,
    "products": [
      "Brokerage",
      "CurrencyService",
      "InvestmentStock"
    ],
  },
  ...
]
```

### `GET /data/:id`

Returns the data item with the specified ID.

#### Example Request

```powershell
curl -H "Authorization: eyJhb..." "https://www.mySite.com/api/v1/accounts/5ca4bbc7a2dd94ee5816238c"
```

#### Example Response

```json
{
  "_id": "5ca4bbc7a2dd94ee5816238c",
  "account_id": 371138,
  "limit": 9000,
  "products": ["Derivatives", "InvestmentStock"]
}
```

### `POST /data`

Creates a new item.

#### Example Request

```powershell
curl -X POST -H "Authorization: eyJhb..." -H "Content-Type: application/json" -d '{
  "country": "United States",
  "state": "New York",
  "city": "New York City",
  "population": 8336817,
  "date": "2021-05-12T00:00:00.000Z"
}' "https://www.mySite.com/api/v1/resource"
```

#### Example Response

```json
{
  "_id": "60a1b1c1eaa3e9ba185af7ca",
  "country": "United States",
  "state": "New York",
  "city": "New York City",
  "population": 8336817,
  "date": "2021-05-12T00:00:00.000Z",
  "__v": 0
}
```

### `PATCH /data/:id`

Modifies the item with the specified ID.

#### Example Request

```powershell
curl -X PATCH -H "Authorization: eyJhb..." -H "Content-Type: application/json" -d '{"country": "Narnia"}' "https://www.mySite.com/api/v1/resource/60a1b1c1eaa3e9ba185af7ca"
```

```json
{
  "_id": "60a1b1c1eaa3e9ba185af7ca",
  "country": "Narnia",
  "state": "New York",
  "city": "New York City",
  "population": 8336817,
  "date": "2021-05-12T00:00:00.000Z",
  "__v": 0
}
```
