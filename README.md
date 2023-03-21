# SOLO DEX Signing SDK

This SDK facilitates developers to integrate SOLO DEX as a signing mechanism on their platforms.

## Usage

This SDK works with events.

## Starting a new connection

```js
import SOLODEX from "solodex";

const soloDEX = new SOLODEX({
  sign_expiry: 300_000, // This is optional, by default it's set to 100,000 ms (10 minutes)
});

const signingMeta = await soloDEX.newConnection();
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

```js
const signingMeta = await soloDEX.sign(transaction);
```

### Events

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

  const { signer, tx } = data;
  // Signer is the XRP Address of the user, TX the transaction signed
});
```
