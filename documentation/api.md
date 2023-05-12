# Full API Documentation

This documentation provides a guide for using the RESTful API for the [Sample Analytics Dataset](https://www.mongodb.com/docs/atlas/sample-data/sample-analytics/) in MongoDB. See here all routes and examples of requests and responses.

## Base URL

In the following documentation, we will assume that the API is hosted at https://mySampleSite/.

## Authentication

This API does not require any authentication to access the data.

## Endpoints

### `GET /entitiesName`

Returns all the data in the collection.

#### Example Request

```powershell
curl "https://www.example.com/api/accounts/"
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
curl "https://www.example.com/api/accounts/5ca4bbc7a2dd94ee5816238c"
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

Creates a new data item.

#### Example Request

```powershell
curl -X POST -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}' "https://www.example.com/api/resource"
```

```json
{
  "country": "United States",
  "state": "New York",
  "city": "New York City",
  "population": 8336817,
  "date": "2021-05-12T00:00:00.000Z"
}
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

### `PUT /data/:id`

Updates the data item with the specified ID.

#### Example Request

```powershell
curl -X PUT -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}' "https://www.example.com/api/resource"
```

```json
{
  "country": "United States",
  "state": "New York",
  "city": "Alb"
}
```
