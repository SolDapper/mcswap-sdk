# mcswap-sdk
A Javascript SDK for the McSwap (v2) Solana Protocol

# Install SDK
```javascript
npm i mcswap-sdk
```

# Import SDK
```javascript
import mcswap from 'mcswap-sdk';
```

### Create and Fetch SPL Escrow
```javascript
import mcswap from 'mcswap-sdk';
import { Keypair } from "@solana/web3.js";
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const secret = [1,2,3,4,5,~];
const signer = Keypair.fromSecretKey(new Uint8Array(secret));
const base_fee = await mcswap.fee({
    "rpc": rpc, 
    "display":true,
    "standard":"spl"
});
console.log("base fee", base_fee+" sol");
let tx = await mcswap.splCreate({
    "rpc": rpc,
    "convert": true,
    "tolerance": "1.2",
    "priority": "Medium",
    "affiliateWallet": "ACgZcmgmAnMDxXxZUo9Zwg2PS6WQLXy63JnnLmJFYxZZ",
    "affiliateFee": "0.0009",
    "seller": "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere",
    "token1Mint": "So11111111111111111111111111111111111111112",
    "token1Amount": "0.001",
    "token2Mint": "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    "token2Amount": "0.002",
    "buyer": "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL",
    "token3Mint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "token3Amount": "0.003",
    "token4Mint": "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo",
    "token4Amount": "0.004",
});
if(typeof tx.status!="undefined"){console.log(tx);}
else{
    tx.sign([signer]);
    const signature = await mcswap.send(rpc,tx);
    console.log("signature", signature);
    console.log("awaiting status...");
    const status = await mcswap.status(rpc,signature);
    if(status!="finalized"){console.log(status);}
    else{
        console.log(status);
        const escrow = await mcswap.fetch({
            "rpc": rpc,
            "display": true,
            "standard": "spl",
            "seller": "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere",
            "buyer": "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL",
        });
        console.log(escrow);
    }
}
```

### Cancel SPL Escrow
```javascript
import mcswap from 'mcswap-sdk';
import { Keypair } from "@solana/web3.js";
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const secret = [1,2,3,4,5,~];
const signer = Keypair.fromSecretKey(new Uint8Array(secret));
const tx = await mcswap.splCancel({
    "rpc": rpc,
    "seller": "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere",
    "buyer": "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL"
});
if(typeof tx.status!="undefined"){console.log(tx);}
else{
    tx.sign([signer]);
    const signature = await mcswap.send(rpc,tx);
    console.log("signature", signature);
    console.log("awaiting status...");
    const status = await mcswap.status(rpc,signature);
    console.log(status);
}
```

### Execute SPL Escrow
```javascript
import mcswap from 'mcswap-sdk';
import { Keypair } from "@solana/web3.js";
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const secret = [1,2,3,4,5,~];
const signer = Keypair.fromSecretKey(new Uint8Array(secret));
const tx = await mcswap.splExecute({
    "rpc": rpc,
    "convert": true,
    "affiliateWallet": "ACgZcmgmAnMDxXxZUo9Zwg2PS6WQLXy63JnnLmJFYxZZ",
    "affiliateFee": "0.0009",
    "seller": "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere",
    "buyer": "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL"
});
if(typeof tx.status!="undefined"){console.log(tx);}
else{
    tx.sign([signer]);
    const signature = await mcswap.send(rpc,tx);
    console.log("signature", signature);
    console.log("awaiting status...");
    const status = await mcswap.status(rpc,signature);
    console.log(status);
}
```

### Fetch Received SPL Escrow
```javascript
import mcswap from 'mcswap-sdk';
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const splReceived = await mcswap.splReceived({
    "rpc": rpc,
    "display": true,
    "wallet": "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL"
});
console.log(splReceived);
```

### Fetch Sent SPL Escrow
```javascript
import mcswap from 'mcswap-sdk';
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const splSent = await mcswap.splSent({
    "rpc": rpc,
    "display": true,
    "wallet": "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere"
});
console.log(splSent);
```

### Supported Standards

• SPL (+SuperTokens) 

# Methods
```javascript

mcswap.splCreate
mcswap.splExecute
mcswap.splCancel
mcswap.splReceived
mcswap.splSent

mcswap.tx
mcswap.send
mcswap.status
mcswap.fetch
mcswap.fee

```