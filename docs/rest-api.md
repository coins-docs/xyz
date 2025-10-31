---
title: "Rest-Api"
permalink: /rest-api/
layout: default
nav: sidebar/rest-api.html

---

# Change log:
2025-10-31: Added the `/openapi/v1/check-sys-status` endpoint for checking system status.

2025-10-15: Added the `email` `enableWithdrawWhitelist` parameter for the `/openapi/v1/account` endpoint. Added the `openapi/v1/api-keys` endpoint.

2025-05-21: Added the `statuses` parameter to the `/openapi/wallet/v1/deposit/history` endpoint.

2025-03-25: Added the `/openapi/v1/asset/transaction/history` endpoint.

2024-10-11: Added the `/openapi/v1/sub-account/wallet/deposit/address`,`/openapi/v1/sub-account/wallet/deposit/history` endpoint.

2024-05-10: Added the `from_address` `to_address` parameter to the `/openapi/transfer/v3/transfers` endpoint.

2024-04-29: Added the `inversePrice` response parameter to the `/openapi/convert/query-order-history` endpoint.

2024-04-24: Added <a href="#sub-account-endpoints">Sub-account</a> endpoints: `/openapi/v1/sub-account/list`, `/openapi/v1/sub-account/create`, `/openapi/v1/sub-account/asset`, `/openapi/v1/sub-account/transfer/universal-transfer`, `/openapi/v1/sub-account/transfer/sub-to-master`, `/openapi/v1/sub-account/transfer/universal-transfer-history`, `/openapi/v1/sub-account/transfer/sub-history`, `/openapi/v1/sub-account/apikey/ip-restriction`, `/openapi/v1/sub-account/apikey/add-ip-restriction`, `/openapi/v1/sub-account/apikey/delete-ip-restriction`.

2024-04-17: Added the `targetAmount` parameter to the `/openapi/convert/v1/get-quote` endpoint.

2024-02-19: Added the `openapi/v1/user/ip` endpoint.

2023-12-29: Added kyc remaining and limit to the `/openapi/v1/account` endpoint.

2023-09-20: Added the `message` parameter to the `/openapi/transfer/v3/transfers` endpoint.

2023-08-17: Updated `/openapi/convert/v1/accept-quote` docs.

2023-07-15: Updated `MARKET order type now supports quantity for buy and quoteOrderQty for sell` 

2023-07-15: Added  `stpFlag` in the request of New order (TRADE) endpoint for anti self-trading behaviour.

2023-07-15: Added order status `EXPIRED`.

2023-05-17: The disclaimer regarding the following endpoints being in the QA phase has been removed as the QA process has been successfully completed: `/openapi/account/v3/crypto-accounts`, `/openapi/transfer/v3/transfers`, and `/openapi/transfer/v3/transfers/{id}`.

2023-05-08: Added the following endpoints: `/openapi/account/v3/crypto-accounts`, `/openapi/transfer/v3/transfers`, and `/openapi/transfer/v3/transfers/{id}`. The endpoints are still in QA and are appropriately marked as such.

2023-05-04: Removed the endpoints `/openapi/convert/v1/query-order-history`. 

2023-04-10: Added the `transfer` interfaces.

2022-09-12: Modified the `symbol` in the `Cancel All Open Orders on a Symbol` API request as required.

2022-09-09: Changed the `orderId/transactTime/time/updateTime` response from string to number in order related interfaces.

2022-08-24: Updated the `STOP_LOSS/TAKE_PROFIT` description in the `New order (TRADE)` API.

2022-08-23: Fixed incorrect depth information.

2022-08-19: Added weight information for all interfaces.

2022-08-12: Changed `maxNumOrders` to 200 in `filter MAX_NUM_ORDERS`.

2022-08-12: Changed `maxNumAlgoOrders` to 5 in `filter MAX_NUM_ALGO_ORDERS`.

<!--more-->

# Public Rest API for Coins (2024-05-17)

## General API Information

* The base endpoint is: **https://api.coins.xyz**
* All endpoints return data in either a JSON object or array format.
* Data is returned in **ascending** order, with the oldest records appearing first and the newest records appearing last.
* All time and timestamp related fields are expressed in milliseconds.

## HTTP Return Codes
* HTTP `4XX` return codes are used for malformed requests; the issue is on the sender's side.
* HTTP `403` return code is used when the WAF Limit (Web Application Firewall) has been violated.
* HTTP `429` return code is used when breaking a request rate limit.
* HTTP `418` return code is used when an IP has been auto-banned for continuing to send requests after receiving `429` codes.
* HTTP `5XX` return codes are used for internal errors; the issue is on exchange's side. It is important to **NOT** treat this as a failure operation; the execution status is UNKNOWN and could have been a success.

## Error Codes
* Any endpoint can return an ERROR; the error payload is as follows:

```javascript
{
  "code": -1000,
  "msg": "An unknown error occurred while processing the request."
}
```

* Specific error codes and messages are defined in another document.

## API Library

### Connectors

The following are lightweight libraries that work as connectors to the Coins public API, written in different languages:

* Python <a href="https://github.com/coins-docs/coins-connector-python">https://github.com/coins-docs/coins-connector-python</a> 

### Postman Collections


Postman collections are available, and they are recommended for new users seeking a quick and easy start with the API.

* Postman <a href="https://github.com/coins-docs/coins-api-postman">https://github.com/coins-docs/coins-api-postman</a> 


## General Information on Endpoints

* For `GET` endpoints, parameters must be sent as a `query string`.
* For `POST`, `PUT`, and `DELETE` endpoints, the parameters may be sent as a `query string` or in the `request body` with content type
  `application/x-www-form-urlencoded`. It is also possible to use a combination of parameters in both the query string and the request body if desired.
* Parameters can be sent in any order.
* If a parameter is included in both the `query string` and the `request body`, the value of the parameter from the `query string` will take precedence and be used.



### LIMITS

**General Info on Limits**

* `intervalNum` describes the amount of the interval. For example, `intervalNum 5` with `intervalLetter M` means "Every 5 minutes".

* An HTTP status code 429 will be returned when the rate limit is violated.



### IP Limits

* Each route has a `weight` which determines the number of requests each endpoint counts for. Endpoints with heavier operations or those that involve multiple symbols will have a higher `weight`.
* When a 429 response code is received, it is mandatory for the API user to back off and refrain from making further requests.
* **Repeated failure to comply with rate limits and a disregard for backing off after receiving 429 responses can result in an automated IP ban. The HTTP status code 418 is used for IP bans.**
* IP bans are tracked and their duration increases for repeat offenders, ranging **from 2 minutes to 3 days**.
* A `Retry-After` header is included in 418 or 429 responses, indicating the number of seconds that need to be waited in order to prevent a ban (for 429) or until the ban is lifted (for 418).
* **The limits imposed by the API are based on IP addresses rather than API keys.**



### Order Rate Limits

* When the order count exceeds the limit, you will receive a 429 error without the `Retry-After` header.

* The order rate limit is counted against each IP and UID.



### Websocket Limits

* A single connection can listen to a maximum of 1024 streams.



### /api/ Limit Introduction

* For endpoints related to `/api/*`:

  * There are two modes of limit enforcement: IP limit and UID limit. Each mode operates independently.

  * The IP limit allows a maximum of 1200 requests per minute across all endpoints within the `/api/*` namespace.

  * The UID limit allows a maximum of 1800 requests per minute across all endpoints within the `/api/*` namespace.
 
  

### Endpoint Security Type

* Each endpoint is associated with a security type, which indicates how you should interact with it. The security type is specified next to the name of the endpoint.
  * If no security type is mentioned, assume that the security type is NONE.
* API keys are passed to the Rest API via the `X-COINS-APIKEY` header.
* Both API keys and secret keys **are case sensitive**.
* API keys can be configured to have access only to specific types of secure endpoints. For example, one API key may be restricted to TRADE routes only, while another API key can have access to all routes except TRADE.
* By default, API keys have access to all secure routes.

Security Type | Additional parameter          | Description
------------ |-------------------------------| ------------
NONE | none                          | Endpoint can be accessed freely.
TRADE| `X-COINS-APIKEY`、`signature`、`timestamp` | Endpoint requires sending a valid API Key and signature and timing security. 
USER_DATA| `X-COINS-APIKEY`、`signature`、`timestamp`                         | Endpoint requires sending a valid API Key and signature and timing security.. 
USER_STREAM | `X-COINS-APIKEY`                         | Endpoint requires sending a valid API Key.               
MARKET_DATA | `X-COINS-APIKEY`                         | Endpoint requires sending a valid API Key.               

* `TRADE` and `USER_DATA` endpoints are `SIGNED` endpoints.



### SIGNED (TRADE and USER_DATA) Endpoint Security

* `SIGNED` endpoints require an additional parameter, `signature`, to be
  sent in the  `query string` or `form request body` or `header`.
* Endpoints use `HMAC SHA256` signatures. The `HMAC SHA256 signature` is a keyed `HMAC SHA256` operation.
  Use your `secretKey` as the key and `totalParams` as the value for the HMAC operation.
* The `signature` is **not case sensitive**.
* `totalParams` is defined as the `query string` concatenated with the
  `request body`(exclude `signature` parameters and values If signature parameters are in both).
* We recommend the use of the `query string` for GET requests and the `form request body` for POST requests. However, for Spot Trading APIs, we recommend using the `query string`.



### Timing Security

* A `SIGNED` endpoint requires an additional parameter, `timestamp`, to be sent in the  `query string` or `form request body` or `header`(Not recommended). The `timestamp` should be in millisecond timestamp indicating when the request was created and sent.
* An optional parameter, `recvWindow`, can be included to specify the validity duration of the request in milliseconds after the timestamp. If `recvWindow` is not provided, **it will default to 5000 milliseconds**.
* The logic is as follows:

  ```javascript
  if (timestamp < (serverTime + 1000) && (serverTime - timestamp) <= recvWindow) {
    // process request
  } else {
    // reject request
  }
  ```

**Serious trading is about timing.** Networks can be unstable and unreliable,
which can lead to requests taking varying amounts of time to reach the
servers. With `recvWindow`, you can specify that the request must be
processed within a certain number of milliseconds or be rejected by the
server.

**To ensure optimal performance, it is recommended to use a `recvWindow` value of 5000 milliseconds or less. The maximum value allowed for `recvWindow` is 60,000 milliseconds and should not exceed this limit.**



### SIGNED Endpoint Examples for POST /openapi/v1/order

Here is a step-by-step example of how to send a valid signed payload from the
Linux command line using `echo`, `openssl`, and `curl`:

Key | Value
------------ | ------------
apiKey | tAQfOrPIZAhym0qHISRt8EFvxPemdBm5j5WMlkm3Ke9aFp0EGWC2CGM8GHV4kCYW
secretKey | lH3ELTNiFxCQTmi9pPcWWikhsjO04Yoqw3euoHUuOLC3GYBW64ZqzQsiOEHXQS76

Parameter | Value
------------ | ------------
symbol | BTCPHP
side | BUY
type | LIMIT
timeInForce | GTC
quantity | 1
price | 0.1
recvWindow | 5000
timestamp | 1538323200000



#### Example 1: As a query string

* **queryString:** symbol=BTCPHP&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1538323200000
* **HMAC SHA256 signature:**

```shell
[linux]$ echo -n "symbol=BTCPHP&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1538323200000" | openssl dgst -sha256 -hmac "lH3ELTNiFxCQTmi9pPcWWikhsjO04Yoqw3euoHUuOLC3GYBW64ZqzQsiOEHXQS76"
(stdin)= d7b09aa959094bafd1de10be3985651691fff6cc04b5cd94aea8cc1ca02e0ed8
```

* **curl command:**

```shell
(HMAC SHA256)
[linux]$ curl -H "X-COINS-APIKEY: tAQfOrPIZAhym0qHISRt8EFvxPemdBm5j5WMlkm3Ke9aFp0EGWC2CGM8GHV4kCYW" -X POST 'https://$HOST/openapi/v1/order?symbol=BTCPHP&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1538323200000&signature=d7b09aa959094bafd1de10be3985651691fff6cc04b5cd94aea8cc1ca02e0ed8'
```



#### Example 2: As a request body

* **requestBody:** symbol=BTCPHP&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1538323200000
* **HMAC SHA256 signature:**

```shell
[linux]$ echo -n "symbol=BTCPHP&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1538323200000" | openssl dgst -sha256 -hmac "lH3ELTNiFxCQTmi9pPcWWikhsjO04Yoqw3euoHUuOLC3GYBW64ZqzQsiOEHXQS76"
(stdin)= d7b09aa959094bafd1de10be3985651691fff6cc04b5cd94aea8cc1ca02e0ed8
```

* **curl command:**

```shell
(HMAC SHA256)
[linux]$ curl -H "X-COINS-APIKEY: tAQfOrPIZAhym0qHISRt8EFvxPemdBm5j5WMlkm3Ke9aFp0EGWC2CGM8GHV4kCYW" -X POST 'https://$HOST/openapi/v1/order' -d 'symbol=BTCPHP&side=BUY&type=LIMIT&timeInForce=GTC&quantity=1&price=0.1&recvWindow=5000&timestamp=1538323200000&signature=d7b09aa959094bafd1de10be3985651691fff6cc04b5cd94aea8cc1ca02e0ed8'
```



#### Example 3: Mixed query string and request body

* **queryString:** symbol=BTCPHP&side=BUY&type=LIMIT&timeInForce=GTC
* **requestBody:** quantity=1&price=0.1&recvWindow=5000&timestamp=1538323200000
* **HMAC SHA256 signature:**

```shell
[linux]$ echo -n "symbol=BTCPHP&side=BUY&type=LIMIT&timeInForce=GTCquantity=1&price=0.1&recvWindow=5000&timestamp=1538323200000" | openssl dgst -sha256 -hmac "lH3ELTNiFxCQTmi9pPcWWikhsjO04Yoqw3euoHUuOLC3GYBW64ZqzQsiOEHXQS76"
(stdin)= 340037ed5366e650bd0e09e170db4a6ace0a9cba3e8af4e5c37ba2143fb84de0
```

* **curl command:**

```shell
(HMAC SHA256)
[linux]$ curl -H "X-COINS-APIKEY: tAQfOrPIZAhym0qHISRt8EFvxPemdBm5j5WMlkm3Ke9aFp0EGWC2CGM8GHV4kCYW" -X POST 'https://$HOST/openapi/v1/order?symbol=BTCPHP&side=BUY&type=LIMIT&timeInForce=GTC' -d 'quantity=1&price=0.1&recvWindow=5000&timestamp=1538323200000&signature=340037ed5366e650bd0e09e170db4a6ace0a9cba3e8af4e5c37ba2143fb84de0'
```

Note that in Example 3, the signature is different from the previous examples. Specifically, there should be no `&` character between `GTC` and `quantity=1`.


## Public API Endpoints

### Terminology

These terms will be used throughout the documentation, so new users are encouraged to read them to help their understanding of the API.

* `base asset` refers to the asset that is the `quantity` of a symbol. For the symbol BTCUSDT, BTC would be the `base asset`.
* `quote asset` refers to the asset that is the `price` of a symbol. For the symbol BTCUSDT, USDT would be the `quote asset`.



### ENUM definitions

**Symbol status:**

* TRADING
* BREAK (ongoing)
* CANCEL_ONLY (ongoing)

**Order status:**

Status | Description
-----------| --------------
`NEW` | The order has been accepted by the engine.
`PARTIALLY_FILLED`| A part of the order has been filled.
`FILLED` | The order has been completed.
`PARTIALLY_CANCELED` | A part of the order has been cancelled with self trade.
`CANCELED` | The order has been canceled by the user
`EXPIRED`       | The order has been cancelled by matching-engine: LIMIT FOK order not filled, limit order not fully filled etc 

**Order types:**

* LIMIT
* MARKET
* LIMIT_MAKER
* STOP_LOSS
* STOP_LOSS_LIMIT
* TAKE_PROFIT
* TAKE_PROFIT_LIMIT



**Order Response Type (newOrderRespType):**

* ACK

* RESULT

* FULL



**Order side:**

* BUY
* SELL



**Anti self-trading behaviour(stpFlag):**

| Value | Description                                     |
| ----- | ----------------------------------------------- |
| `CB`  | Both orders will be cancelled by match engine   |
| `CN`  | The new order will be cancelled by match engine |
| `CO`  | The old order will be cancelled by match engine |



**Time in force (timeInForce):**

This sets how long an order will be active before expiration.

Status | Description
-----------| --------------
`GTC` | Good Til Canceled <br> An order will be on the book unless the order is canceled.
`IOC` | Immediate Or Cancel <br> An order will try to fill the order as much as it can before the order expires.
`FOK`| Fill or Kill <br> An order will expire if the full order cannot be filled upon execution.

**Kline/Candlestick chart intervals:**

m -> minutes; h -> hours; d -> days; w -> weeks; M -> months

* 1m
* 3m
* 5m
* 15m
* 30m
* 1h
* 2h
* 4h
* 6h
* 8h
* 12h
* 1d
* 3d
* 1w
* 1M


### General endpoints

#### Test connectivity

```shell
GET /openapi/v1/ping
```

Test connectivity to the Rest API.

**Weight:** 1

**Parameters:** NONE

**Response:**

```javascript
{}
```



#### Check server time

```shell
GET /openapi/v1/time
```

Test connectivity to the Rest API and get the current server time.

**Weight:** 1

**Parameters:** NONE

**Response:**

```javascript
{
  "serverTime": 1538323200000
}
```

#### Check system status

```shell
GET /openapi/v1/check-sys-status
```

Check the system business status.

**Weight:** 1

**Parameters:**

| Name | Type | Mandatory | Description |
| -------------- | ------ | --------- | ------------------------------------------------------------ |
| businessType | STRING | NO        | Business type. Optional values: SPOT, CONVERT. If not provided, returns status for all business types |

**Response:**

```javascript
[
    {
        "businessType": "SPOT",
        "businessStatus": "on"
    },
    {
        "businessType": "CONVERT",
        "businessStatus": "on"
    }
]
```

**Response fields:**

| Field | Type | Description |
| -------------- | ------ | ------------------------------------------------------------ |
| businessType | STRING | Business type: SPOT or CONVERT |
| businessStatus | STRING | Business status: on (enabled) or off (disabled) |




#### Get user ip

```shell
GET /openapi/v1/user/ip
```

Get the user ip.

**Weight:** 1

**Parameters:** NONE

**Response:**

```javascript
{
  "ip": "57.181.16.43"
}
```



#### Exchange information

```shell
GET /openapi/v1/exchangeInfo
```

Current exchange trading rules and symbol information

**Weight:** 1

**Parameters:**

| Name    | Type   | Mandatory | Description                                                  |
| ------- | ------ | --------- | ------------------------------------------------------------ |
| symbol  | STRING | NO        | Specify a trading pair, for example symbol=BTCPHP            |
| symbols | STRING | NO        | Specify multiple trading pairs using commas, for example: symbols=BTCPHP,BTCUSDT |

**Response:**

```json
{
  "timezone": "UTC",
  "serverTime": 1538323200000,
  "exchangeFilters": [],
  "symbols": [
    {
      "symbol": "BTCPHP",
      "status": "TRADING",
      "baseAsset": "BTC",
      "baseAssetPrecision": 8,
      "quoteAsset": "PHP",
      "quoteAssetPrecision": 8,
      "orderTypes": [
        "LIMIT",
        "MARKET",
        "LIMIT_MAKER",
        "STOP_LOSS_LIMIT",
        "STOP_LOSS",
        "TAKE_PROFIT_LIMIT",
        "TAKE_PROFIT"
      ],
      "filters": [
        {
          "filterType": "PRICE_FILTER",
          "minPrice": "0.00000100",
          "maxPrice": "100000.00000000",
          "tickSize": "0.00000100"
        },
        {
          "filterType": "LOT_SIZE",
          "minQty": "0.00100000",
          "maxQty": "100000.00000000",
          "stepSize": "0.00100000"
        },
        {
          "filterType": "NOTIONAL",
          "minNotional": "0.00100000"
        },
        {
          "filterType": "MIN_NOTIONAL",
          "minNotional": "0.00100000"
        },
        {
          "filterType": "MAX_NUM_ORDERS",
          "maxNumOrders": 200
        },
        {
          "filterType": "MAX_NUM_ALGO_ORDERS",
          "maxNumAlgoOrders": 5
        }
      ]
    }
  ]
}
```



### Wallet endpoints

#### All Coins' Information (USER_DATA)

```shell
GET /openapi/wallet/v1/config/getall  (HMAC SHA256)
```

Get information on coins (available for deposit and withdrawal) for the user.

**Weight(IP):** 10

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
recvWindow | LONG | NO |
timestamp | LONG | YES |

**Response:**

```javascript
[
    {
        "coin": "ETH",
        "name": "ETH",
        "depositAllEnable": true,
        "withdrawAllEnable": true,
        "free": "1.9144",
        "locked": "0.0426",
        "networkList": [
            {
                "addressRegex": "0x([0-9a-fA-F]){40}",
                "memoRegex": "^[0-9A-Za-z\\-_]{1,120}$",
                "network": "ETH",
                "name": "ERC20",
                "depositEnable": true,
                "minConfirm": 8,
                "unLockConfirm": 12,
                "withdrawDesc": "1234567890",
                "withdrawEnable": true,
                "withdrawFee": "0",
                "withdrawIntegerMultiple": "0.00000001",
                "withdrawMax": "1",
                "withdrawMin": "0.001",
                "sameAddress": false
            }
        ],
        "legalMoney": false
    }
  ]
```



#### Deposit Address (USER_DATA)

```shell
GET /openapi/wallet/v1/deposit/address  (HMAC SHA256)
```

Fetch a deposit address along with its network.

**Weight(IP):** 10

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
coin | STRING | YES | The value is from All Coins' Information API
network | STRING | YES | The value is from All Coins' Information API
recvWindow | LONG | NO |
timestamp | LONG | YES |

**Response:**

```javascript
{
    "coin": "ETH",
    "address": "0xfe98628173830bf79c59f04585ce41f7de168784",
    "addressTag": ""
}
```



#### Withdraw (USER_DATA)

```shell
POST /openapi/wallet/v1/withdraw/apply  (HMAC SHA256)
```

Submit a withdrawal request.

**Weight(UID):** 100

**Parameters:**

| Name            | Type    | Mandatory | Description                                              |
| --------------- | ------- | --------- | -------------------------------------------------------- |
| coin            | STRING  | YES       |                                                          |
| network         | STRING  | YES       |                                                          |
| address         | STRING  | YES       |                                                          |
| addressTag      | STRING  | NO        | Secondary address identifier for coins like XRP,XMR etc. |
| amount          | DECIMAL | YES       |                                                          |
| withdrawOrderId | STRING  | NO        | client id for withdraw, length is limited to 30.         |
| recvWindow      | LONG    | NO        |                                                          |
| timestamp       | LONG    | YES       |                                                          |

* Please note that the `coin`/`network`/`address`/`addressTag` combination **MUST** be in the withdrawal address whitelist. You must set up the withdrawal address whitelist before making this API call.

**Response:**

```javascript
{
  "id":"459165282044051456"
}
```



#### Deposit History (USER_DATA)

```shell
GET /openapi/wallet/v1/deposit/history  (HMAC SHA256)
```

Fetch deposit history.

**Weight(IP):** 2

**Parameters:**

| Name       | Type   | Mandatory | Description                                                  |
| ---------- | ------ | --------- | ------------------------------------------------------------ |
| coin       | STRING | NO        |                                                              |
| txId       | STRING | NO        |                                                              |
| status     | INT    | NO        | 0-PROCESSING, 1-SUCCESS, 2-FAILED, 3-NEED_FILL_DATA(travel rule info) |
| statuses   | STRING | NO        | Specify multiple statuses using commas, for example: statuses=1,3 |
| startTime  | LONG   | NO        | Default: 90 days from current timestamp                      |
| endTime    | LONG   | NO        | Default: current timestamp                                   |
| offset     | INT    | NO        | Default:0                                                    |
| limit      | LONG   | NO        | Default:1000, Max:1000                                       |
| recvWindow | LONG   | NO        |                                                              |
| timestamp  | LONG   | YES       |                                                              |

* Please note the default `startTime` and `endTime` to ensure the time interval is within 0-90 days.

* If both `startTime` and `endTime` are sent, time between `startTime` and `endTime` must be less than 90 days.

* Please note you can send either `status` or `statuses`, but not both.

**Response:**

```javascript
[
    {
        "id": "d_769800519366885376",
        "amount": "0.001",
        "coin": "BNB",
        "network": "BNB",
        "status": 0,
        "address": "bnb136ns6lfw4zs5hg4n85vdthaad7hq5m4gtkgf23",
        "addressTag": "101764890",
        "txId": "98A3EA560C6B3336D348B6C83F0F95ECE4F1F5919E94BD006E5BF3BF264FACFC",
        "insertTime": 1661493146000,
        "confirmNo": 10,
    },
    {
        "id": "d_769754833590042625",
        "amount":"0.5",
        "coin":"IOTA",
        "network":"IOTA",
        "status":1,
        "address":"SIZ9VLMHWATXKV99LH99CIGFJFUMLEHGWVZVNNZXRJJVWBPHYWPPBOSDORZ9EQSHCZAMPVAPGFYQAUUV9DROOXJLNW",
        "addressTag":"",
        "txId":"ESBFVQUTPIWQNJSPXFNHNYHSQNTGKRVKPRABQWTAXCDWOAKDKYWPTVG9BGXNVNKTLEJGESAVXIKIZ9999",
        "insertTime":1599620082000,
        "confirmNo": 20,
    }
]
```



#### Withdraw History (USER_DATA)

```shell
GET /openapi/wallet/v1/withdraw/history  (HMAC SHA256)
```

Fetch withdrawal history.

**Weight(IP):** 2

**Parameters:**

| Name       | Type   | Mandatory | Description                                                  |
| ---------- | ------ | --------- | ------------------------------------------------------------ |
| coin       | STRING | NO        |                                                              |
| withdrawOrderId       | STRING | NO      |                                                              |
| status     | INT    | NO        | 0-PROCESSING, 1-SUCCESS, 2-FAILED |
| startTime  | LONG   | NO        | Default: 90 days from current timestamp                      |
| endTime    | LONG   | NO        | Default: current timestamp                                   |
| offset     | INT    | NO        | Default:0                                                    |
| limit      | LONG   | NO        | Default:1000, Max:1000                                       |
| recvWindow | LONG   | NO        |                                                              |
| timestamp  | LONG   | YES       |                                                              |

* Please note the default `startTime` and `endTime` to ensure the time interval is within 0-90 days.

* If both `startTime` and `endTime` are sent, time between `startTime` and `endTime` must be less than 90 days.

* If `withdrawOrderId` is sent, time between `startTime` and `endTime` must be less than 7 days.

* If `withdrawOrderId` is sent and `startTime` and `endTime` are not provided, the API will return records from the last 7 days by default.


**Response:**

```javascript
[
    {
        "id": "459890698271244288",
        "amount": "0.01",
        "transactionFee": "0",
        "coin": "ETH",
        "status": 1,
        "address": "0x386AE30AE2dA293987B5d51ddD03AEb70b21001F",
        "addressTag": "",
        "txId": "0x4ae2fed36a90aada978fc31c38488e8b60d7435cfe0b4daed842456b4771fcf7",
        "applyTime": 1673601139000,
        "network": "ETH",
        "withdrawOrderId": "thomas123",
        "info": "",
        "confirmNo": 100
    },
    {
        "id": "451899190746456064",
        "amount": "0.00063",
        "transactionFee": "0.00037",
        "coin": "ETH",
        "status": 1,
        "address": "0x386AE30AE2dA293987B5d51ddD03AEb70b21001F",
        "addressTag": "",
        "txId": "0x62690ca4f9d6a8868c258e2ce613805af614d9354dda7b39779c57b2e4da0260",
        "applyTime": 1671695815000,
        "network": "ETH",
        "withdrawOrderId": "",
        "info": "",
        "confirmNo": 100
    }
]
```



#### Transfers (USER_DATA)

```shell
POST /openapi/transfer/v3/transfers
```
This endpoint is used to transfer funds between two accounts.

**Weight:** 50

**Parameters:**

Name       | Type  | Mandatory | Description
-----------------|--------|-----------|--------------------------------------------------------------------------------------
client_transfer_id | STRING | NO | Client Transfer ID, cannot send duplicate ID
account      | STRING | YES    | The token (e.g. BTC, ETH) to be transferred.
target_address   | STRING | YES    | The phone number or email for recipient account (e.g. `+63 9686490252` or `test@coins.ph`)
amount      | BigDecimal | YES    | The amount being transferred
recvWindow | LONG  | NO    | This value cannot be greater than `60000`
timestamp     | LONG  | YES    | A point in time when the transfer is performed
message     | STRING  | NO    | The message sent to the recipient account

If the client_transfer_id or id parameter is passed in, the type parameter is invalid.

**Request:**
```javascript
{
  "account": "1451431230880900352",
  "target_address": "christina@coins.ph",
  "amount": "1232"
}
```

**Response:**
```javascript
{
  "transfer":
    {
      "id": "1451431230880900352",
      "status": "success",//status enum: pending,success,failed
      "account": "90dfg03goamdf02fs",
      "target_address": "test@coins.ph",
      "amount": "1",
      "exchange": "1",
      "payment": "23094j0amd0fmag9agjgasd",
      "client_transfer_id": "1487573639841995271",
      "message": "example",
      "errorMessage":""//Error message returned when transfer fails, eg: Insufficient balance
     }
}
```



#### Account information (USER_DATA)

```shell
GET /openapi/v1/account (HMAC SHA256)
```

GET current account information.

**Weight:** 10

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
recvWindow | LONG | NO |The value cannot be greater than `60000`
timestamp | LONG | YES |

**Response:**

```javascript
{
   "accountType":"SPOT",
   "canDeposit":true,
   "canTrade":true,
   "canWithdraw":true,
   "email": "test@coins.ph",
   "enableWithdrawWhitelist": true,
   "balances":[
      {
         "asset":"456",
         "free":"100",
         "locked":"0"
      },
      {
         "asset":"APE",
         "free":"0",
         "locked":"0"
      },
      {
         "asset":"AXS",
         "free":"0.00005",
         "locked":"0"
      }
   ],
   "token":"PHP",
   "daily":{
      "cashInLimit":"500000",
      "cashInRemaining":"499994",
      "cashOutLimit":"500000",
      "cashOutRemaining":"500000",
      "totalWithdrawLimit":"500000",
      "totalWithdrawRemaining":"500000"
   },
   "monthly":{
      "cashInLimit":"10000000",
      "cashInRemaining":"9999157",
      "cashOutLimit":"10000000",
      "cashOutRemaining":"10000000",
      "totalWithdrawLimit":"10000000",
      "totalWithdrawRemaining":"10000000"
   },
   "annually":{
      "cashInLimit":"120000000",
      "cashInRemaining":"119998577",
      "cashOutLimit":"120000000",
      "cashOutRemaining":"119999488",
      "totalWithdrawLimit":"120000000",
      "totalWithdrawRemaining":"119998487.97"
   },
   "updateTime":1707273549694
}
```



#### Api Key information (USER_DATA)

```shell
GET /openapi/v1/api-keys (HMAC SHA256)
```

GET current api key information.

**Weight:** 10

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
recvWindow | LONG | NO |The value cannot be greater than `60000`
timestamp | LONG | YES |

**Response:**

```javascript
[
   {
      "apiKey":"QdGqqftMXzW3qKceYHqwRjjvQvBsdVsMb1OFg4kOuVgV07lnTsh9jIJJLsXrOLug",
      "apiName":"your API name",
      "apiType":[
         "Enable Spot",
         "Enable Convert",
         "Enable Crypto Wallet",
         "Enable Fiat",
         "Enable Account"
      ],
      "createTime":"1711520996538",
      "ipAccessRestrictions":[
         "57.181.16.43",
         "57.181.16.55"
      ],
      "status":"ENABLE"
   },
   {
      "apiKey":"oys7XrwQSV6SHvjRzWFTFWgmano88vm2iz8QCf6FN6VXYPbYVe7m6HmHqgkmYABF",
      "apiName":"your API name",
      "apiType":[
         "Read only",
      ],
      "createTime":"1711537457048",
      "ipAccessRestrictions":[
         "57.181.16.43"
      ],
      "status":"NOT_ENABLE"
   }
]
```



### Market Data endpoints

#### Order book

```shell
GET /openapi/quote/v1/depth
```

**Weight:**

Adjusted based on the limit:

Limit | Weight
------------ | ------------
5, 10, 20, 50, 100 | 1
200 | 5

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | YES |
limit | INT | NO | Default 100; max 200.

**Caution:** setting limit=0 can return 200 records.

**Response:**

[PRICE, QTY]

```javascript
{
  "lastUpdateId": 1027024,
  "bids": [
    [
      "4.90000000",   // PRICE
      "331.00000000"  // QTY
    ],
    [
      "4.00000000",
      "431.00000000"
    ]
  ],
  "asks": [
    [
      "4.00000200",  // PRICE
      "12.00000000"  // QTY
    ],
    [
      "5.10000000",
      "28.00000000"
    ]
  ]
}
```



#### Recent trades list

```shell
GET /openapi/quote/v1/trades
```

Get recent trades (up to last 60).

**Weight:** 1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | YES |EXP: BTCUSDT
limit | INT | NO | Default 500; max 1000. if limit <=0 or > 1000 then return 1000

**Response:**

```javascript
[
  {
    "id": 28457,
    "price": "4.00000100",
    "qty": "12.00000000",
    "quoteQty": "48.000012",
    "time": 1499865549590,
    "isBuyerMaker": true,
    "isBestMatch": true
  }
]
```



#### Kline/Candlestick data

```shell
GET /openapi/quote/v1/klines
```

Kline/candlestick bars for a symbol.
Klines are uniquely identified by their open time.

**Weight:** 1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | YES |EXP: BTCUSDT
interval | ENUM | YES |
startTime | LONG | NO |
endTime | LONG | NO |
limit | INT | NO | Default 500; max 1000.

* If startTime and endTime are not sent, the most recent klines are returned.

**Response:**

```javascript
[
  [
    1499040000000,      // Open time
    "0.01634790",       // Open
    "0.80000000",       // High
    "0.01575800",       // Low
    "0.01577100",       // Close
    "148976.11427815",  // Volume
    1499644799999,      // Close time
    "2434.19055334",    // Quote asset volume
    308,                // Number of trades
    "1756.87402397",    // Taker buy base asset volume
    "28.46694368"       // Taker buy quote asset volume
  ]
]
```



#### 24hr ticker price change statistics

```shell
GET /openapi/quote/v1/ticker/24hr
```

24 hour price change statistics. **Careful** when accessing this with no symbol.

**Weight:**

| Parameter | Symbols Provided            | Weight |
| --------- | --------------------------- | ------ |
| symbol    | 1                           | 1      |
|           | symbol parameter is omitted | 40     |
| symbols   | 1-20                        | 1      |
|           | 21-100                      | 20     |
|           | 101 or more                 | 40     |
|           | symbol parameter is omitted | 40     |

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | NO |Example: BTCUSDT
symbols | STRING | NO |

* Parameter symbol and symbols cannot be used in combination.If neither parameter is sent, tickers for all symbols will be returned in an array.Examples of accepted format for the symbols parameter: ["BTCUSDT","BNBUSDT"] and not case sensitive

**Response:**

```javascript
{
  "symbol": "BNBBTC",
  "priceChange": "-94.99999800",
  "priceChangePercent": "-95.960",
  "weightedAvgPrice": "0.29628482",
  "prevClosePrice": "0.10002000",
  "lastPrice": "4.00000200",
  "lastQty": "200.00000000",
  "bidPrice": "4.00000000",
  "bidQty": "100.00000000",
  "askPrice": "4.00000200",
  "askQty": "100.00000000",
  "openPrice": "99.00000000",
  "highPrice": "100.00000000",
  "lowPrice": "0.10000000",
  "volume": "8913.30000000",
  "quoteVolume": "15.30000000",
  "openTime": 1499783499040,
  "closeTime": 1499869899040,
  "firstId": 28385,   // first trade id
  "lastId": 28460,    // Last tradeId
  "count": 76         // Trade count
}

```

OR

```javascript
[
  {
    "symbol": "BNBBTC",
    "priceChange": "-94.99999800",
    "priceChangePercent": "-95.960",
    "weightedAvgPrice": "0.29628482",
    "prevClosePrice": "0.10002000",
    "lastPrice": "4.00000200",
    "lastQty": "200.00000000",
    "bidPrice": "4.00000000",
    "bidQty": "100.00000000",
    "askPrice": "4.00000200",
    "askQty": "100.00000000",
    "openPrice": "99.00000000",
    "highPrice": "100.00000000",
    "lowPrice": "0.10000000",
    "volume": "8913.30000000",
    "quoteVolume": "15.30000000",
    "openTime": 1499783499040,
    "closeTime": 1499869899040,
    "firstId": 28385,   // First tradeId
    "lastId": 28460,    // Last tradeId
    "count": 76         // Trade count
  }
]
```



#### Symbol price ticker

```shell
GET /openapi/quote/v1/ticker/price
```

Latest price for a symbol or symbols.

**Weight:**

| Parameter | Symbols Provided            | Weight |
| --------- | --------------------------- | ------ |
| symbol    | 1                           | 1      |
|           | symbol parameter is omitted | 2      |
| symbols   | Any                         | 2      |

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | NO |Example: BTCUSDT
symbols | STRING | NO |

* Parameter symbol and symbols cannot be used in combination.If neither parameter is sent, prices for all symbols will be returned in an array.Examples of accepted format for the symbols parameter: ["BTCUSDT","BNBUSDT"] and not case sensitive

**Response:**

```javascript
{
  "symbol": "LTCBTC",
  "price": "4.00000200"
}
```

OR

```javascript
[
  {
    "symbol": "LTCBTC",
    "price": "4.00000200"
  },
  {
    "symbol": "BTCPHP",
    "price": "0.07946600"
  }
]
```



#### Symbol order book ticker

```shell
GET /openapi/quote/v1/ticker/bookTicker
```

Best price/qty on the order book for a symbol or symbols.

**Weight:**

| Parameter | Symbols Provided            | Weight |
| --------- | --------------------------- | ------ |
| symbol    | 1                           | 1      |
|           | symbol parameter is omitted | 2      |
| symbols   | Any                         | 2      |

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | NO |
symbols | STRING | NO |

* Parameter symbol and symbols cannot be used in combination.If neither parameter is sent, bookTickers for all symbols will be returned in an array.Examples of accepted format for the symbols parameter: ["BTCUSDT","BNBUSDT"] and not case sensitive

**Response:**

```javascript
{
  "symbol": "LTCBTC",
  "bidPrice": "4.00000000",
  "bidQty": "431.00000000",
  "askPrice": "4.00000200",
  "askQty": "9.00000000"
}
```

OR

```javascript
[
  {
    "symbol": "LTCBTC",
    "bidPrice": "4.00000000",
    "bidQty": "431.00000000",
    "askPrice": "4.00000200",
    "askQty": "9.00000000"
  },
  {
    "symbol": "BTCPHP",
    "bidPrice": "0.07946700",
    "bidQty": "9.00000000",
    "askPrice": "100000.00000000",
    "askQty": "1000.00000000"
  }
]
```



#### Current average price

```shell
GET /openapi/quote/v1/avgPrice
```

Current average price for a symbol.

**Weight:** 1

**Parameters:**

| Name   | Type   | Mandatory | Description                                           |
| ------ | ------ | --------- | ----------------------------------------------------- |
| symbol | STRING | YES       | symbol is not case sensitive, e.g. BTCUSDT or btcusdt |


**Response:**

```javascript
{
  "mins": 5,
  "price": "9.35751834"
}
```



#### Cryptoasset trading pairs

```shell
GET /openapi/v1/pairs
```
a summary on cryptoasset trading pairs available on the exchange

**Weight:** 1

**Parameters:**

None

**Response:**

```javascript
[
  {
    "symbol": "LTCBTC",
    "quoteToken": "LTC",
    "baseToken": "BTC"
  },
  {
    "symbol": "BTCUSDT",
    "quoteToken": "BTC",
    "baseToken": "USDT"
  }
]
```



### Spot Trading Endpoints

#### New order  (TRADE)

```shell
POST /openapi/v1/order  (HMAC SHA256)
```

Send in a new order.

**Weight:** 1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | YES |
side | ENUM | YES |
type | ENUM | YES |
timeInForce | ENUM | NO |
quantity | DECIMAL | NO |
quoteOrderQty | DECIMAL | NO |
price | DECIMAL | NO |
newClientOrderId | STRING | NO | A unique id among open orders. Automatically generated if not sent. Orders with the same `newClientOrderID` can be accepted only when the previous one is filled, otherwise the order will be rejected.
stopPrice | DECIMAL | NO | Used with `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`, and `TAKE_PROFIT_LIMIT` orders.
newOrderRespType | ENUM | NO | Set the response JSON. `ACK`, `RESULT`, or `FULL`; `MARKET` and `LIMIT` order types default to `FULL`, all other orders default to `ACK`.
stpFlag | ENUM | NO | The anti self-trading behaviour, Default anti self-dealing behaviour is CB 
recvWindow | LONG | NO |The value cannot be greater than `60000`
timestamp | LONG | YES |

Additional mandatory parameters based on `type`:

Type | Additional mandatory parameters                  | Additional Information
------------ |--------------------------------------------------| ------------ 
`LIMIT` | `quantity`, `price`               |
`MARKET` | `quantity` or `quoteOrderQty`                    | `MARKET` orders using `quantity` field specifies the amount of the base asset the user wants to buy/sell, E.g. `MARKET` order on BCHUSDT  will specify how much BCH the user is buying/selling. <br />`MARKET` orders using `quoteOrderQty` field specifies the amount of the quote asset the user wants to buy/sell, E.g. `MARKET` order on BCHUSDT  will specify how much USDT the user is buying/selling.<br /> 
`STOP_LOSS` | `quantity` or `quoteOrderQty`, `stopPrice`       | This will execute a `MARKET` order when`stopPrice` is met. Use `quantity` for selling, `quoteOrderQty` for buying.
`STOP_LOSS_LIMIT` | `quantity`,  `price`, `stopPrice` | This will execute a `LIMIT` order when`stopPrice` is met.
`TAKE_PROFIT` | `quantity` or `quoteOrderQty`, `stopPrice`            | This will execute a `MARKET` order when`stopPrice` is met. Use `quantity` for selling, `quoteOrderQty` for buying.
`TAKE_PROFIT_LIMIT` | `quantity`, `price`, `stopPrice`  | This will execute a `LIMIT` order when`stopPrice` is met.
`LIMIT_MAKER` | `quantity`, `price`                              | This is a `LIMIT` order that will be rejected if the order immediately matches and trades as a taker.

Trigger order price rules against market price for both MARKET and LIMIT versions:

* Price above market price: `STOP_LOSS/STOP_LOSS_LIMIT` `BUY`, `TAKE_PROFIT/TAKE_PROFIT_LIMIT` `SELL`
* Price below market price: `STOP_LOSS/STOP_LOSS_LIMIT` `SELL`, `TAKE_PROFIT/TAKE_PROFIT_LIMIT` `BUY`

**Response ACK:**

```javascript
{
  "symbol": "BCHUSDT",
  "orderId": 1202289462787244800,
  "clientOrderId": "165806007267756",
  "transactTime": 1656900365976
}
```

**Response RESULT:**

```javascript
{
    "symbol": "BCHUSDT",
    "orderId": 1202289462787244800,
    "clientOrderId": "165806007267756",
    "transactTime": 1656900365976,
    "price": "1",
    "origQty": "101",
    "executedQty": "101",
    "cummulativeQuoteQty": "101",
    "status": "FILLED",
    "timeInForce": "GTC",
    "type": "LIMIT",
    "side": "SELL",
    "stopPrice": "0",
    "origQuoteOrderQty": "0"
}
```
**Response FULL:**

```javascript
{
    "symbol": "BCHUSDT",
    "orderId": 1202289462787244800,
    "clientOrderId": "165806007267756",
    "transactTime": 1656900365976,
    "price": "1",
    "origQty": "101",
    "executedQty": "101",
    "cummulativeQuoteQty": "101",
    "status": "FILLED",
    "timeInForce": "GTC",
    "type": "LIMIT",
    "side": "SELL",
    "stopPrice": "0",
    "origQuoteOrderQty": "0"
    "fills": [
        {
            "price": "2",
            "qty": "100",
            "commission": "0.01",
            "commissionAsset": "USDT",
            "tradeId": "1205027741844507648"
        },
        {
            "price": "1",
            "qty": "1",
            "commission": "0.005",
            "commissionAsset": "USDT",
            "tradeId": "1205027331347975169"
        }
    ]
}
```



#### Test new order (TRADE)

```shell
POST /openapi/v1/order/test (HMAC SHA256)
```

Test new order creation and signature/recvWindow long.
Creates and validates a new order but does not send it into the matching engine.

**Weight:** 1

**Parameters:**

Same as `POST /openapi/v1/order`

**Response:**

```javascript
{}
```



#### Query order (USER_DATA)

```shell
GET /openapi/v1/order (HMAC SHA256)
```

Check an order's status.

**Weight:** 2

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
orderId | LONG | NO |
origClientOrderId | STRING | NO |
recvWindow | LONG | NO |The value cannot be greater than `60000`
timestamp | LONG | YES |

Notes:

* Either `orderId` or `origClientOrderId` must be sent. If both parameters are sent, `orderId` takes precedence. A list will be returned for orders with identical clientOrderId.

**Response Single Order:**

```javascript
{
    'clientOrderId': 'test5678',
    'cummulativeQuoteQty': '3946.87326',
    'executedQty': '0.001',
    'isWorking': False,
    'orderId': 1799249051008066560,
    'origQty': '0.001',
    'origQuoteOrderQty': '3946.87326',
    'price': '0',
    'side': 'BUY',
    'status': 'FILLED',
    'stopPrice': '0',
    'symbol': 'BTCPHP',
    'time': 1729223201090,
    'timeInForce': 'GTC',
    'type': 'MARKET',
    'updateTime': 1729223201201
}
```
**Response Order List:**

```javascript
[
    {
        'clientOrderId': 'test5678',
        'cummulativeQuoteQty': '3946.87326',
        'executedQty': '0.001',
        'isWorking': False,
        'orderId': 1799249051008066560,
        'origQty': '0.001',
        'origQuoteOrderQty': '3946.87326',
        'price': '0',
        'side': 'BUY',
        'status': 'FILLED',
        'stopPrice': '0',
        'symbol': 'BTCPHP',
        'time': 1729223201090,
        'timeInForce': 'GTC',
        'type': 'MARKET',
        'updateTime': 1729223201201
    },
    {
        'clientOrderId': 'test5678',
        'cummulativeQuoteQty': '127.24738',
        'executedQty': '2.21',
        'isWorking': False,
        'orderId': 1799253321187025920,
        'origQty': '2.21',
        'origQuoteOrderQty': '127.24738',
        'price': '0',
        'side': 'BUY',
        'status': 'FILLED',
        'stopPrice': '0',
        'symbol': 'USDCPHP',
        'time': 1729223710134,
        'timeInForce': 'GTC',
        'type': 'MARKET',
        'updateTime': 1729223710186
    }
]
```



#### Cancel order (TRADE)

```shell
DELETE /openapi/v1/order  (HMAC SHA256)
```

Cancel an active order.

**Weight:** 1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
orderId | LONG | NO |
origClientOrderId | STRING | NO |
recvWindow | LONG | NO |The value cannot be greater than `60000`
timestamp | LONG | YES |

Notes:

* Either `orderId` or `origClientOrderId` must be sent. If both parameters are sent, `orderId` takes precedence.

**Response:**

```javascript
{
  "symbol": "BCHBUSD",
  "orderId": 1205324142243592448,
  "clientOrderId": "165830718862761",
  "price": "2",
  "origQty": "10",
  "executedQty": "8",
  "cummulativeQuoteQty": "16",
  "status": "CANCELED",
  "timeInForce": "GTC",
  "type": "LIMIT",
  "side": "SELL",
  "stopPrice": "0",
  "origQuoteOrderQty": "0"
}
```



#### Cancel All Open Orders on a Symbol (TRADE)

```shell
DELETE /openapi/v1/openOrders  (HMAC SHA256)
```

Cancels all active orders on a symbol.

**Weight:** 1

**Parameters:**

| Name       | Type   | Mandatory | Description                              |
| ---------- | ------ |-----------| ---------------------------------------- |
| symbol     | STRING | YES       |                                          |
| recvWindow | LONG   | NO        | The value cannot be greater than `60000` |
| timestamp  | LONG   | YES       |                                          |

**Response:**

```javascript
[
    {
        "symbol": "BTCUSDT",
        "orderId": 1200757068661824000,
        "clientOrderId": "165787739706155",
        "price": "19999",
        "origQty": "0.01",
        "executedQty": "0",
        "cummulativeQuoteQty": "0",
        "status": "CANCELED",
        "timeInForce": "GTC",
        "type": "LIMIT",
        "side": "BUY",
        "stopPrice": "0",
        "origQuoteOrderQty": "0"
    },
    {
        "symbol": "BTCUSDT",
        "orderId": 1200760572449167872,
        "clientOrderId": "165787781474653",
        "price": "19999",
        "origQty": "0.01",
        "executedQty": "0",
        "cummulativeQuoteQty": "0",
        "status": "CANCELED",
        "timeInForce": "GTC",
        "type": "LIMIT",
        "side": "BUY",
        "stopPrice": "0",
        "origQuoteOrderQty": "0"
    },
    {
        "symbol": "BTCUSDT",
        "orderId": 1200760629206489600,
        "clientOrderId": "165787782151456",
        "price": "19999",
        "origQty": "0.01",
        "executedQty": "0",
        "cummulativeQuoteQty": "0",
        "status": "CANCELED",
        "timeInForce": "GTC",
        "type": "LIMIT",
        "side": "BUY",
        "stopPrice": "0",
        "origQuoteOrderQty": "0"
    }
]
```



#### Current open orders (USER_DATA)

```shell
GET /openapi/v1/openOrders  (HMAC SHA256)
```

GET all open orders on a symbol. **Careful** when accessing this with no symbol.

**Weight:** 10

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | String | NO |
recvWindow | LONG | NO |The value cannot be greater than `60000`
timestamp | LONG | YES |

**Response:**

```javascript
[
    {
        "symbol": "BTCUSDT",
        "orderId": 1200757068661824000,
        "clientOrderId": "165787739706155",
        "price": "19999",
        "origQty": "0.01",
        "executedQty": "0",
        "cummulativeQuoteQty": "0",
        "status": "NEW",
        "timeInForce": "GTC",
        "type": "LIMIT",
        "side": "BUY",
        "stopPrice": "0",
        "time": 1657877397079,
        "updateTime": 1657877397092,
        "isWorking": true,
        "origQuoteOrderQty": "0"
    },
    {
        "symbol": "BTCUSDT",
        "orderId": 1200760572449167872,
        "clientOrderId": "165787781474653",
        "price": "19999",
        "origQty": "0.01",
        "executedQty": "0",
        "cummulativeQuoteQty": "0",
        "status": "NEW",
        "timeInForce": "GTC",
        "type": "LIMIT",
        "side": "BUY",
        "stopPrice": "0",
        "time": 1657877814763,
        "updateTime": 1657877814776,
        "isWorking": true,
        "origQuoteOrderQty": "0"
    },
    {
        "symbol": "BTCUSDT",
        "orderId": 1200760629206489600,
        "clientOrderId": "165787782151456",
        "price": "19999",
        "origQty": "0.01",
        "executedQty": "0",
        "cummulativeQuoteQty": "0",
        "status": "NEW",
        "timeInForce": "GTC",
        "type": "LIMIT",
        "side": "BUY",
        "stopPrice": "0",
        "time": 1657877821529,
        "updateTime": 1657877821542,
        "isWorking": true,
        "origQuoteOrderQty": "0"
    }
]
```



#### History orders (USER_DATA)

```shell
GET /openapi/v1/historyOrders (HMAC SHA256)
```

GET all orders of the account;  canceled, filled or rejected.

**Weight:** 10 with symbol, **40** when the symbol parameter is omitted;

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ |-----------| ------------
symbol | String | YES       |
orderId | LONG | NO        |
startTime | LONG | NO        |
endTime | LONG | NO        |
limit | INT | NO        | Default 500; max 1000.
recvWindow | LONG | NO        |The value cannot be greater than `60000`
timestamp | LONG | YES       |

**Notes:**

* If `orderId` is set, it will get orders >= that `orderId`. Otherwise most recent orders are returned.

**Response:**

```javascript
[
    {
        "symbol": "BCHBUSD",
        "orderId": 1194453962386908672,
        "clientOrderId": "1657126007990",
        "price": "4.56",
        "origQty": "1",
        "executedQty": "1",
        "cummulativeQuoteQty": "4.56",
        "status": "FILLED",
        "timeInForce": "GTC",
        "type": "LIMIT",
        "side": "SELL",
        "stopPrice": "0",
        "time": 1657126008273,
        "updateTime": 1657126008357,
        "isWorking": false,
        "origQuoteOrderQty": "0"
    },
    {
        "symbol": "BCHBUSD",
        "orderId": 1194453774196830976,
        "clientOrderId": "165712598575253",
        "price": "0",
        "origQty": "0",
        "executedQty": "4",
        "cummulativeQuoteQty": "18",
        "status": "FILLED",
        "timeInForce": "GTC",
        "type": "MARKET",
        "side": "BUY",
        "stopPrice": "0",
        "time": 1657126008363,
        "updateTime": 1657126008402,
        "isWorking": false,
        "origQuoteOrderQty": "18"
    },
    {
        "symbol": "BCHBUSD",
        "orderId": 1194460299787314688,
        "clientOrderId": "1657126763487",
        "price": "0.46",
        "origQty": "1",
        "executedQty": "1",
        "cummulativeQuoteQty": "4.56",
        "status": "FILLED",
        "timeInForce": "GTC",
        "type": "LIMIT",
        "side": "SELL",
        "stopPrice": "0",
        "time": 1657126763736,
        "updateTime": 1657126763786,
        "isWorking": false,
        "origQuoteOrderQty": "0"
    }
]
```



#### Account trade list (USER_DATA)

```shell
GET /openapi/v1/myTrades  (HMAC SHA256)
```

Get trades for a specific account and symbol.

**Weight:** 10

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
symbol | STRING | YES |
orderId | LONG | NO | This can only be used in combination with `symbol`.
startTime | LONG | NO |
endTime | LONG | NO |
fromId | LONG | NO | TradeId to fetch from. Default gets most recent trades.
limit | INT | NO | Default 500; max 1000.
recvWindow | LONG | NO |The value cannot be greater than `60000`
timestamp | LONG | YES |

**Notes:**

*  If fromId (tradeId) is set, it will get id (tradeId) >= that fromId (tradeId). Otherwise most recent trades are returned.

**Response:**

```javascript
[
  {
    "symbol": "BNBBTC",
    "id": 1194460299787317856,
    "orderId": 1194453774196830977,
    "price": "4.00000100",
    "qty": "12.00000000",
    "quoteQty": "48.000012",
    "commission": "10.10000000",
    "commissionAsset": "BNB",
    "time": 1499865549590,
    "isBuyer": true,
    "isMaker": false,
    "isBestMatch": true
  }
]
```



#### Trade Fee (USER_DATA)

```shell
GET /openapi/v1/asset/tradeFee (HMAC SHA256)
```

Fetch trade fee

**Weight:** 1

**Parameters:**

Name              | Type   | Mandatory | Description
-----------------|--------|-----------|--------------------------------------------------------------------------------------
symbol            | STRING | NO        |
recvWindow | LONG   | NO        | The value cannot be greater than `60000`
timestamp          | LONG   | YES        |

**Response:**

```javascript
  [
    {
      "symbol": "BTCUSDT",
      "makerCommission": "0.002",
      "takerCommission": "0.003"
    },
    {
      "symbol": "ETHUSDT",
      "makerCommission": "0.001",
      "takerCommission": "0.001"
    }
  ]
```



### Convert endpoints
#### Get supported trading pairs (TRADE)
```shell
POST /openapi/convert/v1/get-supported-trading-pairs
```

This continuously updated endpoint returns a list of all available trading pairs. 

**Weight:** 1

**Parameters:**

 N/A



**Response:**

Field name	| Description
----|---
sourceCurrency	| Source token.
targetCurrency	| Target token.
minSourceAmount	| amount range min value.
maxSourceAmount	| amount range max value.
precision	| The level of precision in decimal places used.

```javascript
{
  "status":0, 
  "error":"OK",
  "data":[
     {
      "sourceCurrency":"PHP",
      "targetCurrency":"BTC",
      "minSourceAmount":"1000",
      "maxSourceAmount":"15000",
      "precision":"2"
    },
    {
      "sourceCurrency":"BTC",
      "targetCurrency":"PHP",
      "minSourceAmount":"0.0001",
      "maxSourceAmount":"0.1",
      "precision":"8"
    },
    {
      "sourceCurrency":"PHP",
      "targetCurrency":"ETH",
      "minSourceAmount":"1000",
      "maxSourceAmount":"18000",
      "precision":"2"
    },
    {
      "sourceCurrency":"ETH",
      "targetCurrency":"PHP",
      "minSourceAmount":"0.003",
      "maxSourceAmount":"4.2",
      "precision":"8"
    }
  ]
}
```



#### Fetch a quote (TRADE)

```shell
POST /openapi/convert/v1/get-quote
```

This endpoint returns a quote for a specified source currency (sourceCurrency) and target currency (targetCurrency) pair.

**Weight:** 1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ |-----------| ------------
sourceCurrency | STRING | YES       |The currency the user holds
targetCurrency | STRING | YES       |The currency the user would like to obtain
sourceAmount | STRING | NO        |The amount of sourceCurrency. You only need to fill in either the source amount or the target amount. If both are filled, it will result in an error.
targetAmount | STRING | NO        |The amount of targetCurrency. You only need to fill in either the source amount or the target amount. If both are filled, it will result in an error.

**Response:**

Field name	| Description
----|---
quoteId	| Quote unique id.
sourceCurrency	| Source token.
targetCurrency	| Target token.
sourceAmount	| Source token amount.
price	| Trading pairs price.
targetAmount	| Targe token amount.
expiry	| Quote expire time seconds.

```javascript
{
  "status": 0, 
  "error": "OK", 
  "data": {
            "quoteId": "2182b4fc18ff4556a18332245dba75ea",
            "sourceCurrency": "BTC",
            "targetCurrency": "PHP",
            "sourceAmount": "0.1",
            "price": "59999",             //1BTC=59999PHP
            "targetAmount": "5999",       //The amount of PHP the user holds
            "expiry": "10"
  }
}
```

#### Accept the quote (TRADE)


```shell
POST /openapi/convert/v1/accept-quote
```

Use this endpoint to accept the quote and receive the result instantly.

**Weight:** 1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
quoteId | STRING | YES |The ID assigned to the quote


**Response:**

Field name	| Description
----|---
status	| 0 means order is created. 
data.orderId	| Order ID generated by the server.
data.status	| The order status is an enumeration with values `SUCCESS`, `PROCESSING`;PROCESSING mean that the server is processing,SUCCESS means the order is successful.

```javascript
{
  "status": 0, 
  "data": {
         "orderId" : "49d10b74c60a475298c6bbed08dd58fa",
         "status": "SUCCESS"
  },
  "error": "ok"
}
```



### User data stream endpoints

Specifics on how user data streams work is in another document(user-data-stream.md).



#### Start user data stream (USER_STREAM)

```shell
POST /openapi/v1/userDataStream
```

Start a new user data stream. The stream will close after 60 minutes unless a keepalive is sent.

**Weight:** 1

**Parameters:**

None

**Response:**

```javascript
{
  "listenKey": "xDqtskqOciCzRashthgjTHBcymasBBShEEzPiXgOGEujviYWCuyYwcPDVPeezJOT"
}
```



#### Keepalive user data stream (USER_STREAM)

```shell
PUT /openapi/v1/userDataStream
```

Keepalive a user data stream to prevent a time out. User data streams will close after 60 minutes. It's recommended to send a ping about every 30 minutes.

**Weight:** 1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
listenKey | STRING | YES |

**Response:**

```javascript
{}
```



#### Close user data stream (USER_STREAM)

```shell
DELETE /openapi/v1/userDataStream
```

Close out a user data stream.

**Weight:** 1

**Parameters:**

Name | Type | Mandatory | Description
------------ | ------------ | ------------ | ------------
listenKey | STRING | YES |

**Response:**

```javascript
{}
```



### Filters

Filters define trading rules on a symbol or an exchange. Filters come in two forms: `symbol filters` and `exchange filters`.



#### Symbol filters

##### PRICE_FILTER

The `PRICE_FILTER` defines the `price` rules for a symbol. There are 3 parts:

* `minPrice` defines the minimum `price`/`stopPrice` allowed.
* `maxPrice` defines the maximum `price`/`stopPrice` allowed.
* `tickSize` defines the intervals that a `price`/`stopPrice` can be increased/decreased by.

In order to pass the `price filter`, the following must be true for `price`/`stopPrice`:

* `price` >= `minPrice`
* `price` <= `maxPrice`
* (`price`-`minPrice`) % `tickSize` == 0

**/exchangeInfo format:**

```javascript
  {
    "filterType": "PRICE_FILTER",
    "minPrice": "0.00000100",
    "maxPrice": "100000.00000000",
    "tickSize": "0.00000100"
  }
```



##### PERCENT_PRICE

The `PERCENT_PRICE` filter defines the valid range for a price based on the weighted average of the previous trades. `avgPriceMins` is the number of minutes the weighted average price is calculated over.

In order to pass the `percent price`, the following must be true for `price`:

- `price` <= `weightedAveragePrice` * `multiplierUp`
- `price` >= `weightedAveragePrice` * `multiplierDown`

**/exchangeInfo format:**

```javascript
  {
    "filterType": "PERCENT_PRICE",
    "multiplierUp": "1.3000",
    "multiplierDown": "0.7000",
    "avgPriceMins": 5
  }
```



##### PERCENT_PRICE_SA

The `PERCENT_PRICE_SA` filter defines the valid range for a price based on the simple average of the previous trades. `avgPriceMins` is the number of minutes the simple average price is calculated over.

In order to pass the `percent_price_sa`, the following must be true for `price`:

- `price` <= `simpleAveragePrice` * `multiplierUp`
- `price` >= `simpleAveragePrice` * `multiplierDown`

**/exchangeInfo format:**

```javascript
  {
    "filterType": "PERCENT_PRICE_SA",
    "multiplierUp": "1.3000",
    "multiplierDown": "0.7000",
    "avgPriceMins": 5
  }
```



##### PERCENT_PRICE_BY_SIDE

The `PERCENT_PRICE_BY_SIDE` filter defines the valid range for the price based on the last price of the symbol.
There is a different range depending on whether the order is placed on the `BUY` side or the `SELL` side.

Buy orders will succeed on this filter if:

- `Order price` <= `bidMultiplierUp` * `lastPrice`
- `Order price` >= `bidMultiplierDown` * `lastPrice`

Sell orders will succeed on this filter if:

- `Order Price` <= `askMultiplierUp` * `lastPrice`
- `Order Price` >= `askMultiplierDown` * `lastPrice`

**/exchangeInfo format:**

```javascript
  {
    "filterType": "PERCENT_PRICE_BY_SIDE",
    "bidMultiplierUp": "1.2",
    "bidMultiplierDown": "0.2",
    "askMultiplierUp": "1.5",
    "askMultiplierDown": "0.8",
  }
```



##### PERCENT_PRICE_INDEX

The `PERCENT_PRICE_INDEX` filter defines the valid range for a price based on the index price, which is calculated from several exchanges in the market according to certain rules. (indexPrice websocket pushing will be available in the future)

In order to pass the `percent_price_index`, the following must be true for `price`:

- `price` <= `indexPrice` * `multiplierUp`
- `price` >= `indexPrice` * `multiplierDown`

**/exchangeInfo format:**

```javascript
  {
    "filterType": "PERCENT_PRICE_INDEX",
    "multiplierUp": "1.3000",
    "multiplierDown": "0.7000",
  }
```



##### PERCENT_PRICE_ORDER_SIZE

The `PERCENT_PRICE_ORDER_SIZE` filter  is used to determine whether the execution of an order would cause the market price to fluctuate beyond the limit price, and if so, the order will be rejected.

In order to pass the `percent_price_order_size`, the following must be true:

- A buy order needs to meet: the market price after the order get filled  <`askPrice` * `multiplierUp`
- A sell order needs to meet: the market price after the order get filled  >`bidPrice` * `multiplierDown`

**/exchangeInfo format:**

```javascript
  {
    "filterType": "PERCENT_PRICE_ORDER_SIZE",
    "multiplierUp": "1.3000",
    "multiplierDown": "0.7000"
  }
```



##### STATIC_PRICE_RANGE

The `STATIC_PRICE_RANGE` filter defines a static valid range for the price.

In order to pass the `static_price_range`, the following must be true for `price`:

- `price` <= `priceUp`
- `price` >= `priceDown`

**/exchangeInfo format:**

```javascript
  {
    "filterType": "STATIC_PRICE_RANGE",
    "priceUp": "520",
    "priceDown": "160"
  }
```



##### LOT_SIZE

The `LOT_SIZE` filter defines the `quantity` (aka "lots" in auction terms) rules for a symbol. There are 3 parts:

* `minQty` defines the minimum `quantity` allowed.
* `maxQty` defines the maximum `quantity` allowed.
* `stepSize` defines the intervals that a `quantity`can be increased/decreased by.

In order to pass the `lot size`, the following must be true for `quantity`:

* `quantity` >= `minQty`
* `quantity` <= `maxQty`
* (`quantity`-`minQty`) % `stepSize` == 0

**/exchangeInfo format:**

```javascript
  {
    "filterType": "LOT_SIZE",
    "minQty": "0.00100000",
    "maxQty": "99999999.00000000",
    "stepSize": "0.00100000"
  }
```



##### NOTIONAL

The `NOTIONAL` filter defines the acceptable notional range allowed for an order on a symbol.

In order to pass this filter, the notional (`price * quantity`) has to pass the following conditions:

- `price * quantity` <= `maxNotional`
- `price * quantity` >= `minNotional`

**/exchangeInfo format:**

```javascript
{
   "filterType": "NOTIONAL",
   "minNotional": "10.00000000",
   "maxNotional": "10000.00000000"
}
```



##### MAX_NUM_ORDERS

The `MAX_NUM_ORDERS` filter defines the maximum number of orders an account is allowed to have open on a symbol.
Note that both triggered "algo" orders and normal orders are counted for this filter.

**/exchangeInfo format:**

```javascript
  {
    "filterType": "MAX_NUM_ORDERS",
    "maxNumOrders": 200
  }
```



##### MAX_NUM_ALGO_ORDERS

The `MAX_ALGO_ORDERS` filter defines the maximum number of untriggered "algo" orders an account is allowed to have open on a symbol.
"Algo" orders are `STOP_LOSS`, `STOP_LOSS_LIMIT`, `TAKE_PROFIT`, and `TAKE_PROFIT_LIMIT` orders.

**/exchangeInfo format:**

```javascript
  {
    "filterType": "MAX_NUM_ALGO_ORDERS",
    "maxNumAlgoOrders": 5
  }
```



#### Exchange Filters

None for now



## Sub-account endpoints

### Query Sub-account List (For Master Account)

Applies to master accounts only.

```shell
GET /openapi/v1/sub-account/list
```

**Weight:** 1

**Parameters:**

Name       | Type  | Mandatory | Description
-----------------|--------|-----------|--------------------------------------------------------------------------------------
email      | STRING | NO    | Sub account email
page    | INT | NO | Current page, default value: 1
limit    | INT | NO | Quantity per page, default value 10, maximum `200`
recvWindow | LONG  | NO    | This value cannot be greater than `60000`
timestamp     | LONG  | YES    | A point in time for which transfers are being queried.


**Response:**
```json
{
  "subAccounts": [
    {
      "createTime": "1689744671462",
      "email": "test@coins.ph",
      "isFreeze": false
    },
    {
      "createTime": "1689744700710",
      "email": "test1@coins.ph",
      "isFreeze": false
    }
  ],
 "total": 2
}
```

### Create a Virtual Sub-account(For Master Account)

This interface currently supports the creation of virtual sub-accounts (maximum 30).

```shell
POST /openapi/v1/sub-account/create
```

**Weight:** 1

**Parameters:**

Name       | Type  | Mandatory | Description
-----------------|--------|-----------|--------------------------------------------------------------------------------------
accountName      | STRING | YES       | Sub account email
recvWindow | LONG  | NO        | This value cannot be greater than `60000`
timestamp     | LONG  | YES       | A point in time for which transfers are being queried.


**Response:**
```json
{
  "email": "test@coins.ph",
  "createTime": 1689744700710,
  "isFreeze": false
}
```


### Query Sub-account Assets (For Master Account)

Query detailed balance information of a sub-account via the master account (applies to master accounts only).

```shell
GET /openapi/v1/sub-account/asset
```

**Weight:** 1

**Parameters:**

Name       | Type  | Mandatory | Description
-----------------|--------|-----------|--------------------------------------------------------------------------------------
email      | STRING | YES       | Sub account email
recvWindow | LONG  | NO        | This value cannot be greater than `60000`
timestamp     | LONG  | YES       | A point in time for which transfers are being queried.


**Response:**
```json
{
  "balances": [
    {
      "asset": "BTC",
      "free": "0.1",
      "locked": "0"
    },
    {
      "asset": "ETH",
      "free": "0.1",
      "locked": "0"
    }
  ]
}
```



### Universal Transfer (For Master Account)

Master account can initiate a transfer from any of its sub-accounts to the master account, or from the master account to any sub-account.

```shell
POST /openapi/v1/sub-account/transfer/universal-transfer
```

**Weight:** 1

**Parameters:**

Name       | Type  | Mandatory | Description
-----------------|--------|-----------|--------------------------------------------------------------------------------------
fromEmail      | STRING | NO        | 
toEmail      | STRING | NO        | 
clientTranId      | STRING | NO        | Must be unique
asset      | STRING | YES       | 
amount      | DECIMAL | YES        | 
recvWindow | LONG  | NO        | This value cannot be greater than `60000`
timestamp     | LONG  | YES       | A point in time for which transfers are being queried.

- Transfer from master account by default if fromEmail is not sent.
- Transfer to master account by default if toEmail is not sent.
- Specify at least one of fromEmail and toEmail.
- Supported transfer scenarios:
  - Master account transfer to sub-account 
  - Sub-account transfer to master account 
  - Sub-account transfer to Sub-account


**Response:**
```json
{
  "clientTransferId": "1487573639841995271",
  "result": true//true:success,false:failed
}
```

### Transfer to Master (For Sub-account)

Sub-account can initiate a transfer from itself to the master account.

```shell
POST /openapi/v1/sub-account/transfer/sub-to-master
```

**Weight:** 1

**Parameters:**

Name       | Type  | Mandatory | Description
-----------------|--------|-----------|--------------------------------------------------------------------------------------
asset      | STRING | YES       |
amount      | DECIMAL | YES        |
clientTranId      | STRING | NO        | Must be unique
recvWindow | LONG  | NO        | This value cannot be greater than `60000`
timestamp     | LONG  | YES       | A point in time for which transfers are being queried.


**Response:**
```json
{
  "clientTransferId": "1487573639841995271",
  "result": true//true:success,false:failed
}
```

### Query Universal Transfer History (For Master Account)

Applies to master accounts only.
If startTime and endTime are not sent, this will return records of the last 30 days by default.

```shell
GET /openapi/v1/sub-account/transfer/universal-transfer-history
```

**Weight:** 1

**Parameters:**

Name       | Type  | Mandatory | Description
-----------------|--------|-----------|--------------------------------------------------------------------------------------
fromEmail      | STRING | NO        |
toEmail      | STRING | NO        |
clientTranId      | STRING | NO        | 
tokenId      | STRING | NO        | 
startTime      | LONG | NO        | Millisecond timestamp
endTime      | LONG | NO        | Millisecond timestamp,Data excluding the endTime.
page      | INT | NO        | Current page, default value: 1
limit      | INT | NO        | Quantity per page, default value `500`, maximum `500`
recvWindow | LONG  | NO        | This value cannot be greater than `60000`
timestamp     | LONG  | YES       | A point in time for which transfers are being queried.


- fromEmail and toEmail cannot be sent at the same time.
- Return fromEmail equal master account email by default.
- The query time period must be less than 30 days. 
- If startTime and endTime not sent, return records of the last 30 days by default.

**Response:**
```json
{
  "result": [
    {
      "clientTranId": "1",
      "fromEmail": "test@coins.ph",
      "toEmail": "test1@coins.ph",
      "asset": "BTC",
      "amount": "0.1",
      "createdAt": 1689744700710,
      "status": "success"//success,pending,failed
    }
  ],
  "total": 1
}
```


### Sub-account Transfer History (For Sub-account)

Applies to sub-accounts only.
If startTime and endTime are not sent, this will return records of the last 30 days by default.

```shell
GET /openapi/v1/sub-account/transfer/sub-history
```

**Weight:** 1

**Parameters:**

Name       | Type   | Mandatory | Description
-----------------|--------|-----------|--------------------------------------------------------------------------------------
asset      | STRING | NO        |
type      | INT | NO        | 1: transfer in, 2: transfer out. If the type parameter is not provided or provided incorrectly, the data returned will be for transfer out.
startTime      | LONG   | NO        | Millisecond timestamp
endTime      | LONG   | NO        | Millisecond timestamp,Data excluding the endTime.
page      | INT    | NO        | Current page, default value: 1
limit      | INT | NO        | Quantity per page, default value `500`, maximum `500`
recvWindow | LONG   | NO        | This value cannot be greater than `60000`
timestamp     | LONG   | YES       | A point in time for which transfers are being queried.
clientTranId     | STRING   | NO       |

- If type is not sent, the records of type 2: transfer out will be returned by default.
- If startTime and endTime are not sent, the recent 30-day data will be returned.

**Response:**
```json
{
  "result": [
    {
      "clientTranId": "1",
      "fromEmail": "test@coins.ph",
      "toEmail": "test1@coins.ph",
      "asset": "BTC",
      "amount": "0.1",
      "createdAt": 1689744700710,
      "status": "success"//success,pending,failed
    }
  ],
  "total": 1
}
```


### Get IP Restriction for a Sub-account API Key (For Master Account)

Query detailed IPs for a sub-account API key.

```shell
GET /openapi/v1/sub-account/apikey/ip-restriction
```

**Weight:** 1

**Parameters:**

Name       | Type   | Mandatory | Description
-----------------|--------|-----------|--------------------------------------------------------------------------------------
apikey      | STRING | YES        | 
email      | STRING | YES        | 	Sub account email
recvWindow | LONG   | NO        | This value cannot be greater than `60000`
timestamp     | LONG   | YES       | A point in time for which transfers are being queried.


**Response:**
```json
{
  "apikey": "k5V49ldtn4tszj6W3hystegdfvmGbqDzjmkCtpTvC0G74WhK7yd4rfCTo4lShf",
  "ipList": [
    "8.8.8.8"
  ],
  "ipRestrict": true,
  "role": "2,3,4,5,6",//0:READ_ONLY, 2:TRADE_ONLY, 3:CONVERT_ONLY, 4:CRYPTO_WALLET_ONLY, 5:FIAT_ONLY, 6:ACCOUNT_ONLY
  "updateTime": 1689744700710
}
```

###  Add IP Restriction for Sub-Account API key (For Master Account)

```shell
POST /openapi/v1/sub-account/apikey/add-ip-restriction
```

**Weight:** 1

**Parameters:**

Name       | Type   | Mandatory | Description
-----------------|--------|-----------|--------------------------------------------------------------------------------------
apikey      | STRING | YES       |
email      | STRING | YES       | 	Sub account email
ipAddress      | STRING | NO        | 	Can be added in batches, separated by commas
ipRestriction      | STRING | YES       | 	IP Restriction status. 2 = IP Unrestricted. 1 = Restrict access to trusted IPs only.
recvWindow | LONG   | NO        | This value cannot be greater than `60000`
timestamp     | LONG   | YES       | A point in time for which transfers are being queried.


**Response:**
```json
{
  "apikey": "k5V49ldtn4tszj6W3hystegdfvmGbqDzjmkCtpTvC0G74WhK7yd4rfCTo4lShf",
  "ipList": [
    "8.8.8.8"
  ],
  "ipRestrict": true,
  "role": "2,3,4,5,6",//0:READ_ONLY, 2:TRADE_ONLY, 3:CONVERT_ONLY, 4:CRYPTO_WALLET_ONLY, 5:FIAT_ONLY, 6:ACCOUNT_ONLY
  "updateTime": 1689744700710
}
```

###  Delete IP List For a Sub-account API Key (For Master Account)

```shell
POST /openapi/v1/sub-account/apikey/delete-ip-restriction
```

**Weight:** 1

**Parameters:**

Name       | Type   | Mandatory | Description
-----------------|--------|-----------|--------------------------------------------------------------------------------------
apikey      | STRING | YES       |
email      | STRING | YES       | 	Sub account email
ipAddress      | STRING | YES       | 	Can be added in batches, separated by commas
recvWindow | LONG   | NO        | This value cannot be greater than `60000`
timestamp     | LONG   | YES       | A point in time for which transfers are being queried.


**Response:**
```json
{
  "apikey": "k5V49ldtn4tszj6W3hystegdfvmGbqDzjmkCtpTvC0G74WhK7yd4rfCTo4lShf",
  "ipList": [
    "8.8.8.8"
  ],
  "ipRestrict": true,
  "role": "2,3,4,5,6",//0:READ_ONLY, 2:TRADE_ONLY, 3:CONVERT_ONLY, 4:CRYPTO_WALLET_ONLY, 5:FIAT_ONLY, 6:ACCOUNT_ONLY
  "updateTime": 1689744700710
}
```


###  Get Sub-account Deposit Address(For Master Account)

```shell
GET /openapi/v1/sub-account/wallet/deposit/address
```

Fetch sub account deposit address with network.


**Weight:** 10

**Parameters:**

Name       | Type   | Mandatory | Description
-----------------|--------|-----------|--------------------------------------------------------------------------------------
email      | STRING | YES       | Sub account email
coin      | STRING | YES       | 	 The value is from All Coins' Information api
network      | STRING | YES       | 	The value is from All Coins' Information api
recvWindow | LONG   | NO        | This value cannot be greater than `60000`
timestamp     | LONG   | YES       | A point in time for which transfers are being queried.


**Response:**
```json
{
  "coin": "ETH",
  "address": "0xfe98628173830bf79c59f04585ce41f7de168784",
  "addressTag": ""
}
```

###  Get Sub-account Deposit History(For Master Account)

```shell
GET /openapi/v1/sub-account/wallet/deposit/history
```

Fetch deposit history.


**Weight(IP):** 2

**Parameters:**

| Name       | Type   | Mandatory | Description                                                  |
|------------| ------ |-----------| ------------------------------------------------------------ |
| email      | STRING | YES       | Sub account email                                                             |
| coin       | STRING | NO        |                                                              |
| txId       | STRING | NO        |                                                              |
| depositId  | STRING | NO        |                                                              |
| status     | INT    | NO        | 0-PROCESSING, 1-SUCCESS, 2-FAILED, 3-NEED_FILL_DATA(travel rule info) |
| startTime  | LONG   | NO        | Default: 90 days from current timestamp                      |
| endTime    | LONG   | NO        | Default: current timestamp                                   |
| offset     | INT    | NO        | Default:0                                                    |
| limit      | LONG   | NO        | Default:1000, Max:1000                                       |
| recvWindow | LONG   | NO        |                                                              |
| timestamp  | LONG   | YES       |                                                              |

* Please note the default `startTime` and `endTime` to ensure the time interval is within 0-90 days.

* If both `startTime` and `endTime` are sent, time between `startTime` and `endTime` must be less than 90 days.


**Response:**

```javascript
[
    {
        "id": "d_769800519366885376",
        "amount": "0.001",
        "coin": "BNB",
        "network": "BNB",
        "status": 0,
        "address": "bnb136ns6lfw4zs5hg4n85vdthaad7hq5m4gtkgf23",
        "addressTag": "101764890",
        "txId": "98A3EA560C6B3336D348B6C83F0F95ECE4F1F5919E94BD006E5BF3BF264FACFC",
        "insertTime": 1661493146000,
        "confirmNo": 10,
    },
    {
        "id": "d_769754833590042625",
        "amount":"0.5",
        "coin":"IOTA",
        "network":"IOTA",
        "status":1,
        "address":"SIZ9VLMHWATXKV99LH99CIGFJFUMLEHGWVZVNNZXRJJVWBPHYWPPBOSDORZ9EQSHCZAMPVAPGFYQAUUV9DROOXJLNW",
        "addressTag":"",
        "txId":"ESBFVQUTPIWQNJSPXFNHNYHSQNTGKRVKPRABQWTAXCDWOAKDKYWPTVG9BGXNVNKTLEJGESAVXIKIZ9999",
        "insertTime":1599620082000,
        "confirmNo": 20,
    }
]
```



***Error code description:***

status code           | Description
----------------| ------------
0 | means that the call is processed normally.(Applicable to other endpoint if there is a status structure)
10000003 | Failed to fetch account verification information.
10000003 | Quote expired.
10000003 | Unable to fetch account information.
10000003 | The price has changed! Please confirm the updated rate to complete the transaction.
10000003 | Insufficient balance.
10000003 | Failed to fetch liquidity. Try again later.

#### Retrieve order history (USER_DATA)


```shell
POST /openapi/convert/v1/query-order-history
```
This endpoint retrieves order history with the option to define a specific time period using start and end times.

**Weight:** 1

**Parameters:**

Name | Type   | Mandatory | Description
------------ |--------|---------| ------------
startTime | STRING | No | Numeric string representing milliseconds. The starting point of the required period. If no period is defined, the entire order history is returned.
endTime | STRING | No |Numeric string representing milliseconds. The end point of the required period. If no period is defined, the entire order history is returned.
status | STRING | No | deliveryStatus, If this field is available, use it with startTime. `TODO`, `SUCCESS`, `FAILED`, `PROCESSING`
page | int    | No |
size | int    | No |


**Response:**

Field name	| Description
----|---
orderId	| Order ID generated by the server.
quoteId	| Order reference quote Id.
userId	| user id.
sourceCurrency	| source currency.
targetCurrency	| target currency.
sourceAmount	| source currency amount.
targetAmount	| target currency amount.
price	| price.
status	| Order status.`TODO`, `SUCCESS`, `FAILED`, `PROCESSING`
createdAt	| Order create time.
errorMessage	| Error message if order failed.



```javascript
{
  "status": 0,
   "error": "OK",
   "data": [
    {
      "id":"",
      "orderId": "25a9b92bcd4d4b2598c8be97bc65b466",
      "quoteId": "1ecce9a7265a4a329cce80de46e2c583",
      "userId":"",
      "sourceCurrency": "BTC",
      "sourceCurrencyIcon":"",
      "targetCurrency": "PHP",
      "targetCurrencyIcon":"",
      "sourceAmount": "0.11",
      "targetAmount": "4466.89275956",
      "price": "40608.115996",
      "status": "SUCCESS",
      "createdAt": "1671797993000",
      "errorCode": "",
      "errorMessage": "",
      "inversePrice": "3306.115996"
    }
  ],
  "total": 23
}
```



#### Query balance (USER_DATA)

```shell
GET /openapi/account/v3/crypto-accounts
```

This endpoint allows users to retrieve their current account balance.

**Weight:** 1
**Parameters:**

Name       | Type  | Mandatory | Description
-----------------|--------|-----------|--------------------------------------------
currency      | STRING | NO    | The currency for which the balance is being queried.
recvWindow | LONG  | YES    | This value cannot be greater than `60000`
timestamp     | LONG  | YES    | A point in time for which the balance is being queried.

**Response:**
```javascript
 {
  "crypto-accounts": [
    {
      "id": "1451431230880900352",
      "name": "name",
      "currency": "PBTC",
      "balance": "100",
      "pending_balance": "200"
    }
  ]
}
```

#### Query transfers (USER_DATA)

```shell
GET /openapi/transfer/v3/transfers/{id}
```
If an ID is provided, this endpoint retrieves an existing transfer record; otherwise, it returns a paginated list of transfers.

**Weight:** 10

**Parameters:**

Name       | Type  | Mandatory | Description
-----------------|--------|-----------|--------------------------------------------------------------------------------------
id      | STRING | NO    | ID of the transfer record
client_transfer_id| STRING | NO | Client Transfer ID, Maximum length 100
page    | INT | NO | Current page, default is `1`
per_page    | INT | NO | Quantity per page, default 2000, maximum `2000`
from_address |STRING|NO| The phone number or email for sender account (e.g. +63 9686490252 or test@coins.ph)
to_address  |STRING|NO| The phone number or email for recipient account (e.g. +63 9686490252 or test@coins.ph)
recvWindow | LONG  | YES    | This value cannot be greater than `60000`
timestamp     | LONG  | YES    | A point in time for which transfers are being queried.

- If client_transfer_id both the id and  parameters are passed, the id parameter will take precedence.
- If the client_transfer_id or id parameter is passed, then the client_transfer_id or id takes precedence.
- The from_address and to_address parameters cannot be passed simultaneously.

**Response:**
```json
 {
  "transfers": [
    {
      "id": "2309rjw0amf0sq9me0gmadsmfoa",
      "client_transfer_id": "1487573639841995270",
      "account": "90dfg03goamdf02fs",
      "amount": "1",
      "fee_amount": "0",
      "currency": "PBTC",
      "sourceAddress": "test1@gmail.com",
      "target_address": "test2@gmail.com",
      "payment": "23094j0amd0fmag9agjgasd",
      "type": 2,//2:transfer out,1:transfer in
      "status": "success",
      "message": "example",
      "created_at": "2019-07-04T03:28:50.531599Z"
    }
  ],
  "meta": {
    "total_count": 0,
    "next_page": 2,
    "previous_page": 0
  }
}
```



### Note

### Request Parameters

- Email address should be encoded. e.g. test@gmail.com should be encoded into test%40gmail.com



#### Query transaction history (USER_DATA)

```shell
GET /openapi/v1/asset/transaction/history
```

**Weight:** 10

**Parameters:**

Name       | Type  | Mandatory | Description
-----------------|--------|-----------|--------------------------------------------------------------------------------------
tokenId      | STRING | YES       | The token to retrieve data for. Example: “tokenId”: “BTC”
startTime| LONG | NO        | Timestamp in milliseconds. Timespan between startTime and endTime cannot exceed 7 days. If only startTime is provided, returns data 7 days after.
endTime| LONG | NO        | Timestamp in milliseconds. Timespan between startTime and endTime cannot exceed 7 days. If only endTime is provided, returns data 7 days before.
subUserId    | LONG | NO        | UID of sub-account.
pageNum    | INT | NO        | The current page number. Ranges from 1 - 1000, with default being 1.
pageSize    | INT | NO        | Records per page. Ranges from 1 - 100, with default being 20.
recvWindow | LONG  | NO         | To specify the number of milliseconds after timestamp the request is valid for. Must be less than 60000.
timestamp     | LONG  | YES       | A point in time for which transfers are being queried. Unix timestamp format in milliseconds.

**Response:**
```json
 {
  "transfers": [
    {
      "txId": "2309rjw0amf0sq9me0gmadsmfoa",
      "bizSubject": "CHAIN_WITHDRAWAL",
      "tokenId": "BTC",
      "status": "success",
      "changed": "1",
      "time": "1742896126999"
    }
  ],
  "meta": {
    "has_next": true,
    "next_page": 2,
    "previous_page": 0
  }
}
```



