# mcswap-sdk
Javascript SDK for the McSwap Protocol

McSwap is a Trustless Smart Escrow Protocol on the Solana Blockchain that enables app developers to build their own Marketplaces and OTC services for digital assets. Direct onchain revenue sharing is built-in and allows developers to define usage fees for when 
their application's users create or execute an escrow through their apps and tools powered by McSwap under the hood.

# Install
```javascript
npm i mcswap-sdk
```

# Import
```javascript
import mcswap from 'mcswap-sdk';
```

# Methods
[mcswap-spl](https://solana.fm/address/BG9YVprV4XeQR15puwwaWfBBPzamTtuMRJLkAa8pG5hz/verification)
```javascript
mcswap.splCreate
mcswap.splExecute
mcswap.splCancel
mcswap.splReceived
mcswap.splSent
```

[mcswap-core](https://solana.fm/address/DE6UDLhAu8U8CL6b1XPjj76merQeSKFYgPQs2R4jc7Ba/verification)
```javascript
mcswap.coreCreate
mcswap.coreCancel
mcswap.coreExecute
mcswap.coreReceived
mcswap.coreSent
mcswap.corePublic
```

[mcswap-nft](https://solana.fm/address/34dUBGrhkvjGDPSuH3zgtpBdBwZ6QSag8JpvZAnXmXTR/verification)
```javascript
mcswap.nftCreate
mcswap.nftCancel
mcswap.nftExecute
mcswap.nftReceived
mcswap.nftSent
mcswap.nftPublic
```

[mcswap-pnft](https://solana.fm/address/6aGKsKBA9zRbBZ2xKof94JEFf73vQg6kTWkB6gqtgfFm/verification)
```javascript
mcswap.pnftCreate
mcswap.pnftCancel
mcswap.pnftExecute
mcswap.pnftReceived
mcswap.pnftSent
mcswap.pnftPublic
```

[mcswap-cnft](https://solana.fm/address/GyQWcNNXnU2qhTry6f8CBv4M7vjV4Jab5nojvgAMQdjg/verification)
```javascript
mcswap.cnftCreate
mcswap.cnftCancel
mcswap.cnftExecute
mcswap.cnftReceived
mcswap.cnftSent
mcswap.cnftPublic
```

utilities
```javascript
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

### Received NFT Escrows
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

### Sent NFT Escrows
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

### Public NFT Escrows
```javascript
import mcswap from 'mcswap-sdk';
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const escrows = await mcswap.nftPublic({
    "rpc": rpc,
    "display": true,
});
console.log(escrows);
```

## mcswap-pnft
### Create PNFT Escrow
```javascript
import mcswap from 'mcswap-sdk';
import { Keypair } from "@solana/web3.js";
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const secret = [1,2,3,4,5,~];
const signer = Keypair.fromSecretKey(new Uint8Array(secret)); // seller
const base_fee = await mcswap.fee({
    "rpc": rpc, 
    "display": true,
    "standard": "pnft"
});
console.log("base fee", base_fee+" sol");
let tx = await mcswap.pnftCreate({
    "rpc": rpc,
    "blink": false,
    "convert": true,
    "tolerance": "1.2",
    "priority": "Medium",
    "affiliateWallet": "ACgZcmgmAnMDxXxZUo9Zwg2PS6WQLXy63JnnLmJFYxZZ",
    "affiliateFee": "0.0009",
    "seller": "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere",
    "sellerMint": "BnsiXSzPmbBoBf5JpyauQrcKU7UdRA25G6PMSP4Jsa5g",
    "buyer": "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL",
    "buyerMint": "92zkz8DEjG2V7FPf74VJ3DHV99XEBpGQPddPz3KmQHtS",
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
            "standard": "pnft",
            "sellerMint": "BnsiXSzPmbBoBf5JpyauQrcKU7UdRA25G6PMSP4Jsa5g",
            "buyerMint": "92zkz8DEjG2V7FPf74VJ3DHV99XEBpGQPddPz3KmQHtS"
        });
        console.log(escrow);
    }
}
```

### Cancel PNFT Escrow
```javascript
import mcswap from 'mcswap-sdk';
import { Keypair } from "@solana/web3.js";
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const secret = [1,2,3,4,5,~];
const signer = Keypair.fromSecretKey(new Uint8Array(secret));
let tx = await mcswap.pnftCancel({
    "rpc": rpc,
    "blink": false,
    "seller": "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere",
    "sellerMint": "BnsiXSzPmbBoBf5JpyauQrcKU7UdRA25G6PMSP4Jsa5g",
    "buyerMint": "92zkz8DEjG2V7FPf74VJ3DHV99XEBpGQPddPz3KmQHtS",
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

### Execute PNFT Escrow
```javascript
import mcswap from 'mcswap-sdk';
import { Keypair } from "@solana/web3.js";
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const secret = [1,2,3,4,5,~];
const signer = Keypair.fromSecretKey(new Uint8Array(secret)); // buyer
const escrow = await mcswap.fetch({
    "rpc": rpc,
    "display": true,
    "standard": "pnft",
    "sellerMint": "BnsiXSzPmbBoBf5JpyauQrcKU7UdRA25G6PMSP4Jsa5g",
    "buyerMint": "92zkz8DEjG2V7FPf74VJ3DHV99XEBpGQPddPz3KmQHtS",
});
console.log(escrow);
const tx = await mcswap.pnftExecute({
    "rpc": rpc,
    "blink": false,
    "convert": true,
    "tolerance": "1.2",
    "priority": "Medium",
    "affiliateWallet": "ACgZcmgmAnMDxXxZUo9Zwg2PS6WQLXy63JnnLmJFYxZZ",
    "affiliateFee": "0.0009",
    "buyer": "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL",
    "sellerMint": "BnsiXSzPmbBoBf5JpyauQrcKU7UdRA25G6PMSP4Jsa5g",
    "buyerMint": "92zkz8DEjG2V7FPf74VJ3DHV99XEBpGQPddPz3KmQHtS",
});
```

### Received PNFT Escrows
```javascript
import mcswap from 'mcswap-sdk';
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const pnftReceived = await mcswap.pnftReceived({
    "rpc": rpc,
    "display": true,
    "wallet": "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL"
});
console.log(pnftReceived);
```

### Sent PNFT Escrows
```javascript
import mcswap from 'mcswap-sdk';
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const pnftSent = await mcswap.pnftSent({
    "rpc": rpc,
    "display": true,
    "wallet": "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere"
});
console.log(pnftSent);
```

### Public PNFT Escrows
```javascript
import mcswap from 'mcswap-sdk';
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const escrows = await mcswap.pnftPublic({
    "rpc": rpc,
    "display": true,
});
console.log(escrows);
```

## mcswap-cnft

### Create CNFT Escrow
```javascript
import mcswap from 'mcswap-sdk';
import { Keypair } from "@solana/web3.js";
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const secret = [1,2,3,4,5,~];
const signer = Keypair.fromSecretKey(new Uint8Array(secret)); // seller
const base_fee = await mcswap.fee({
    "rpc": rpc, 
    "display": true,
    "standard": "cnft"
});
console.log("base fee", base_fee+" sol");
const tx = await mcswap.cnftCreate({
    "rpc": rpc,
    "blink": false,
    "convert": true,
    "tolerance": "1.2",
    "priority": "Medium",
    "affiliateWallet": "ACgZcmgmAnMDxXxZUo9Zwg2PS6WQLXy63JnnLmJFYxZZ",
    "affiliateFee": "0.0009",
    "seller": "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere",
    "sellerMint": "5PdHoNA8WU6JrL6CXGR5xLrx3hGccNj59n5NvfYJTYJF",
    "buyer": "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL",
    "buyerMint": "97H5pNKnomLe8kUhPK2veNz4jbtAW1DLLDg3A3HabSCJ",
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
            "standard": "cnft",
            "sellerMint": "5PdHoNA8WU6JrL6CXGR5xLrx3hGccNj59n5NvfYJTYJF",
            "buyerMint": "97H5pNKnomLe8kUhPK2veNz4jbtAW1DLLDg3A3HabSCJ"
        });
        console.log(escrow);
    }
}
```

### Cancel CNFT Escrow
```javascript
import mcswap from 'mcswap-sdk';
import { Keypair } from "@solana/web3.js";
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const secret = [1,2,3,4,5,~];
const signer = Keypair.fromSecretKey(new Uint8Array(secret)); // seller
const tx = await mcswap.cnftCancel({
    "rpc": rpc,
    "blink": true,
    "seller": "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere",
    "sellerMint": "5PdHoNA8WU6JrL6CXGR5xLrx3hGccNj59n5NvfYJTYJF",
    "buyerMint": "97H5pNKnomLe8kUhPK2veNz4jbtAW1DLLDg3A3HabSCJ",
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

### Execute CNFT Escrow
```javascript
import mcswap from 'mcswap-sdk';
import { Keypair } from "@solana/web3.js";
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const secret = [1,2,3,4,5,~];
const signer = Keypair.fromSecretKey(new Uint8Array(secret)); // buyer
const escrow = await mcswap.fetch({
    "rpc": rpc,
    "display": true,
    "standard": "cnft",
    "sellerMint": "5PdHoNA8WU6JrL6CXGR5xLrx3hGccNj59n5NvfYJTYJF",
    "buyerMint": "97H5pNKnomLe8kUhPK2veNz4jbtAW1DLLDg3A3HabSCJ",
});
console.log(escrow);
const tx = await mcswap.cnftExecute({
    "rpc": rpc,
    "blink": false,
    "convert": true,
    "tolerance": "1.2",
    "priority": "Medium",
    "affiliateWallet": "ACgZcmgmAnMDxXxZUo9Zwg2PS6WQLXy63JnnLmJFYxZZ",
    "affiliateFee": "0.0009",
    "buyer": "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL",
    "sellerMint": "5PdHoNA8WU6JrL6CXGR5xLrx3hGccNj59n5NvfYJTYJF",
    "buyerMint": "97H5pNKnomLe8kUhPK2veNz4jbtAW1DLLDg3A3HabSCJ",
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

### Received CNFT Escrows
```javascript
import mcswap from 'mcswap-sdk';
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const cnftReceived = await mcswap.cnftReceived({
    "rpc": rpc,
    "display": true,
    "wallet": "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL"
});
console.log(cnftReceived);
```

### Sent CNFT Escrows
```javascript
import mcswap from 'mcswap-sdk';
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const cnftSent = await mcswap.cnftSent({
    "rpc": rpc,
    "display": true,
    "wallet": "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere"
});
console.log(cnftSent);
```

### Public CNFT Escrows
```javascript
import mcswap from 'mcswap-sdk';
import { Keypair } from "@solana/web3.js";
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const escrows = await mcswap.cnftPublic({
    "rpc": rpc,
    "display": true,
});
console.log(escrows);
```

# Escrow Creation Options

### Common
```javascript
// helius endpoint
rpc: string - (required)
// if true the response will be for a blink tx 
blink: bool - omit&default = false
// if true you're passing decimal values in relevant values below
convert: bool - omit&default = false
// multiplyer for cu optimization padding (non-blink txs only)
tolerance: int - omit&default = 1.1
// helius priority fee level (Min/Low/Medium/High/VeryHigh)
priority: string - omit&default = "Low"
// your app fee collection wallet
affiliateWallet: string - omit&default = protocol treasury wallet
// your app fee amount (SOL)
affiliateFee: int units || string decimal using convert - omit&default = 0
// the asset seller wallet creating the escrow
seller: string - (required)
```

### NFT Escrows
```javascript
// asset id of the nft you're sending to escrow
sellerMint: string - (required) 

// pass false or omit as the buyer to create an escrow as a public marketplace 
// listing that can be executed by anyone who fullfills the request
buyer: string - omit&default = false

// at least one of the options below must be used when 
// defining what is being requested from the buyer

// asset id of a nft IF requesting one from the buyer
// the nft you're requesting must be the same standard as the nft you're selling
buyerMint: string - omit&default = false
// amount of sol IF requesting sol from the buyer
lamports: int units || string decimal with convert - omit&default = 0
// token mint address of tokens IF requesting tokens from the buyer
tokenMint: string - omit&default = false
// amount of tokens above IF requesting tokens from the buyer
units: int units || string decimal with convert - omit&default = 0
```

### Token Escrows
```javascript
// a buyer must be defined for all mcswap-spl escrows
buyer: string - (required) 

// mint addresses below can be any spl or supertoken.
// token 1 & 2 are the seller
// token 3 & 4 are buyer
// token 2 & 4 are optional
// to escrow or SOL, use the wrapped SOL mint address

// token mint of tokens to hold in escrow
token1Mint: string - (required) 
// amount of tokens above to hold in escrow
token1Amount: int units || string decimal with convert - (required)
// optional token mint to hold in escrow
token2Mint: string - omit&default = false
// amount of optional tokens above to hold in escrow
token2Amount: int units || string decimal with convert - omit&default = false

// token mint being requested from buyer
token3Mint: string - (required) 
// amount of tokens above requested from buyer
token3Amount: int units || string decimal with convert - (required)
// optional token mint being requested from buyer
token4Mint: string - omit&default = false
// amount of optional tokens above requested from buyer
token4Amount: int units || string decimal with convert - omit&default = false
```