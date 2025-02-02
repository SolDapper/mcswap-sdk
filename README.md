# mcswap-sdk
Javascript SDK for McSwap Solana Protocol (v2)

# Install
```javascript
npm i mcswap-sdk
```

# Import
```javascript
import mcswap from 'mcswap-sdk';
```

# Methods
```javascript

// mcswap-spl
mcswap.splCreate
mcswap.splExecute
mcswap.splCancel
mcswap.splReceived
mcswap.splSent

// mcswap-core
mcswap.coreCreate
mcswap.coreCancel
mcswap.coreExecute
mcswap.coreReceived
mcswap.coreSent
mcswap.corePublic

// mcswap-nft


// mcswap-pnft


// mcswap-cnft


// utilities
mcswap.tx
mcswap.send
mcswap.status
mcswap.fetch
mcswap.fee

```
# Examples

## mcswap-spl
### Create SPL Escrow
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
    "blink": false,
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

### Received SPL Escrows
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

### Sent SPL Escrows
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

## mcswap-core
### Create CORE Escrow
```javascript
import mcswap from 'mcswap-sdk';
import { Keypair } from "@solana/web3.js";
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const secret = [1,2,3,4,5,~];
const signer = Keypair.fromSecretKey(new Uint8Array(secret)); // seller
const base_fee = await mcswap.fee({
    "rpc": rpc, 
    "display":true,
    "standard":"core"
});
console.log("base fee", base_fee+" sol");
let tx = await mcswap.coreCreate({
    "rpc": rpc,
    "blink": false,
    "convert": true,
    "tolerance": "1.2",
    "priority": "Medium",
    "affiliateWallet": "ACgZcmgmAnMDxXxZUo9Zwg2PS6WQLXy63JnnLmJFYxZZ",
    "affiliateFee": "0.0009",
    "seller": "5Aof1mNHY11PEiXKnCvHCL3nU478N5yHeXJft3Aatqhc",
    "sellerMint": "56nFoG781ZksKWEyJF5vs5H8Fq3S491EJM3BAogCqRBi",
    "buyer": "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL", // false = public listing
    "buyerMint": "J8kHWEjGo4rH1rsVbLvL7idFiKdx3sJCrwd6yU8W3JyP", // false = public listing
    "lamports": "0.0001",
    "tokenMint": "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo",
    "units": "0.01",
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
            "display": true, // display amounts in decimal format
            "standard": "core",
            "sellerMint": "56nFoG781ZksKWEyJF5vs5H8Fq3S491EJM3BAogCqRBi",
            "buyerMint": "J8kHWEjGo4rH1rsVbLvL7idFiKdx3sJCrwd6yU8W3JyP", // false = public listing
        });
        console.log(escrow);
    }
}
```

### Cancel CORE Escrow
```javascript
import mcswap from 'mcswap-sdk';
import { Keypair } from "@solana/web3.js";
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const secret = [1,2,3,4,5,~];
const signer = Keypair.fromSecretKey(new Uint8Array(secret)); // seller
const tx = await mcswap.splCancel({
    "rpc": rpc,
    "seller": "5Aof1mNHY11PEiXKnCvHCL3nU478N5yHeXJft3Aatqhc",
    "sellerMint": "56nFoG781ZksKWEyJF5vs5H8Fq3S491EJM3BAogCqRBi",
    "buyerMint": "J8kHWEjGo4rH1rsVbLvL7idFiKdx3sJCrwd6yU8W3JyP", // false = public listing
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

### Execute CORE Escrow
```javascript
import mcswap from 'mcswap-sdk';
import { Keypair } from "@solana/web3.js";
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const secret = [1,2,3,4,5,~];
const signer = Keypair.fromSecretKey(new Uint8Array(secret)); // buyer
const tx = await mcswap.coreExecute({
    "rpc": rpc,
    "blink": false,
    "convert": true,
    "tolerance": "1.2",
    "priority": "Medium",
    "affiliateWallet": "ACgZcmgmAnMDxXxZUo9Zwg2PS6WQLXy63JnnLmJFYxZZ",
    "affiliateFee": "0.0009",
    "buyer": "5Aof1mNHY11PEiXKnCvHCL3nU478N5yHeXJft3Aatqhc",
    "sellerMint": "56nFoG781ZksKWEyJF5vs5H8Fq3S491EJM3BAogCqRBi",
    "buyerMint": "J8kHWEjGo4rH1rsVbLvL7idFiKdx3sJCrwd6yU8W3JyP", // false = public listing
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

### Received CORE Escrows
```javascript
import mcswap from 'mcswap-sdk';
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const coreReceived = await mcswap.coreReceived({
     "rpc": rpc,
     "display": true,
     "wallet": "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL"
 });
 console.log(coreReceived);
 ```

### Sent CORE Escrows
```javascript
import mcswap from 'mcswap-sdk';
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const coreSent = await mcswap.coreSent({
     "rpc": rpc,
     "display": true,
     "wallet": "5Aof1mNHY11PEiXKnCvHCL3nU478N5yHeXJft3Aatqhc"
 });
 console.log(coreSent);
 ```

### Public CORE Escrows
```javascript
import mcswap from 'mcswap-sdk';
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const escrows = await mcswap.corePublic({
    "rpc": rpc,
    "display": true,
});
console.log(escrows);
```




## mcswap-nft
### Create NFT Escrow
```javascript
import mcswap from 'mcswap-sdk';
import { Keypair } from "@solana/web3.js";
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const secret = [1,2,3,4,5,~];
const signer = Keypair.fromSecretKey(new Uint8Array(secret)); // seller
const base_fee = await mcswap.fee({
    "rpc": rpc, 
    "display":true,
    "standard":"nft"
});
console.log("base fee", base_fee+" sol");
let tx = await mcswap.nftCreate({
    "blink": false,
    "rpc": rpc,
    "convert": true,
    "tolerance": "1.2",
    "priority": "Medium",
    "affiliateWallet": "ACgZcmgmAnMDxXxZUo9Zwg2PS6WQLXy63JnnLmJFYxZZ",
    "affiliateFee": "0.0009",
    "seller": "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere",
    "sellerMint": "5Jk6hn3rR1DJjtDU4MzgDuN3SXH4nfHiYgqmEVhGyEUt",
    "buyer": "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL",
    "buyerMint": "Bdzry26srWQUvdRS1kSA3kXMndybBwP1j7cmcki8Rvru",
    "lamports": "0.0001",
    "tokenMint": "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo",
    "units": "0.01",
});
if(typeof tx.status!="undefined"){console.log(tx);}
else{
    tx.sign([signer]);
    const signature = await mcswap.send(rpc,tx);
    console.log("signature", signature);
    console.log("awaiting status...");
    const status = await mcswap.status(rpc,signature);
    if(status!="finalized"){console.log("status", status);}
    else{
        console.log(status);
        const escrow = await mcswap.fetch({
            "rpc": rpc,
            "display": true,
            "standard": "nft",
            "sellerMint": "5Jk6hn3rR1DJjtDU4MzgDuN3SXH4nfHiYgqmEVhGyEUt",
            "buyerMint": "Bdzry26srWQUvdRS1kSA3kXMndybBwP1j7cmcki8Rvru"
        });
        console.log(escrow);
    }
}
```

### Cancel NFT Escrow
```javascript
import mcswap from 'mcswap-sdk';
import { Keypair } from "@solana/web3.js";
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const secret = [1,2,3,4,5,~];
const signer = Keypair.fromSecretKey(new Uint8Array(secret)); // seller
let tx = await mcswap.nftCancel({
    "rpc": rpc,
    "blink": false,
    "seller": "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere",
    "sellerMint": "5Jk6hn3rR1DJjtDU4MzgDuN3SXH4nfHiYgqmEVhGyEUt",
    "buyerMint": "Bdzry26srWQUvdRS1kSA3kXMndybBwP1j7cmcki8Rvru",
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

### Execute NFT Escrow
```javascript
import mcswap from 'mcswap-sdk';
import { Keypair } from "@solana/web3.js";
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const secret = [1,2,3,4,5,~];
const signer = Keypair.fromSecretKey(new Uint8Array(secret)); // buyer
const tx = await mcswap.nftExecute({
    "rpc": rpc,
    "blink": false,
    "convert": true,
    "tolerance": "1.2",
    "priority": "Medium",
    "affiliateWallet": "ACgZcmgmAnMDxXxZUo9Zwg2PS6WQLXy63JnnLmJFYxZZ",
    "affiliateFee": "0.0009",
    "buyer": "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL",
    "sellerMint": "5Jk6hn3rR1DJjtDU4MzgDuN3SXH4nfHiYgqmEVhGyEUt",
    "buyerMint": "Bdzry26srWQUvdRS1kSA3kXMndybBwP1j7cmcki8Rvru",
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

### Received NFT Escrow
```javascript
import mcswap from 'mcswap-sdk';
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const nftReceived = await mcswap.nftReceived({
    "rpc": rpc,
    "display": true,
    "wallet": "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL"
});
console.log(nftReceived);
```

### Sent NFT Escrow
```javascript
import mcswap from 'mcswap-sdk';
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const nftSent = await mcswap.nftSent({
    "rpc": rpc,
    "display": true,
    "wallet": "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere"
});
console.log(nftSent);
```

### Public CORE Escrows
```javascript
import mcswap from 'mcswap-sdk';
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const escrows = await mcswap.nftPublic({
    "rpc": rpc,
    "display": true,
});
console.log(escrows);
```