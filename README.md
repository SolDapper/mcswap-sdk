# mcswap-sdk
Javascript SDK for the McSwap Protocol

McSwap is a Trustless Smart Escrow Protocol on the Solana Blockchain that enables app developers to build their own Marketplaces and OTC services for digital assets. Direct onchain revenue sharing is built-in and allows developers to define usage fees for when 
they or their application's users create or execute McSwap Escrows through their apps and tools.

![powered by solana](http://mcswap.xyz/gh/stacked-color.svg)

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
```

[mcswap-nft](https://solana.fm/address/34dUBGrhkvjGDPSuH3zgtpBdBwZ6QSag8JpvZAnXmXTR/verification)
```javascript
mcswap.nftCreate
mcswap.nftCancel
mcswap.nftExecute
mcswap.nftReceived
mcswap.nftSent
```

[mcswap-pnft](https://solana.fm/address/6aGKsKBA9zRbBZ2xKof94JEFf73vQg6kTWkB6gqtgfFm/verification)
```javascript
mcswap.pnftCreate
mcswap.pnftCancel
mcswap.pnftExecute
mcswap.pnftReceived
mcswap.pnftSent
```

[mcswap-cnft](https://solana.fm/address/GyQWcNNXnU2qhTry6f8CBv4M7vjV4Jab5nojvgAMQdjg/verification)
```javascript
mcswap.cnftCreate
mcswap.cnftCancel
mcswap.cnftExecute
mcswap.cnftReceived
mcswap.cnftSent
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

## example setup
```javascript
import { Keypair } from "@solana/web3.js";
const rpc = "https://staked.helius-rpc.com?api-key=YOUR-KEY";
const secret = [1,2,3,4,5,~];
const signer = Keypair.fromSecretKey(new Uint8Array(secret));
```

## mcswap-spl
### splCreate Escrow
```javascript
const tx = await mcswap.splCreate({
    rpc: rpc,
    builder: true, // builder false will return ix for tx only
    blink: false, // blink true will return a base64 formatted object
    convert: true, // pass 
    tolerance: 1.2, // cu estimate multiplier for padding if needed
    priority: "Medium", // priority fee level
    affiliateWallet: "ACgZcmgmAnMDxXxZUo9Zwg2PS6WQLXy63JnnLmJFYxZZ",
    affiliateFee: "0.0009",
    seller: "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere",
    token1Mint: "So11111111111111111111111111111111111111112",
    token1Amount: "0.001",
    token2Mint: false,
    token2Amount: false,
    buyer: false, // buyer false makes this a public listing
    token3Mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    token3Amount: "0.003",
    token4Mint: false,
    token4Amount: false
});
if(tx.tx){
    tx.tx.sign([signer]);
    const signature = await mcswap.send(rpc,tx.tx);
    console.log("signature", signature);
    console.log("awaiting status...");
    const status = await mcswap.status(rpc,signature);
    if(status!="finalized"){console.log(status);}
    else{
        console.log(status);
        const escrow = await mcswap.fetch({
            rpc:rpc, display:true, standard:"spl", escrow:tx.escrow
        });
        console.log(escrow);
    }
}
else{
    console.log(tx);
}
```

### splCancel Escrow
```javascript
const tx = await mcswap.splCancel({
    rpc: rpc,
    escrow: "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL" // escrow id (acct)
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

### splExecute Escrow
```javascript
const tx = await mcswap.splExecute({
    rpc: rpc,
    convert: true,
    affiliateWallet: "ACgZcmgmAnMDxXxZUo9Zwg2PS6WQLXy63JnnLmJFYxZZ",
    affiliateFee: "0.0009",
    escrow: "3pjxfm25WWwD9BcWSqBFamJKYgEpNAnEz8mEmxk9biBQ",
    buyer: "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL"
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

### splReceived Escrows
```javascript
const splReceived = await mcswap.splReceived({
    rpc: rpc,
    display: true,
    wallet: "2jcih7dUFmEQfMUXQQnL2Fkq9zMqj4jwpHqvRVe3gGLL"
});
console.log(splReceived);
```

### splSent Escrows
```javascript
const splSent = await mcswap.splSent({
    rpc: rpc,
    display: true,
    private: false, // (default) private false returns public listings
    wallet: "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere"
});
console.log(splSent);
```

## mcswap nft
### Create NFT Escrow
nftCreate, pnftCreate, cnftCreate, coreCreate
```javascript
const tx = await mcswap.nftCreate({
    rpc: rpc,
    builder: true,
    blink: false,
    convert: true,
    tolerance: 1.2,
    priority: "Medium",
    affiliateWallet: "ACgZcmgmAnMDxXxZUo9Zwg2PS6WQLXy63JnnLmJFYxZZ",
    affiliateFee: "0.0009",
    seller: "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere",
    sellerMint: "5Jk6hn3rR1DJjtDU4MzgDuN3SXH4nfHiYgqmEVhGyEUt",
    buyer: false, // buyer false makes this a public listing
    buyerMint: false,
    lamports: "0.0001",
    tokenMint: "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo",
    units: "0.01"
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
            rpc: rpc,
            display: true,
            standard: "nft", // nft, pnft, cnft, core
            sellerMint: "5Jk6hn3rR1DJjtDU4MzgDuN3SXH4nfHiYgqmEVhGyEUt",
            buyerMint: false
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