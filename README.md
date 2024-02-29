# SOLO DEX Signing SDK

This SDK facilitates developers to integrate SOLO DEX as a signing mechanism on their platforms.

[![NPM](https://nodei.co/npm/solodex.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/solodex/)

## Usage

This SDK works with events.

## Starting a new connection

```js
import SOLODEX from "solodex";

const soloDEX = new SOLODEX({
  sign_expiry: 300_000, // This is optional, by default it's set to 600,000 ms (10 minutes)
  api_key: $YOUR_API_KEY, // This is optional, go to Developer Dashboard in sologenic.org to generate an API Key
  custom_tx_delivery_endpoint, // This is optional, it will allow you to provide your own Tx Delivery if desired
});

const signingMeta = await soloDEX.signIn();

// To retrieve the push token
const token = soloDEX.token;
```

#### Properties of the returned object.

| Param         |           Type |                                                              Description |
| :------------ | -------------: | -----------------------------------------------------------------------: |
| identifier    |         string |                                     uuid of the transaction to be signed |
| expires_at    |         string |                            expiring time of the transaction to be signed |
| refs          | ConnectionRefs |                                                                          |
| refs.qr       |         string |                  URL for a QR Code that users can scan to start signing. |
| refs.deeplink |         string | Deeplink URL, to allow to sign from a browser used within the same phone |
| tx            |    Transaction |                                             The transaction to be signed |

## Signing a Transaction

This methods submits a transaction to be signed via SOLODEX App. The signingMeta object looks exactly the same as described on the `signIn` method.

```js
const signingMeta = await soloDEX.signTransaction(transaction);
```

## `setPushToken()`

This method sets the `push token` on the initialized connection. The connection will handle the storage of the token once a `signIn` is created, but it won't persist the storage.
That's why the token is provided to you to store and set in the future, if needed. The only parameter this method takes is the token. Returns nothing.

The token is used to automatically send a Push notification to the user app regarding the transaction to be signed.

If you already have a token, set it right after initializing the instance and you won't need to run the `signIn` method.

### Events

The events return the identifier of the Transaction for the last action received from the SOLODEX app. With the exception of "signed" event, which returns data of the signed transaction

```js
soloDEX.on("opened", (identifier) => {
  console.log(identifier); // 8b528257-eacd-4ab9-85c5-ed10d107f2db
});

soloDEX.on("pushed", (identifier) => {
  console.log(identifier); // 8b528257-eacd-4ab9-85c5-ed10d107f2db
});

soloDEX.on("resolved", (identifier) => {
  console.log(identifier); // 8b528257-eacd-4ab9-85c5-ed10d107f2db
});

soloDEX.on("cancelled", (identifier) => {
  console.log(identifier); // 8b528257-eacd-4ab9-85c5-ed10d107f2db
});

soloDEX.on("expired", (identifier) => {
  console.log(identifier); // 8b528257-eacd-4ab9-85c5-ed10d107f2db
});

soloDEX.on("signed", (identifier, data) => {
  console.log(identifier); // 8b528257-eacd-4ab9-85c5-ed10d107f2db

  const { signer, tx, push_token } = data;
  // Signer is the XRP Address of the user, TX the transaction signed
});
```

_Response_

| Param           |        Type |                                                                                                                                                   Description |
| :-------------- | ----------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| identifier      |      string |                                                                                                                          uuid of the transaction to be signed |
| data.signer     |      string |                                                                                                                                     XRP Address of the signer |
| data.tx         | Transaction |                                                                                                                                  The transaction to be signed |
| data.push_token |      string | Token that needs to be passed to the `signTransaction` method in order to send a push notification to the phone whenever a new transaction needs to be signed |
