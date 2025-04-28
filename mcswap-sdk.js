// name: mcswap-sdk
// author: @SolDapper
// license: MIT https://github.com/SolDapper/mcswap-sdk/blob/master/LICENSE
'use strict';
import{PublicKey,Keypair,Connection,TransactionInstruction,TransactionMessage,VersionedTransaction,ComputeBudgetProgram,SystemProgram,SYSVAR_INSTRUCTIONS_PUBKEY}from "@solana/web3.js";
import * as solanaAccountCompression from "@solana/spl-account-compression";
import BufferLayout from "buffer-layout";
import * as splToken from "@solana/spl-token";
import bs58 from 'bs58';
import BN from "bn.js";
import { createMemoInstruction } from '@solana/spl-memo';
const publicKey=(property="publicKey")=>{return BufferLayout.blob(32,property);};const uint64=(property="uint64")=>{return BufferLayout.blob(8,property);}
class mcswap {
    constructor(){
        this.NAME = "McSwap Javascript SDK";
        this.PRIORITY = "Low";
        this.TOLERANCE = 1.1;
        // mcswap-spl
        this.SPL_TREASURY = "5zx6c1E5aaBE6BbXu1ureKoZfpGbPBk9srmKavr3Xz3k";
        this.SPL_MCSWAP_PROGRAM = "BG9YVprV4XeQR15puwwaWfBBPzamTtuMRJLkAa8pG5hz";
        this.SPL_STATIC_ALT = "HtWT9EbpaxrNfbTgjsMuk9dXYmkvJwyr7q7bQjCCRQHU";
        this.SPL_PROGRAM_STATE = BufferLayout.struct([
            BufferLayout.u8("is_initialized"),
            uint64("dev_lamports"),
            publicKey("dev_treasury"),
            publicKey("swap_vault_pda"),
            BufferLayout.u8("swap_vault_bump"),
        ]);
        this.SPL_SWAP_STATE = BufferLayout.struct([
            BufferLayout.u8("is_initialized"),
            uint64("utime"),
            publicKey("initializer"),
            publicKey("token1_mint"),
            uint64("token1_amount"),    
            publicKey("temp_token1_account"),
            publicKey("token2_mint"),
            uint64("token2_amount"),    
            publicKey("temp_token2_account"),
            publicKey("taker"),
            publicKey("token3_mint"),
            uint64("token3_amount"),
            publicKey("token4_mint"),
            uint64("token4_amount"),
            BufferLayout.u8("physical"), 
        ]);
        // mcswap-core
        this.CORE_TREASURY = "Fmu3MXN9oNkcJsgf9Y2X19tHyYJ4SsPxyrgVoou1iKke";
        this.CORE_MCSWAP_PROGRAM = "DE6UDLhAu8U8CL6b1XPjj76merQeSKFYgPQs2R4jc7Ba";
        this.CORE_PROGRAM = "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d";
        this.CORE_PROGRAM_STATE = BufferLayout.struct([
            BufferLayout.u8("is_initialized"),
            uint64("fee_lamports"),
            publicKey("dev_treasury"),
        ]);
        this.CORE_SWAP_STATE = BufferLayout.struct([
            BufferLayout.u8("is_initialized"),
            uint64("utime"),
            BufferLayout.u8("is_swap"),
            publicKey("initializer"),
            publicKey("initializer_asset"),
            publicKey("taker"),
            publicKey("swap_asset"),
            uint64("swap_lamports"),
            publicKey("swap_token_mint"),
            uint64("swap_tokens"),
            BufferLayout.u8("physical"), 
        ]);
        // mcswap-nft
        this.NFT_TREASURY = "7y1PdbvkkCuSYAE1zKeDrfv81Wfcuhi3ukHYPZsUoTiE";
        this.NFT_MCSWAP_PROGRAM = "34dUBGrhkvjGDPSuH3zgtpBdBwZ6QSag8JpvZAnXmXTR";
        this.NFT_STATIC_ALT = "BT4AUPXSxvbDrzSt3LLkE3Jd5s8R3fBSxJuyicyEMYH3";
        this.NFT_PROGRAM_STATE = BufferLayout.struct([
            BufferLayout.u8("is_initialized"),
            uint64("fee_lamports"),
            publicKey("dev_treasury"),
        ]);
        this.NFT_SWAP_STATE = BufferLayout.struct([
            BufferLayout.u8("is_initialized"),
            uint64("utime"),
            BufferLayout.u8("is_swap"),
            publicKey("initializer"),
            publicKey("initializer_mint"),
            publicKey("temp_mint_account"),
            publicKey("taker"),
            publicKey("swap_mint"),
            uint64("swap_lamports"),
            publicKey("swap_token_mint"),
            uint64("swap_tokens"),
            BufferLayout.u8("physical"), 
        ]);
        // mcswap-pnft
        this.PNFT_TREASURY = "FpStfD3eZaHzdsbpyYnXPLYoCnDVbmQBDxim7kvmf5R";
        this.PNFT_MCSWAP_PROGRAM = "6aGKsKBA9zRbBZ2xKof94JEFf73vQg6kTWkB6gqtgfFm";
        this.PNFT_STATIC_ALT = "F33TuQuCtiSpTjsCv4h51E2q48Wt5tyr469Lxb4Mgazu";
        this.PNFT_ATA_PROGRAM = "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        this.PNFT_RULES_PROGRAM = "auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg";
        this.PNFT_RULES_ACCT = "eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9";
        this.PNFT_METADATA_PROGRAM = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
        this.PNFT_PROGRAM_STATE = BufferLayout.struct([
            BufferLayout.u8("is_initialized"),
            uint64("fee_lamports"),
            publicKey("dev_treasury"),
        ]);
        this.PNFT_SWAP_STATE = BufferLayout.struct([
            BufferLayout.u8("is_initialized"),
            uint64("utime"),
            BufferLayout.u8("is_swap"),
            publicKey("initializer"),
            publicKey("initializer_mint"),
            publicKey("taker"),
            publicKey("swap_mint"),
            uint64("swap_lamports"),
            publicKey("swap_token_mint"),
            uint64("swap_tokens"),
            BufferLayout.u8("physical"),
        ]);
        // mcswap-cnft
        this.CNFT_TREASURY = "H6WH84cmQGbXPwMi4fsv9bPbwWjWJuyy2iviEDZS9SmL";
        this.CNFT_MCSWAP_PROGRAM = "GyQWcNNXnU2qhTry6f8CBv4M7vjV4Jab5nojvgAMQdjg";
        this.CNFT_STATIC_ALT = "6rztYc8onxK3FUku97XJrzvdZHqWavwx5xw8fB7QufCA";
        this.CNFT_BUBBLEGUM_PROGRAM = "BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY";
        this.CNFT_PROGRAM_STATE = BufferLayout.struct([
            BufferLayout.u8("is_initialized"),
            uint64("fee_lamports"),
            publicKey("dev_treasury"),
        ]);
        this.CNFT_SWAP_STATE = BufferLayout.struct([
            BufferLayout.u8("is_initialized"),
            uint64("utime"),
            BufferLayout.u8("is_swap"), 
            publicKey("initializer"),
            publicKey("delegate"),
            publicKey("asset_id"),
            publicKey("merkle_tree"),
            publicKey("root"),
            publicKey("data_hash"),
            publicKey("creator_hash"),
            uint64("nonce"),
            publicKey("swap_asset_id"),
            publicKey("swap_merkle_tree"),
            publicKey("swap_root"),
            publicKey("swap_data_hash"),
            publicKey("swap_creator_hash"),
            uint64("swap_nonce"),
            publicKey("swap_leaf_owner"),
            publicKey("swap_delegate"),
            uint64("swap_lamports"),
            publicKey("swap_token_mint"),
            uint64("swap_tokens"),
            BufferLayout.u8("physical"), 
        ]);
    }
    // mcswap-spl
    async splCreate(_data_){
        try{
            // ***************************************************************************
            if(typeof _data_.sellerEmail=="undefined"||_data_.sellerEmail==false){_data_.sellerEmail="";}
            if(typeof _data_.physical=="undefined"||_data_.physical==false){_data_.physical=0;}else{_data_.physical=parseInt(_data_.physical);}
            if(typeof _data_.builder!="undefined"&&_data_.builder==false){_data_.builder=false;}else{_data_.builder=true;}
            if(typeof _data_.convert!="undefined"&&_data_.convert===true){
                if(typeof _data_.token1Amount!="undefined"&&_data_.token1Amount>0){
                    const amount_1 = await this.convert({"rpc":_data_.rpc,"amount":_data_.token1Amount,"mint":_data_.token1Mint});
                    _data_.token1Amount = parseInt(amount_1.data);
                }
                if(typeof _data_.token2Amount!="undefined"&&_data_.token2Amount>0){
                    const amount_2 = await this.convert({"rpc":_data_.rpc,"amount":_data_.token2Amount,"mint":_data_.token2Mint});
                    _data_.token2Amount = parseInt(amount_2.data);
                }
                if(typeof _data_.token3Amount!="undefined"&&_data_.token3Amount>0){
                    const amount_3 = await this.convert({"rpc":_data_.rpc,"amount":_data_.token3Amount,"mint":_data_.token3Mint});
                    _data_.token3Amount = parseInt(amount_3.data);
                }
                if(typeof _data_.token4Amount!="undefined"&&_data_.token4Amount>0){
                    const amount_4 = await this.convert({"rpc":_data_.rpc,"amount":_data_.token4Amount,"mint":_data_.token4Mint});
                    _data_.token4Amount = parseInt(amount_4.data);
                }
                if(typeof _data_.affiliateFee!="undefined"&&_data_.affiliateFee>0){
                    const aflFee = await this.convert({"rpc":_data_.rpc,"amount":_data_.affiliateFee,"mint":"So11111111111111111111111111111111111111112"});
                    _data_.affiliateFee = parseInt(aflFee.data);
                }
            } 
            if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
            if(typeof _data_.signers=="undefined"||_data_.signers==false){_data_.signers=false;}
            let affiliateWallet = this.SPL_TREASURY;
            let affiliateFee = 0;
            if(typeof _data_.affiliateWallet != "undefined" && _data_.affiliateWallet != false && 
            typeof _data_.affiliateFee != "undefined" && _data_.affiliateFee != false && _data_.affiliateFee > 0){
                affiliateWallet = _data_.affiliateWallet;
                affiliateFee = _data_.affiliateFee;
            }
            if(typeof _data_.buyer=="undefined"||_data_.buyer==false){_data_.buyer="11111111111111111111111111111111";}
            if(_data_.seller==_data_.buyer){const _error_={};_error_.status="error";_error_.message="buyer seller wallet conflict";return _error_;}
            // ***************************************************************************
            const connection = new Connection(_data_.rpc,"confirmed");
            const seller = new PublicKey(_data_.seller);
            const buyer = new PublicKey(_data_.buyer);
            // ***************************************************************************
            let meta_data = null;
            let response = null;
            let accountInfo = null;
            let instructions = null;
            let token1Mint = "11111111111111111111111111111111";
            let token2Mint = "11111111111111111111111111111111";
            let token3Mint = "11111111111111111111111111111111";
            let token4Mint = "11111111111111111111111111111111";
            let token1Amount = 0;
            let token2Amount = 0;
            let token3Amount = 0;
            let token4Amount = 0;
            // ***************************************************************************
            const minimumRent = await connection.getMinimumBalanceForRentExemption(0);
            let rentError = false;
            if(_data_.token1Mint=="So11111111111111111111111111111111111111112" && _data_.token1Amount < minimumRent){rentError=true;}
            else if(_data_.token2Mint=="So11111111111111111111111111111111111111112" && _data_.token2Amount < minimumRent){rentError=true;}
            if(rentError===true){
                const _error_ = {}
                _error_.status="error";
                _error_.message="A minimum of "+(minimumRent/1000000000)+" is required.";
                return _error_;
            }
            // ***************************************************************************
            token1Mint=_data_.token1Mint;
            token1Amount=_data_.token1Amount;
            if(typeof _data_.token2Mint!="undefined" && _data_.token2Mint!=false){
                token2Mint=_data_.token2Mint;
                token2Amount=_data_.token2Amount;
            }
            token3Mint=_data_.token3Mint;
            token3Amount=_data_.token3Amount;
            if(typeof _data_.token4Mint!="undefined" && _data_.token4Mint!=false){
                token4Mint=_data_.token4Mint;
                token4Amount=_data_.token4Amount;
            }
            // ***************************************************************************
            meta_data = null;
            let is_22_1 = false;
            let SPL_PROGRAM_1 = splToken.TOKEN_PROGRAM_ID;
            if(token1Mint!="11111111111111111111111111111111" && token1Mint!="So11111111111111111111111111111111111111112"){
                response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"getAsset: "+token1Mint,"method":"getAsset","params":{"id":token1Mint}})});
                meta_data = await response.json();
                if(typeof meta_data.result.mint_extensions!="undefined"){
                    SPL_PROGRAM_1 = splToken.TOKEN_2022_PROGRAM_ID;
                    is_22_1 = true;
                }
            }
            meta_data = null;
            let is_22_2 = false;
            let SPL_PROGRAM_2 = splToken.TOKEN_PROGRAM_ID;
            if(token2Mint!="11111111111111111111111111111111" && token2Mint!="So11111111111111111111111111111111111111112"){
                response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"token2Mint","method":"getAsset","params":{"id":token2Mint}})});
                meta_data = await response.json();
                if(typeof meta_data.result.mint_extensions!="undefined"){
                    SPL_PROGRAM_2 = splToken.TOKEN_2022_PROGRAM_ID;
                    is_22_2 = true;
                }
            }
            meta_data = null;
            let is_22_3 = false;
            let SPL_PROGRAM_3 = splToken.TOKEN_PROGRAM_ID;
            if(token3Mint!="11111111111111111111111111111111" && token3Mint!="So11111111111111111111111111111111111111112"){
                response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":token3Mint}})});
                meta_data = await response.json();
                if(typeof meta_data.result.mint_extensions!="undefined"){
                    SPL_PROGRAM_3 = splToken.TOKEN_2022_PROGRAM_ID;
                    is_22_3 = true;
                }
            }
            meta_data = null;
            let is_22_4 = false;
            let SPL_PROGRAM_4 = splToken.TOKEN_PROGRAM_ID;
            if(token4Mint!="11111111111111111111111111111111" && token4Mint!="So11111111111111111111111111111111111111112"){
                response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":token4Mint}})});
                meta_data = await response.json();
                if(typeof meta_data.result.mint_extensions!="undefined"){
                    SPL_PROGRAM_4 = splToken.TOKEN_2022_PROGRAM_ID;
                    is_22_4 = true;
                }
            }
            // ***************************************************************************
            const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")],new PublicKey(this.SPL_MCSWAP_PROGRAM));
            let programState = null;
            programState = await connection.getAccountInfo(programStatePDA[0]).catch(function(err){const _error_={};_error_.status="error";_error_.message=err;return _error_;});  
            let devTreasury = null;
            let swapVaultPDA = null;
            if(programState != null){
                const encodedProgramStateData = programState.data;
                const decodedProgramStateData = this.SPL_PROGRAM_STATE.decode(encodedProgramStateData);
                devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
                swapVaultPDA = new PublicKey(decodedProgramStateData.swap_vault_pda);
            } 
            else{const _error_={};_error_.status="error";_error_.message="Program State Not Initialized!";return _error_;}
            // ***************************************************************************
            let token1Setting = false;
            let extensionTypes_1 = [];
            let transferFeeBasisPoints_1 = null;
            let tempToken1 = new PublicKey("11111111111111111111111111111111");
            let tempToken1Account = new PublicKey("11111111111111111111111111111111");
            let providerToken1ATA = new PublicKey("11111111111111111111111111111111");
            if(token1Amount > 0){
                tempToken1Account = new Keypair();
                tempToken1 = tempToken1Account.publicKey;
                token1Setting = true;            
                if(token1Mint != "So11111111111111111111111111111111111111112"){ 
                    providerToken1ATA = await splToken.getAssociatedTokenAddress(new PublicKey(token1Mint),seller,false,SPL_PROGRAM_1,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);    
                    const mintAccountInfo_1 = await splToken.getMint(connection,new PublicKey(token1Mint),"confirmed",SPL_PROGRAM_1);
                    if(is_22_1===true){
                        extensionTypes_1 = splToken.getExtensionTypes(mintAccountInfo_1.tlvData);
                        if(extensionTypes_1.includes(1)){
                            const extensionTransferFeeConfig = splToken.getExtensionData(splToken.ExtensionType.TransferFeeConfig,mintAccountInfo_1.tlvData);    
                            const data_1 = splToken.TransferFeeConfigLayout.decode(extensionTransferFeeConfig);
                            transferFeeBasisPoints_1 = data_1.newerTransferFee.transferFeeBasisPoints;
                        }
                    }
                }
            }
            const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),tempToken1.toBytes()],new PublicKey(this.SPL_MCSWAP_PROGRAM));            
            // ***************************************************************************
            let token2Setting = false;
            let extensionTypes_2 = [];
            let transferFeeBasisPoints_2 = null;
            let tempToken2 = new PublicKey("11111111111111111111111111111111");
            let tempToken2Account = new PublicKey("11111111111111111111111111111111");
            let providerToken2ATA = new PublicKey("11111111111111111111111111111111");
            if(token2Amount > 0){
                tempToken2Account = new Keypair();  
                tempToken2 = tempToken2Account.publicKey;
                token2Setting = true;
                if(token2Mint != "So11111111111111111111111111111111111111112"){  
                    providerToken2ATA = await splToken.getAssociatedTokenAddress(new PublicKey(token2Mint),seller,false,SPL_PROGRAM_2,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);    
                    const mintAccountInfo_2 = await splToken.getMint(connection,new PublicKey(token2Mint),"confirmed",SPL_PROGRAM_2);
                    if(is_22_2===true){
                        extensionTypes_2 = splToken.getExtensionTypes(mintAccountInfo_2.tlvData);
                        if(extensionTypes_2.includes(1)){
                            const extensionTransferFeeConfig = splToken.getExtensionData(splToken.ExtensionType.TransferFeeConfig,mintAccountInfo_2.tlvData);    
                            const data_2 = splToken.TransferFeeConfigLayout.decode(extensionTransferFeeConfig);
                            transferFeeBasisPoints_2 = data_2.newerTransferFee.transferFeeBasisPoints;
                        }
                    }
                }
            }
            // ***************************************************************************
            accountInfo = null;
            let createToken3ATA = false; 
            let createToken3ATAIx = null;
            let token3ATA = null;
            if(token3Mint != "So11111111111111111111111111111111111111112" && token3Mint != "11111111111111111111111111111111"){
                token3ATA = await splToken.getAssociatedTokenAddress(new PublicKey(token3Mint),seller,false,SPL_PROGRAM_3,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
                accountInfo = await connection.getAccountInfo(token3ATA);
                if (accountInfo == null) {
                createToken3ATA = true;
                createToken3ATAIx = splToken.createAssociatedTokenAccountInstruction(seller,token3ATA,seller,new PublicKey(token3Mint),SPL_PROGRAM_3,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
                } else {
                createToken3ATA = false;
                }
            }
            accountInfo = null;
            let createToken4ATA = false;
            let createToken4ATAIx = null;
            let token4ATA = null;
            if(token4Mint != "So11111111111111111111111111111111111111112" && token4Mint != "11111111111111111111111111111111"){
            token4ATA = await splToken.getAssociatedTokenAddress(new PublicKey(token4Mint),seller,false,SPL_PROGRAM_4,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            accountInfo = await connection.getAccountInfo(token4ATA);
            if (accountInfo == null) {
                createToken4ATA = true;
                createToken4ATAIx = splToken.createAssociatedTokenAccountInstruction(seller,token4ATA,seller,new PublicKey(token4Mint),SPL_PROGRAM_4,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            } else {
                createToken4ATA = false;
            }
            }
            // ***************************************************************************
            const totalSize = 1 + 32 + 8 + 8 + 32 + 8 + 32 + 8 + 8 + 1;
            let uarray = new Uint8Array(totalSize);
            let counter = 0;    
            uarray[counter++] = 0; // 0 = token_swap InitializeSwap instruction
            let arr;
            let takerb58 = bs58.decode(_data_.buyer);
            arr = Array.prototype.slice.call(Buffer.from(takerb58), 0);
            for (let i = 0; i < arr.length; i++) {
                uarray[counter++] = arr[i];
            }
            let byteArray;
            let byte;
            if(extensionTypes_1.includes(1)){
                let token1LessFee = token1Amount - (token1Amount * (transferFeeBasisPoints_1 / 100 / 100));
                byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
                for (let index = 0; index < byteArray.length; index ++ ) {
                    byte = token1LessFee & 0xff;
                    byteArray [ index ] = byte;
                    token1LessFee = (token1LessFee - byte) / 256 ;
                }
            }
            else{
                byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
                for (let index = 0; index < byteArray.length; index ++ ) {
                    byte = token1Amount & 0xff;
                    byteArray [ index ] = byte;
                    token1Amount = (token1Amount - byte) / 256 ;
                }
            }
            for (let i = 0; i < byteArray.length; i++) {
                uarray[counter++] = byteArray[i];
            }
            if(extensionTypes_2.includes(1)){
                let token2LessFee = token2Amount - (token2Amount * (transferFeeBasisPoints_2 / 100 / 100));
                byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
                for (let index = 0; index < byteArray.length; index ++ ) {
                    byte = token2LessFee & 0xff;
                    byteArray [ index ] = byte;
                    token2LessFee = (token2LessFee - byte) / 256 ;
                }
            }
            else{
                byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
                for (let index = 0; index < byteArray.length; index ++ ) {
                    byte = token2Amount & 0xff;
                    byteArray [ index ] = byte;
                    token2Amount = (token2Amount - byte) / 256 ;
                }
            }
            for (let i = 0; i < byteArray.length; i++) {
                uarray[counter++] = byteArray[i];
            }
            const token3Mintb58 = bs58.decode(token3Mint);
            arr = Array.prototype.slice.call(Buffer.from(token3Mintb58), 0);
            for (let i = 0; i < arr.length; i++) {
                uarray[counter++] = arr[i];
            }
            byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
            for (let index = 0; index < byteArray.length; index ++ ) {
                byte = token3Amount & 0xff;
                byteArray [ index ] = byte;
                token3Amount = (token3Amount - byte) / 256 ;
            }
            for (let i = 0; i < byteArray.length; i++) {
                uarray[counter++] = byteArray[i];
            }
            const token4Mintb58 = bs58.decode(token4Mint);
            arr = Array.prototype.slice.call(Buffer.from(token4Mintb58), 0);
            for (let i = 0; i < arr.length; i++) {
                uarray[counter++] = arr[i];
            }
            byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
            for (let index = 0; index < byteArray.length; index ++ ) {
                byte = token4Amount & 0xff;
                byteArray [ index ] = byte;
                token4Amount = (token4Amount - byte) / 256 ;
            }
            for (let i = 0; i < byteArray.length; i++) {
                uarray[counter++] = byteArray[i];
            }
            byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
            for (let index = 0; index < byteArray.length; index ++ ) {
                byte = affiliateFee & 0xff;
                byteArray [ index ] = byte;
                affiliateFee = (affiliateFee - byte) / 256 ;
            }
            for (let i = 0; i < byteArray.length; i++) {
                uarray[counter++] = byteArray[i];
            } 
            uarray[counter++] = _data_.physical;
            // ***************************************************************************
            const keys = [
                { pubkey: seller, isSigner: true, isWritable: true }, // 0
                { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 1
                { pubkey: swapVaultPDA, isSigner: false, isWritable: false }, // 2
                { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 3
                { pubkey: new PublicKey(token1Mint), isSigner: false, isWritable: true }, // 4 
                { pubkey: tempToken1, isSigner: true, isWritable: true }, // 5
                { pubkey: providerToken1ATA, isSigner: false, isWritable: true }, // 6
                { pubkey: new PublicKey(token2Mint), isSigner: false, isWritable: true }, // 7
                { pubkey: tempToken2, isSigner: token2Setting, isWritable: token2Setting }, // 8
                { pubkey: providerToken2ATA, isSigner: false, isWritable: true }, // 9
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 10
                { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 11
                { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 12
                { pubkey: devTreasury, isSigner: false, isWritable: true }, // 13
                { pubkey: new PublicKey(affiliateWallet), isSigner: false, isWritable: true }, // 14
            ];
            const initializeSwapIx = new TransactionInstruction({programId:new PublicKey(this.SPL_MCSWAP_PROGRAM),data:Buffer.from(uarray),keys:keys});
            // ***************************************************************************
            const lookupTable = new PublicKey(this.SPL_STATIC_ALT);
            const lookupTableAccount = await connection.getAddressLookupTable(lookupTable).then((res)=>res.value);
            if(!lookupTableAccount){
                const _error_ = {}
                _error_.status="error";
                _error_.message="Could not fetch ALT!";
                return _error_;
            }
            // ***************************************************************************
            if(createToken3ATA==true && createToken4ATA==true){instructions=[createToken3ATAIx,createToken4ATAIx,initializeSwapIx];}
            else if(createToken3ATA==true){instructions=[createToken3ATAIx,initializeSwapIx];} 
            else if(createToken4ATA==true){instructions=[createToken4ATAIx,initializeSwapIx];} 
            else{instructions=[initializeSwapIx];}
            // ***************************************************************************
            const _tx_ = {};
            if(typeof _data_.tolerance!="undefined"){
                _tx_.tolerance = _data_.tolerance;              
            }
            if(typeof _data_.blink!="undefined"&&_data_.blink===true){
                _tx_.serialize = true;              
                _tx_.encode = true; 
                _tx_.compute = false;
                _tx_.fees = false;
            }
            else{
                _tx_.serialize = false;              
                _tx_.encode = false;
                _tx_.compute = true;
                _tx_.fees = true;
            }
            let signers;
            if(token2Setting===true){
                signers = [tempToken1Account,tempToken2Account];
            }
            else{
                signers = [tempToken1Account];
            }
            _tx_.rpc = _data_.rpc;                     
            _tx_.account = _data_.seller;       
            _tx_.instructions = instructions;
            _tx_.signers = signers;
            _tx_.table = lookupTableAccount;                   
            _tx_.priority = _data_.priority;
            if(_data_.sellerEmail!=""){_tx_.memo = _data_.sellerEmail;}
            if(_data_.builder==false){
                return {status:"ok",message:"builder disabled",ix:instructions,table:lookupTableAccount,signers:signers,escrow:tempToken1};
            }
            else{
                const transaction = await this.tx(_tx_);
                if(transaction.status){
                    return transaction;
                }
                else{
                    return {status:"ok",escrow:tempToken1.toString(),tx:transaction};
                }
            }
            // ***************************************************************************
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async splCancel(_data_){
        try{
            // ***************************************************************************
            if(typeof _data_.builder!="undefined"&&_data_.builder==false){_data_.builder=false;}else{_data_.builder=true;}
            if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
            if(typeof _data_.signers=="undefined"||_data_.signers==false){_data_.signers=false;}
            if(typeof _data_.escrow=="undefined"||_data_.escrow==false){const _error_={};_error_.status="error";_error_.message="no escrow id provided";return _error_;}
            const connection = new Connection(_data_.rpc, "confirmed");
            const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")],new PublicKey(this.SPL_MCSWAP_PROGRAM));
            const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],new PublicKey(this.SPL_MCSWAP_PROGRAM));
            // ***************************************************************************
            const swapStatePDA = new PublicKey(_data_.escrow);
            const swapState = await connection.getAccountInfo(swapStatePDA).catch(function(){const _error_={};_error_.status="error";_error_.message="Contract Not Found!";return _error_;});
            const encodedSwapStateData = swapState.data;
            const decodedSwapStateData = this.SPL_SWAP_STATE.decode(encodedSwapStateData);
            const seller = new PublicKey(decodedSwapStateData.initializer);
            const token1Mint = new PublicKey(decodedSwapStateData.token1_mint);
            const token1Amount = new BN(decodedSwapStateData.token1_amount, 10, "le").toString();
            const tempToken1Account = new PublicKey(decodedSwapStateData.temp_token1_account);
            const token2Mint = new PublicKey(decodedSwapStateData.token2_mint);
            const token2Amount = new BN(decodedSwapStateData.token2_amount, 10, "le").toString();
            const tempToken2Account = new PublicKey(decodedSwapStateData.temp_token2_account);
            // ***************************************************************************
            let response = null;
            let meta_data = null;
            let token1ATA = new PublicKey("11111111111111111111111111111111");
            let SPL_PROGRAM_1 = splToken.TOKEN_PROGRAM_ID;
            if(token1Amount>0 && token1Mint.toString()!="So11111111111111111111111111111111111111112"){
                response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":token1Mint.toString()}})});
                meta_data = await response.json();
                if(typeof meta_data.result.mint_extensions!="undefined"){SPL_PROGRAM_1=splToken.TOKEN_2022_PROGRAM_ID;}
                token1ATA = await splToken.getAssociatedTokenAddress(token1Mint,seller,false,SPL_PROGRAM_1,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            }
            let token2ATA = new PublicKey("11111111111111111111111111111111");
            let SPL_PROGRAM_2 = splToken.TOKEN_PROGRAM_ID;
            if(token2Amount>0 && token2Mint.toString()!="So11111111111111111111111111111111111111112"){
                response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":token2Mint.toString()}})});
                meta_data = await response.json();
                if(typeof meta_data.result.mint_extensions!="undefined"){SPL_PROGRAM_2=splToken.TOKEN_2022_PROGRAM_ID;}
                token2ATA = await splToken.getAssociatedTokenAddress(token2Mint,seller,false,SPL_PROGRAM_2,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            }
            // ***************************************************************************
            const totalSize = 1 + 32;        
            let uarray=new Uint8Array(totalSize);    
            let counter=0;    
            uarray[counter++]=2;
            const keys = [
                { pubkey: seller, isSigner: true, isWritable: true }, // 0
                { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 1
                { pubkey: swapVaultPDA[0], isSigner: false, isWritable: false }, // 2
                { pubkey: swapStatePDA, isSigner: false, isWritable: true }, // 3
                { pubkey: token1Mint, isSigner: false, isWritable: true }, // 4
                { pubkey: tempToken1Account, isSigner: false, isWritable: true }, // 5
                { pubkey: token2Mint, isSigner: false, isWritable: true }, // 6
                { pubkey: tempToken2Account, isSigner: false, isWritable: true }, // 7
                { pubkey: token1ATA, isSigner: false, isWritable: true }, // 8
                { pubkey: token2ATA, isSigner: false, isWritable: true }, // 9
                { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 10
                { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 11
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 12
            ];
            const reverseSwapIx = new TransactionInstruction({programId:new PublicKey(this.SPL_MCSWAP_PROGRAM),data:Buffer.from(uarray),keys:keys});
            const instructions = [reverseSwapIx];
            const lookupTable = new PublicKey(this.SPL_STATIC_ALT);
            const lookupTableAccount = await connection.getAddressLookupTable(lookupTable).then((res)=>res.value);
            if(!lookupTableAccount){const _error_={};_error_.status="error";_error_.message="Could not fetch ALT!";return _error_;}
            // ***************************************************************************
            const _tx_ = {};
            if(typeof _data_.tolerance!="undefined"){
                _tx_.tolerance = _data_.tolerance;              
            }
            if(typeof _data_.blink!="undefined"&&_data_.blink===true){
                _tx_.serialize = true;              
                _tx_.encode = true; 
                _tx_.compute = false;
                _tx_.fees = false;
            }
            else{
                _tx_.serialize = false;              
                _tx_.encode = false;
                _tx_.compute = true;
                _tx_.fees = true;
            }
            _tx_.rpc = _data_.rpc;                     
            _tx_.account = _data_.seller;       
            _tx_.instructions = instructions;
            _tx_.signers = _data_.signers;
            _tx_.table = lookupTableAccount;  
            _tx_.priority = _data_.priority;
            if(_data_.builder==false){
                return {"status":"ok","message":"builder disabled","ix":instructions,"table":lookupTableAccount};
            }
            else{
                return await this.tx(_tx_);
            }   
            // ***************************************************************************
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async splExecute(_data_){
        try{
            // ***************************************************************************
            if(typeof _data_.memo=="undefined"){_data_.memo=false;}
            if(typeof _data_.builder!="undefined"&&_data_.builder==false){_data_.builder=false;}else{_data_.builder=true;}
            if(typeof _data_.convert!="undefined"&&_data_.convert===true){
                if(typeof _data_.affiliateFee!="undefined"&&_data_.affiliateFee>0){
                    const aflFee = await this.convert({"rpc":_data_.rpc,"amount":_data_.affiliateFee,"mint":"So11111111111111111111111111111111111111112"});
                    _data_.affiliateFee = parseInt(aflFee.data);
                }
            }
            if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
            if(typeof _data_.signers=="undefined"||_data_.signers==false){_data_.signers=false;}
            let affiliateWallet = this.SPL_TREASURY;
            let affiliateFee = 0;
            if(typeof _data_.affiliateWallet != "undefined" && _data_.affiliateWallet != false && 
            typeof _data_.affiliateFee != "undefined" && _data_.affiliateFee != false && _data_.affiliateFee > 0){
                affiliateWallet = _data_.affiliateWallet;
                affiliateFee = _data_.affiliateFee;
            }
            if(typeof _data_.buyer=="undefined"||_data_.buyer==false){const _error_={};_error_.status="error";_error_.message="no buyer wallet provided";return _error_;}
            if(typeof _data_.escrow=="undefined"||_data_.escrow==false){const _error_={};_error_.status="error";_error_.message="no escrow id provided";return _error_;}
            // ***************************************************************************
            const connection = new Connection(_data_.rpc, "confirmed");
            const buyer = new PublicKey(_data_.buyer);
            // ***************************************************************************
            let fee = null;
            let devTreasury = null;
            let programState = null;
            let swapVaultPDA = null;
            const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")],new PublicKey(this.SPL_MCSWAP_PROGRAM));
            programState = await connection.getAccountInfo(programStatePDA[0]);
            if(programState!=null){
                const encodedProgramStateData = programState.data;
                const decodedProgramStateData = this.SPL_PROGRAM_STATE.decode(encodedProgramStateData);
                fee = new BN(decodedProgramStateData.dev_lamports, 10, "le");
                devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
                swapVaultPDA = new PublicKey(decodedProgramStateData.swap_vault_pda);
            } 
            else{
                const _error_ = {};
                _error_.status="error";
                _error_.message="Program State Not Initialized";
                return _error_;
            }
            const swapStatePDA = new PublicKey(_data_.escrow);            
            let swapState = null;
            swapState = await connection.getAccountInfo(_data_.escrow);
            // // ***************************************************************************
            let token1Mint = null;
            let token1Amount = null;
            let tempToken1Account = null;
            let token2Mint = null;
            let token2Amount = null;
            let tempToken2Account = null;
            let token3Mint = null;
            let token3Amount = null;
            let token4Mint = null;
            let token4Amount = null;
            let response = null;
            let meta_data = null;            
            let spl_symbol = null;
            let spl_decimals = null;
            let spl_amount = null;
            let seller = null;
            if(swapState!=null){
                const encodedSwapStateData = swapState.data;
                const decodedSwapStateData = this.SPL_SWAP_STATE.decode(encodedSwapStateData);
                seller = new PublicKey(decodedSwapStateData.initializer);
                token1Mint = new PublicKey(decodedSwapStateData.token1_mint);
                token1Amount = new BN(decodedSwapStateData.token1_amount, 10, "le");
                tempToken1Account = new PublicKey(decodedSwapStateData.temp_token1_account);
                token2Mint = new PublicKey(decodedSwapStateData.token2_mint);
                token2Amount = new BN(decodedSwapStateData.token2_amount, 10, "le");
                tempToken2Account = new PublicKey(decodedSwapStateData.temp_token2_account);
                token3Mint = new PublicKey(decodedSwapStateData.token3_mint);
                token3Amount = new BN(decodedSwapStateData.token3_amount, 10, "le");
                token4Mint = new PublicKey(decodedSwapStateData.token4_mint);
                token4Amount = new BN(decodedSwapStateData.token4_amount, 10, "le");
            } else{const _error_={};_error_.status="error";_error_.message="No Contract Found";return _error_;}
            // ***************************************************************************
            let token1ATA = new PublicKey("11111111111111111111111111111111");
            let SPL_PROGRAM_1 = splToken.TOKEN_PROGRAM_ID;
            let account_1 = null;
            let createToken1ATA = null;
            let createToken1ATAIx = null;
            if(token1Amount>0 && token1Mint.toString()!="So11111111111111111111111111111111111111112"){
                response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},body:JSON.stringify({"jsonrpc": "2.0","id": "text","method": "getAsset","params":{"id":token1Mint.toString()}})});
                meta_data = await response.json();
                spl_symbol = meta_data.result.token_info.symbol;
                spl_decimals = parseInt(meta_data.result.token_info.decimals);
                spl_amount = parseInt(token1Amount);
                if(typeof meta_data.result.mint_extensions!="undefined"){SPL_PROGRAM_1=splToken.TOKEN_2022_PROGRAM_ID;}
                token1ATA = await splToken.getAssociatedTokenAddress(token1Mint,buyer,false,SPL_PROGRAM_1,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
                account_1 = await connection.getAccountInfo(token1ATA).catch(function(error){});
                if(account_1==null){
                    createToken1ATA = true;
                    createToken1ATAIx = splToken.createAssociatedTokenAccountInstruction(buyer,token1ATA,buyer,token1Mint,SPL_PROGRAM_1,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
                }else{createToken1ATA=false;}
            }else{createToken1ATA=false;}
            // ***************************************************************************
            let token2ATA = new PublicKey("11111111111111111111111111111111");
            let SPL_PROGRAM_2 = splToken.TOKEN_PROGRAM_ID;
            let account_2 = null;
            let createToken2ATA = null;
            let createToken2ATAIx = null;
            if(token2Amount>0 && token2Mint.toString()!="So11111111111111111111111111111111111111112"){
                response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},body:JSON.stringify({"jsonrpc": "2.0","id": "text","method": "getAsset","params":{"id":token2Mint.toString()}})});
                meta_data = await response.json();
                spl_symbol = meta_data.result.token_info.symbol;
                spl_decimals = parseInt(meta_data.result.token_info.decimals);
                spl_amount = parseInt(token2Amount);
                if(typeof meta_data.result.mint_extensions!="undefined"){SPL_PROGRAM_2=splToken.TOKEN_2022_PROGRAM_ID;}
                token2ATA = await splToken.getAssociatedTokenAddress(token2Mint,buyer,false,SPL_PROGRAM_2,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
                account_2 = await connection.getAccountInfo(token2ATA).catch(function(error){});
                if(account_2==null){
                    createToken2ATA = true;
                    createToken2ATAIx = splToken.createAssociatedTokenAccountInstruction(buyer,token2ATA,buyer,token2Mint,SPL_PROGRAM_2,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
                }else{createToken2ATA=false;}
            }else{createToken2ATA=false;}
            // ***************************************************************************
            let buyerToken3ATA = new PublicKey("11111111111111111111111111111111");
            let SPL_PROGRAM_3 = splToken.TOKEN_PROGRAM_ID;
            if(token3Amount>0){
                if(token3Mint.toString()!="So11111111111111111111111111111111111111112"){
                    response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":token3Mint.toString()}})});
                    meta_data = await response.json();
                    spl_symbol = meta_data.result.token_info.symbol;
                    spl_decimals = parseInt(meta_data.result.token_info.decimals);
                    spl_amount = parseInt(token3Amount);
                    if(typeof meta_data.result.mint_extensions!="undefined"){SPL_PROGRAM_3=splToken.TOKEN_2022_PROGRAM_ID;}
                    buyerToken3ATA = await splToken.getAssociatedTokenAddress(token3Mint,buyer,false,SPL_PROGRAM_3,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
                }
            }
            let token3ATA = new PublicKey("11111111111111111111111111111111");
            if(token3Amount>0 && token3Mint.toString()!="So11111111111111111111111111111111111111112"){
                token3ATA = await splToken.getAssociatedTokenAddress(token3Mint,seller,false,SPL_PROGRAM_3,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
            }
            let buyerToken4ATA = new PublicKey("11111111111111111111111111111111");
            let SPL_PROGRAM_4 = splToken.TOKEN_PROGRAM_ID;
            if(token4Amount>0){
                if(token4Mint.toString()!="So11111111111111111111111111111111111111112"){
                    response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":token4Mint.toString()}})});
                    meta_data = await response.json();
                    spl_symbol = meta_data.result.token_info.symbol;
                    spl_decimals = parseInt(meta_data.result.token_info.decimals);
                    spl_amount = parseInt(token4Amount);
                    if(typeof meta_data.result.mint_extensions!="undefined"){SPL_PROGRAM_4=splToken.TOKEN_2022_PROGRAM_ID;}
                    buyerToken4ATA = await splToken.getAssociatedTokenAddress(token4Mint,buyer,false,SPL_PROGRAM_4,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
                }
            }
            let token4ATA = new PublicKey("11111111111111111111111111111111");
            if(token4Amount>0 && token4Mint.toString()!="So11111111111111111111111111111111111111112"){
                token4ATA = await splToken.getAssociatedTokenAddress(token4Mint,seller,false,SPL_PROGRAM_4,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
            }
            // ***************************************************************************
            const totalSize = 1 + 8;
            let uarray = new Uint8Array(totalSize);    
            let counter = 0;
            uarray[counter++] = 1; // 1 = token_swap SwapNFTs instruction
            var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
            for (let index = 0; index < byteArray.length; index ++ ) {
                let byte = affiliateFee & 0xff;
                byteArray [ index ] = byte;
                affiliateFee = (affiliateFee - byte) / 256 ;
            }
            for (let i = 0; i < byteArray.length; i++) {
                uarray[counter++] = byteArray[i];
            }
            // ***************************************************************************
            const keys =  [
                { pubkey: buyer, isSigner: true, isWritable: true }, // 0
                { pubkey: seller, isSigner: false, isWritable: true }, // 1
                { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 2
                { pubkey: swapVaultPDA, isSigner: false, isWritable: false }, // 3
                { pubkey: swapStatePDA, isSigner: false, isWritable: true }, // 4
                { pubkey: tempToken1Account, isSigner: false, isWritable: true }, // 5
                { pubkey: tempToken2Account, isSigner: false, isWritable: true }, // 6
                { pubkey: buyerToken3ATA, isSigner: false, isWritable: true }, // 7
                { pubkey: buyerToken4ATA, isSigner: false, isWritable: true }, // 8
                { pubkey: token1ATA, isSigner: false, isWritable: true }, // 9
                { pubkey: token2ATA, isSigner: false, isWritable: true }, // 10
                { pubkey: token3ATA, isSigner: false, isWritable: true }, // 11
                { pubkey: token4ATA, isSigner: false, isWritable: true }, // 12
                { pubkey: token1Mint, isSigner: false, isWritable: true }, // 13 
                { pubkey: token2Mint, isSigner: false, isWritable: true }, // 14 
                { pubkey: token3Mint, isSigner: false, isWritable: true }, // 15 
                { pubkey: token4Mint, isSigner: false, isWritable: true }, // 16 
                { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 17
                { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 18
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 19
                { pubkey: devTreasury, isSigner: false, isWritable: true }, // 20
                { pubkey: new PublicKey(affiliateWallet), isSigner: false, isWritable: true }, // 21
            ];
            const executeSwapIx = new TransactionInstruction({programId:new PublicKey(this.SPL_MCSWAP_PROGRAM),data:Buffer.from(uarray),keys:keys});
            const lookupTable = new PublicKey(this.SPL_STATIC_ALT);
            const lookupTableAccount = await connection.getAddressLookupTable(lookupTable).then((res)=>res.value);
            if(!lookupTableAccount){const _error_={};_error_.status="error";_error_.message="Could not fetch ALT!";return _error_;}
            // // ***************************************************************************
            let instructions = [];
            if(createToken1ATA===true && createToken2ATA===true){instructions=[createToken1ATAIx,createToken2ATAIx,executeSwapIx];}
            else if(createToken1ATA===true){instructions=[createToken1ATAIx,executeSwapIx];}
            else if(createToken2ATA===true){instructions=[createToken2ATAIx,executeSwapIx];}
            else{instructions=[executeSwapIx];}
            // // ***************************************************************************
            const _tx_ = {};
            if(typeof _data_.tolerance!="undefined"){
                _tx_.tolerance = _data_.tolerance;              
            }
            if(typeof _data_.blink!="undefined"&&_data_.blink===true){
                _tx_.serialize = true;              
                _tx_.encode = true; 
                _tx_.compute = false;
                _tx_.fees = false;
            }
            else{
                _tx_.serialize = false;              
                _tx_.encode = false;
                _tx_.compute = true;
                _tx_.fees = true;
            }
            _tx_.rpc = _data_.rpc;                     
            _tx_.account = _data_.buyer;       
            _tx_.instructions = instructions;
            _tx_.table = lookupTableAccount;                   
            _tx_.priority = _data_.priority;
            _tx_.memo = _data_.memo;
            if(_data_.builder==false){
                return {status:"ok",message:"builder disabled",ix:instructions,table:lookupTableAccount,escrow:swapStatePDA};
            }
            else{
                const transaction = await this.tx(_tx_);
                if(transaction.status){
                    return transaction;
                }
                else{
                    return {status:"ok",escrow:swapStatePDA.toString(),tx:_tx_};
                }
            }
            // ***************************************************************************
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async splReceived(_data_){
        try{
            const _result_ = {}
            let connection = new Connection(_data_.rpc, "confirmed");
            const _wallet_ = new PublicKey(_data_.wallet);
            const wallet = _wallet_.toString();
            const SPL_ProgramId = new PublicKey(this.SPL_MCSWAP_PROGRAM);
            let SPL_RECEIVED = [];
            let accounts = null;
            accounts = await connection.getParsedProgramAccounts(SPL_ProgramId,{filters:[{dataSize:298,},{memcmp:{offset:185,bytes:wallet,},},],}).catch(function(){});
            if(accounts != null && accounts.length > 0){for(let i=0;i<accounts.length;i++){
                const account = accounts[i];
                const resultStatePDA = account.pubkey;
                let resultState = null;
                const record = {};
                resultState = await connection.getAccountInfo(resultStatePDA);
                if(resultState != null){
                  const decodedData = this.SPL_SWAP_STATE.decode(resultState.data);
                  const acct = account.pubkey.toString();
                  record.acct = acct;
                  const initializer = new PublicKey(decodedData.initializer);
                  record.seller = initializer.toString();
                  const taker = new PublicKey(decodedData.taker);
                  record.buyer = taker.toString();
                  const utime = new BN(decodedData.utime, 10, "le");
                  record.utime = parseInt(utime.toString());
                  record.token_1_mint = new PublicKey(decodedData.token1_mint).toString();
                  record.token_2_mint = new PublicKey(decodedData.token2_mint).toString();
                  record.token_3_mint = new PublicKey(decodedData.token3_mint).toString();
                  record.token_4_mint = new PublicKey(decodedData.token4_mint).toString();
                  record.token_1_amount = parseInt(new BN(decodedData.token1_amount, 10, "le"));
                  record.token_2_amount = parseInt(new BN(decodedData.token2_amount, 10, "le"));
                  record.token_3_amount = parseInt(new BN(decodedData.token3_amount, 10, "le"));
                  record.token_4_amount = parseInt(new BN(decodedData.token4_amount, 10, "le"));
                  record.physical = parseInt(new BN(decodedData.physical, 10, "le"));
                  if(typeof _data_.display!="undefined"&&_data_.display===true){
                    const token_1_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_1_amount,"mint":record.token_1_mint,"display":_data_.display});
                    const token_3_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_3_amount,"mint":record.token_3_mint,"display":_data_.display});
                    record.token_1_amount = token_1_amount.data;
                    record.token_3_amount = token_3_amount.data;
                    if(record.token_2_mint!="11111111111111111111111111111111"){
                        const token_2_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_2_amount,"mint":record.token_2_mint,"display":_data_.display});
                        record.token_2_amount = token_2_amount.data;
                    }
                    else{
                        record.token_2_mint = false;
                        record.token_2_amount = 0;
                    }
                    if(record.token_4_mint!="11111111111111111111111111111111"){
                        const token_4_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_4_amount,"mint":record.token_4_mint,"display":_data_.display});
                        record.token_4_amount = token_4_amount.data;
                    }
                    else{
                        record.token_4_mint = false;
                        record.token_4_amount = 0;
                    }
                  }
                  SPL_RECEIVED.push(record);
                }
                if(i == (accounts.length - 1)){
                    _result_.status="ok";
                    _result_.message="success";
                    _result_.data=SPL_RECEIVED;
                    return _result_;
                } 
            }}
            else{
              _result_.status="ok";
              _result_.message="no contracts found";
              _result_.data=SPL_RECEIVED;
              return _result_;
            }
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async splSent(_data_){
        try{
            if(typeof _data_.private=="undefined"||_data_.private!=true){_data_.private=false;}
            const _result_ = {}
            let connection = new Connection(_data_.rpc, "confirmed");
            const _wallet_ = new PublicKey(_data_.wallet);
            const wallet = _wallet_.toString();
            const SPL_ProgramId = new PublicKey(this.SPL_MCSWAP_PROGRAM);
            let SPL_SENT = [];
            let accounts = null;
            accounts = await connection.getParsedProgramAccounts(SPL_ProgramId,{filters:[{dataSize:298,},{memcmp:{offset:9,bytes:wallet,},}],}).catch(function(){});
            if(accounts != null && accounts.length > 0){for(let i=0;i<accounts.length;i++){
                const account = accounts[i];
                const resultStatePDA = account.pubkey;
                let resultState = null;
                const record = {};
                resultState = await connection.getAccountInfo(resultStatePDA);
                if(resultState != null){
                    const decodedData = this.SPL_SWAP_STATE.decode(resultState.data);
                    const acct = account.pubkey.toString();
                    record.acct = acct;
                    const initializer = new PublicKey(decodedData.initializer);
                    record.seller = initializer.toString();
                    const taker = new PublicKey(decodedData.taker);
                    record.buyer = taker.toString();
                    const utime = new BN(decodedData.utime, 10, "le");
                    record.utime = parseInt(utime.toString());
                    record.token_1_mint = new PublicKey(decodedData.token1_mint).toString();
                    record.token_2_mint = new PublicKey(decodedData.token2_mint).toString();
                    record.token_3_mint = new PublicKey(decodedData.token3_mint).toString();
                    record.token_4_mint = new PublicKey(decodedData.token4_mint).toString();
                    record.token_1_amount = parseInt(new BN(decodedData.token1_amount, 10, "le"));
                    record.token_2_amount = parseInt(new BN(decodedData.token2_amount, 10, "le"));
                    record.token_3_amount = parseInt(new BN(decodedData.token3_amount, 10, "le"));
                    record.token_4_amount = parseInt(new BN(decodedData.token4_amount, 10, "le"));
                    record.physical = parseInt(new BN(decodedData.physical, 10, "le"));
                    // if private
                    let pushit = false;
                    if(_data_.private === true){
                        if(record.buyer!="11111111111111111111111111111111"){pushit=true;}
                    }
                    else{
                        if(record.buyer=="11111111111111111111111111111111"){pushit=true;}
                    }
                    if(record.buyer=="11111111111111111111111111111111"){record.buyer=false;}
                    if(pushit === true){
                        if(typeof _data_.display!="undefined"&&_data_.display===true){
                            const token_1_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_1_amount,"mint":record.token_1_mint,"display":_data_.display});
                            const token_3_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_3_amount,"mint":record.token_3_mint,"display":_data_.display});
                            record.token_1_amount = token_1_amount.data;
                            record.token_3_amount = token_3_amount.data;
                            if(record.token_2_mint!="11111111111111111111111111111111"){
                                const token_2_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_2_amount,"mint":record.token_2_mint,"display":_data_.display});
                                record.token_2_amount = token_2_amount.data;
                            }
                            else{
                                record.token_2_mint = false;
                                record.token_2_amount = 0;
                            }
                            if(record.token_4_mint!="11111111111111111111111111111111"){
                                const token_4_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_4_amount,"mint":record.token_4_mint,"display":_data_.display});
                                record.token_4_amount = token_4_amount.data;
                            }
                            else{
                                record.token_4_mint = false;
                                record.token_4_amount = 0;
                            }
                        }
                        SPL_SENT.push(record);
                    }
                }
                if(i == (accounts.length - 1)){
                    _result_.status="ok";
                    _result_.message="success";
                    _result_.data=SPL_SENT;
                    return _result_;
                } 
            }}
            else{
                _result_.status="ok";
                _result_.message="no contracts found";
                _result_.data=SPL_SENT;
                return _result_;
            }
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    // mcswap-core
    async coreCreate(_data_){
        try{
            // ***************************************************************************
            if(typeof _data_.sellerEmail=="undefined"||_data_.sellerEmail==false){_data_.sellerEmail="";}
            if(typeof _data_.physical=="undefined"||_data_.physical==false){_data_.physical=0;}else{_data_.physical=parseInt(_data_.physical);}
            if(typeof _data_.builder!="undefined"&&_data_.builder==false){_data_.builder=false;}else{_data_.builder=true;}
            if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
            if(typeof _data_.signers=="undefined"||_data_.signers==false){_data_.signers=false;}
            let affiliateWallet = this.CORE_TREASURY;
            let affiliateFee = 0;
            if(typeof _data_.affiliateWallet!="undefined" && _data_.affiliateWallet!=false && 
            typeof _data_.affiliateFee!="undefined" && _data_.affiliateFee!=false && _data_.affiliateFee>0){
                affiliateWallet = _data_.affiliateWallet;
                affiliateFee = _data_.affiliateFee;
            }
            if(typeof _data_.convert!="undefined"&&_data_.convert===true&&typeof _data_.affiliateFee!="undefined"&&_data_.affiliateFee!=false&&_data_.affiliateFee>0){
                let affiliate_ = await this.convert({"rpc":_data_.rpc,"amount":_data_.affiliateFee,"mint":"So11111111111111111111111111111111111111112"});
                affiliateFee = affiliate_.data;
                _data_.affiliateFee = affiliate_.data;
            }
            if(typeof _data_.convert!="undefined"&&_data_.convert===true&&typeof _data_.lamports!="undefined"&&_data_.lamports!=false&&_data_.lamports>0){
                let amount_a = await this.convert({"rpc":_data_.rpc,"amount":_data_.lamports,"mint":"So11111111111111111111111111111111111111112"});
                _data_.lamports = amount_a.data;
            }else{_data_.lamports=0;}
            if(typeof _data_.convert!="undefined"&&_data_.convert===true&&typeof _data_.units!="undefined"&&_data_.units!=false&&_data_.units>0){
                let amount_b = await this.convert({"rpc":_data_.rpc,"amount":_data_.units,"mint":_data_.tokenMint});
                _data_.units = amount_b.data;
            }else{_data_.units=0;}
            if(_data_.seller==_data_.buyer){
                const _error_ = {}
                _error_.status="error";
                _error_.message="buyer and seller can not be the same";
                return _error_;
            }
            if(typeof _data_.sellerMint=="undefined"||_data_.sellerMint==false||_data_.sellerMint==""){
                const _error_ = {}
                _error_.status="error";
                _error_.message="sellerMint not defined";
                return _error_;
            }
            // ***************************************************************************
            const connection = new Connection(_data_.rpc,"confirmed");
            const seller = new PublicKey(_data_.seller);
            const taker = "11111111111111111111111111111111";
            if(typeof _data_.buyer!="undefined"&&_data_.buyer!=false&&_data_.buyer!=""){buyer=new PublicKey(_data_.buyer);}else{_data_.buyer=taker;}
            // ***************************************************************************
            let isSwap = true;
            if(typeof _data_.buyerMint=="undefined"||typeof _data_.buyerMint==false||_data_.buyerMint==""){_data_.buyerMint="11111111111111111111111111111111";isSwap=false;}
            if(typeof _data_.tokenMint=="undefined"||typeof _data_.tokenMint==false||_data_.tokenMint==""){_data_.units=0;_data_.tokenMint="11111111111111111111111111111111";}
            if(typeof _data_.lamports=="undefined"||typeof _data_.lamports==false){_data_.lamports=0;}
            if(typeof _data_.units=="undefined"||typeof _data_.units==false){_data_.units=0;}
            const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")],new PublicKey(this.CORE_MCSWAP_PROGRAM));
            const programState = await connection.getAccountInfo(programStatePDA[0]).catch(function(error){});
            const encodedProgramStateData = programState.data;
            const decodedProgramStateData = this.CORE_PROGRAM_STATE.decode(encodedProgramStateData);
            const devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
            const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],new PublicKey(this.CORE_MCSWAP_PROGRAM));
            const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(_data_.sellerMint).toBytes(),new PublicKey(_data_.buyerMint).toBytes()],new PublicKey(this.CORE_MCSWAP_PROGRAM));
            let assetCollection = new PublicKey("11111111111111111111111111111111");
            const response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":_data_.sellerMint}})});
            const getAsset = await response.json();
            if(typeof getAsset.result.grouping!="undefined"&&typeof getAsset.result.grouping[0]!="undefined"&&typeof getAsset.result.grouping[0].group_value!="undefined"){
            assetCollection = getAsset.result.grouping[0].group_value;}
            let createSwapTokenATA = false; 
            let createSwapTokenATAIx = null;
            let CORE_TOKEN_PROGRAM = splToken.TOKEN_PROGRAM_ID;
            if(_data_.tokenMint!="11111111111111111111111111111111"){  
                const resp = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"1A","method":"getAsset","params":{"id":_data_.tokenMint}})});
                const getAss = await resp.json();
                if(typeof getAss.result.mint_extensions!="undefined"){CORE_TOKEN_PROGRAM=splToken.TOKEN_2022_PROGRAM_ID;}
                const swapTokenATA = await splToken.getAssociatedTokenAddress(new PublicKey(_data_.tokenMint),new PublicKey(_data_.seller),false,CORE_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
                let tokenAccount = null;
                tokenAccount=await connection.getAccountInfo(swapTokenATA).catch(function(){});
                if(tokenAccount==null){
                    createSwapTokenATA=true;
                    createSwapTokenATAIx=splToken.createAssociatedTokenAccountInstruction(new PublicKey(_data_.seller),swapTokenATA,new PublicKey(_data_.seller),new PublicKey(_data_.tokenMint),CORE_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
                }
            }
            // ***************************************************************************
            const totalSize = 1 + 1 + 32 + 32 + 8 + 32 + 8 + 8 + 1;
            let uarray = new Uint8Array(totalSize);
            let counter = 0;
            uarray[counter++] = 0;
            if(isSwap===true){uarray[counter++]=1;}else{uarray[counter++]=0;}
            const takerb58 = bs58.decode(_data_.buyer);
            let arr = Array.prototype.slice.call(Buffer.from(takerb58),0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            const swapAssetb58 = bs58.decode(_data_.buyerMint);
            arr = Array.prototype.slice.call(Buffer.from(swapAssetb58), 0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            let byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
            let swapLamports = _data_.lamports;
            for(let index=0;index<byteArray.length;index++){
                let byte=swapLamports & 0xff;
                byteArray [index]=byte;
                swapLamports=(swapLamports-byte)/256;
            }
            for(let i=0;i<byteArray.length;i++){uarray[counter++]=byteArray[i];}
            const swapTokenMintb58 = bs58.decode(_data_.tokenMint);
            arr = Array.prototype.slice.call(Buffer.from(swapTokenMintb58), 0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
            let swapTokens = _data_.units;
            for(let index=0;index<byteArray.length;index++){
                let byte=swapTokens & 0xff;
                byteArray [index]=byte;
                swapTokens=(swapTokens-byte)/256;
            }
            for(let i=0;i<byteArray.length;i++){uarray[counter++]=byteArray[i];}
            byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
            for(let index=0;index<byteArray.length;index++){
                let byte = affiliateFee & 0xff;
                byteArray [ index ] = byte;
                affiliateFee = (affiliateFee - byte) / 256 ;
            }
            for (let i=0;i<byteArray.length;i++){uarray[counter++]=byteArray[i];}
            uarray[counter++] = _data_.physical;
            const keys = [
                { pubkey: new PublicKey(_data_.seller), isSigner: true, isWritable: true }, // 0
                { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 1
                { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 2
                { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 3
                { pubkey: new PublicKey(_data_.sellerMint), isSigner: false, isWritable: true }, // 4
                { pubkey: new PublicKey(assetCollection), isSigner: false, isWritable: true }, // 5
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 6
                { pubkey: new PublicKey(this.CORE_PROGRAM), isSigner: false, isWritable: false }, // 7
                { pubkey: devTreasury, isSigner: false, isWritable: true }, // 8
                { pubkey: new PublicKey(affiliateWallet), isSigner: false, isWritable: true }, // 9
            ];
            let instructions;
            const initializeSwapIx = new TransactionInstruction({programId:new PublicKey(this.CORE_MCSWAP_PROGRAM),data:Buffer.from(uarray),keys:keys});
            if(createSwapTokenATA==true){instructions=[createSwapTokenATAIx,initializeSwapIx];}else{instructions=[initializeSwapIx];}
            // ***************************************************************************
            const _tx_ = {};
            if(typeof _data_.tolerance!="undefined"){
                _tx_.tolerance = _data_.tolerance;              
            }
            if(typeof _data_.blink!="undefined"&&_data_.blink===true){
                _tx_.serialize = true;              
                _tx_.encode = true; 
                _tx_.compute = false;
                _tx_.fees = false;
            }
            else{
                _tx_.serialize = false;              
                _tx_.encode = false;
                _tx_.compute = true;
                _tx_.fees = true;
            }
            _tx_.rpc = _data_.rpc;                     
            _tx_.account = _data_.seller;       
            _tx_.instructions = instructions;
            _tx_.signers = false;
            _tx_.table = false;               
            _tx_.priority = _data_.priority;
            if(_data_.sellerEmail!=""){_tx_.memo = _data_.sellerEmail;}
            if(_data_.builder==false){
                return {status:"ok",message:"builder disabled",ix:instructions,table:false};
            }
            else{
                return await this.tx(_tx_);
            }   
            // ***************************************************************************
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async coreCancel(_data_){
        try{
            // ***************************************************************************
            if(typeof _data_.builder!="undefined"&&_data_.builder==false){_data_.builder=false;}else{_data_.builder=true;}
            if(typeof _data_.priority=="undefined"||_data_.priority==false){_data_.priority=this.PRIORITY;}
            if(typeof _data_.buyerMint=="undefined"||_data_.buyerMint==false||_data_.buyerMint==""){_data_.buyerMint="11111111111111111111111111111111";}
            if(typeof _data_.sellerMint=="undefined"||_data_.sellerMint==false||_data_.sellerMint==""){
                const _error_ = {}
                _error_.status="error";
                _error_.message="buyerMint not defined";
                return _error_;
            }
            const connection = new Connection(_data_.rpc, "confirmed");
            const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],new PublicKey(this.CORE_MCSWAP_PROGRAM));
            const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(_data_.sellerMint).toBytes(),new PublicKey(_data_.buyerMint).toBytes()],new PublicKey(this.CORE_MCSWAP_PROGRAM));
            const swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(error){});
            const encodedSwapStateData = swapState.data;
            const decodedSwapStateData = this.CORE_SWAP_STATE.decode(encodedSwapStateData);
            _data_.seller = new PublicKey(decodedSwapStateData.initializer).toString();
            let assetCollection = new PublicKey("11111111111111111111111111111111");
            const response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":_data_.sellerMint}})});
            const getAsset = await response.json();
            if(typeof getAsset.result.grouping!="undefined"&&typeof getAsset.result.grouping[0]!="undefined"&&typeof getAsset.result.grouping[0].group_value!="undefined"){assetCollection = getAsset.result.grouping[0].group_value;}
            const totalSize = 1 + 32;
            let uarray = new Uint8Array(totalSize);    
            let counter = 0;    
            uarray[counter++] = 2;
            const swapAssetb58 = bs58.decode(_data_.buyerMint);
            const arr = Array.prototype.slice.call(Buffer.from(swapAssetb58), 0);
            for(let i = 0; i < arr.length; i++) {uarray[counter++] = arr[i];}
            const keys = [
              { pubkey: new PublicKey(_data_.seller), isSigner: true, isWritable: true }, // 0
              { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 1
              { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 2
              { pubkey: new PublicKey(_data_.sellerMint), isSigner: false, isWritable: true }, // 3
              { pubkey: new PublicKey(assetCollection), isSigner: false, isWritable: true }, // 4
              { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 5
              { pubkey: new PublicKey(this.CORE_PROGRAM), isSigner: false, isWritable: false }, // 6
            ];
            const reverseSwapIx = new TransactionInstruction({programId:new PublicKey(this.CORE_MCSWAP_PROGRAM),data:Buffer.from(uarray),keys:keys});
            const instructions = [reverseSwapIx];
            // ***************************************************************************
            const _tx_ = {};
            if(typeof _data_.tolerance!="undefined"){
                _tx_.tolerance = _data_.tolerance;              
            }
            if(typeof _data_.blink!="undefined"&&_data_.blink===true){
                _tx_.serialize = true;              
                _tx_.encode = true; 
                _tx_.compute = false;
                _tx_.fees = false;
            }
            else{
                _tx_.serialize = false;              
                _tx_.encode = false;
                _tx_.compute = true;
                _tx_.fees = true;
            }
            _tx_.rpc = _data_.rpc;                     
            _tx_.account = _data_.seller;       
            _tx_.instructions = instructions;
            _tx_.signers = _data_.signers;
            _tx_.table = false;  
            _tx_.priority = _data_.priority;
            if(_data_.builder==false){
                return {"status":"ok","message":"builder disabled","ix":instructions,"table":false};
            }
            else{
                return await this.tx(_tx_);
            }   
            // ***************************************************************************
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async coreExecute(_data_){
        try{
            // ***************************************************************************
            if(typeof _data_.memo=="undefined"){_data_.memo=false;}
            if(typeof _data_.builder!="undefined"&&_data_.builder==false){_data_.builder=false;}else{_data_.builder=true;}
            if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
            if(typeof _data_.signers=="undefined"||_data_.signers==false){_data_.signers=false;}
            let affiliateWallet = this.CORE_TREASURY;
            let affiliateFee = 0;
            if(typeof _data_.affiliateWallet!="undefined" && _data_.affiliateWallet!=false && 
            typeof _data_.affiliateFee!="undefined" && _data_.affiliateFee!=false && _data_.affiliateFee>0){
                affiliateWallet = _data_.affiliateWallet;
                affiliateFee = _data_.affiliateFee;
            }
            if(typeof _data_.convert!="undefined"&&_data_.convert===true&&typeof _data_.affiliateFee!="undefined"&&_data_.affiliateFee!=false&&_data_.affiliateFee>0){
                let affiliate_ = await this.convert({"rpc":_data_.rpc,"amount":_data_.affiliateFee,"mint":"So11111111111111111111111111111111111111112"});
                affiliateFee = affiliate_.data;
                _data_.affiliateFee = affiliate_.data;
            }
            if(typeof _data_.buyerMint=="undefined"||_data_.buyerMint==false){_data_.buyerMint="11111111111111111111111111111111";}
            // ***************************************************************************
            const connection = new Connection(_data_.rpc,"confirmed");
            const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")],new PublicKey(this.CORE_MCSWAP_PROGRAM));
            const programState = await connection.getAccountInfo(programStatePDA[0]).catch(function(){});
            const encodedProgramStateData = programState.data;
            const decodedProgramStateData = this.CORE_PROGRAM_STATE.decode(encodedProgramStateData);
            const devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
            const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],new PublicKey(this.CORE_MCSWAP_PROGRAM));
            const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(_data_.sellerMint).toBytes(),new PublicKey(_data_.buyerMint).toBytes()],new PublicKey(this.CORE_MCSWAP_PROGRAM)); 
            const swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(error){});
            let isSwap = true;
            const encodedSwapStateData = swapState.data;
            const decodedSwapStateData = this.CORE_SWAP_STATE.decode(encodedSwapStateData);
            if(new BN(decodedSwapStateData.is_swap, 10, "le") == 0){isSwap = false;}
            const initializer = new PublicKey(decodedSwapStateData.initializer);
            const initializerAsset = new PublicKey(decodedSwapStateData.initializer_asset);
            const swapLamports = new BN(decodedSwapStateData.swap_lamports, 10, "le");
            const swapTokenMint = new PublicKey(decodedSwapStateData.swap_token_mint);
            const swapTokens = new BN(decodedSwapStateData.swap_tokens, 10, "le");
            // ***************************************************************************
            let assetCollection = new PublicKey("11111111111111111111111111111111");
            const response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":_data_.sellerMint}})});
            const getAsset = await response.json();
            if(typeof getAsset.result.grouping!="undefined"&&typeof getAsset.result.grouping[0]!="undefined"&&typeof getAsset.result.grouping[0].group_value!="undefined"){
            assetCollection = getAsset.result.grouping[0].group_value;}
            let swapAssetCollection = new PublicKey("11111111111111111111111111111111");
            if(_data_.buyerMint!="11111111111111111111111111111111"){  
                const resp = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":_data_.buyerMint}})});
                const getAss = await resp.json();
                if(typeof getAss.result.grouping!="undefined"&&typeof getAss.result.grouping[0]!="undefined"&&typeof getAss.result.grouping[0].group_value!="undefined"){
                swapAssetCollection = getAss.result.grouping[0].group_value;}
            }
            let CORE_TOKEN_PROGRAM = splToken.TOKEN_PROGRAM_ID;
            if(swapTokenMint.toString()!="11111111111111111111111111111111"){  
                const resp_ = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"1A","method":"getAsset","params":{"id":swapTokenMint.toString()}})});
                const getAss_ = await resp_.json();
                if(typeof getAss_.result.mint_extensions!="undefined"){CORE_TOKEN_PROGRAM=splToken.TOKEN_2022_PROGRAM_ID;}
            }
            const buyerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,new PublicKey(_data_.buyer),false,CORE_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            const sellerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,initializer,false,CORE_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            // ***************************************************************************
            const totalSize = 1 + 8;
            let uarray = new Uint8Array(totalSize);    
            let counter = 0;    
            uarray[counter++] = 1;
            let byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
            for(let index=0;index<byteArray.length;index++){
                let byte = affiliateFee & 0xff;
                byteArray [ index ] = byte;
                affiliateFee = (affiliateFee - byte) / 256 ;
            }
            for (let i = 0; i < byteArray.length; i++) {
                uarray[counter++] = byteArray[i];
            }
            // ***************************************************************************
            const keys = [
                { pubkey: new PublicKey(_data_.buyer), isSigner: true, isWritable: true }, // 0
                { pubkey: initializer, isSigner: false, isWritable: true }, // 1
                { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 2
                { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 3
                { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 4
                { pubkey: new PublicKey(_data_.sellerMint), isSigner: false, isWritable: true }, // 5
                { pubkey: new PublicKey(assetCollection), isSigner: false, isWritable: true }, // 6
                { pubkey: new PublicKey(_data_.buyerMint), isSigner: false, isWritable: true }, // 7
                { pubkey: new PublicKey(swapAssetCollection), isSigner: false, isWritable: true }, // 8
                { pubkey: buyerTokenATA, isSigner: false, isWritable: true }, // 9
                { pubkey: new PublicKey(swapTokenMint), isSigner: false, isWritable: true }, // 10  HERE
                { pubkey: sellerTokenATA, isSigner: false, isWritable: true }, // 11
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 12
                { pubkey: new PublicKey(this.CORE_PROGRAM), isSigner: false, isWritable: false }, // 13
                { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 14
                { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 15  HERE
                { pubkey: devTreasury, isSigner: false, isWritable: true }, // 16
                { pubkey: new PublicKey(affiliateWallet), isSigner: false, isWritable: true }, // 17
            ];
            const swapNFTsIx = new TransactionInstruction({programId:new PublicKey(this.CORE_MCSWAP_PROGRAM),data:Buffer.from(uarray),keys:keys});
            const instructions = [swapNFTsIx];
            // ***************************************************************************
            const _tx_ = {};
            if(typeof _data_.tolerance!="undefined"){
                _tx_.tolerance = _data_.tolerance;              
            }
            if(typeof _data_.blink!="undefined"&&_data_.blink===true){
                _tx_.serialize = true;              
                _tx_.encode = true; 
                _tx_.compute = false;
                _tx_.fees = false;
            }
            else{
                _tx_.serialize = false;              
                _tx_.encode = false;
                _tx_.compute = true;
                _tx_.fees = true;
            }
            _tx_.rpc = _data_.rpc;                     
            _tx_.account = _data_.buyer;       
            _tx_.instructions = instructions;
            _tx_.table = false;                   
            _tx_.priority = _data_.priority;
            _tx_.memo = _data_.memo;
            if(_data_.builder==false){
                return {"status":"ok","message":"builder disabled","ix":instructions,"table":false};
            }
            else{
                return await this.tx(_tx_);
            }   
            // ***************************************************************************
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async coreReceived(_data_){
        try{
            const connection = new Connection(_data_.rpc,"confirmed");
            const CORE_ProgramId = new PublicKey(this.CORE_MCSWAP_PROGRAM);
            const _result_ = {}
            let CORE_RECEIVED = [];
            let accounts = null;
            accounts = await connection.getParsedProgramAccounts(CORE_ProgramId,{filters:[{dataSize:187,},{memcmp:{offset:74,bytes:_data_.wallet,},},],}).catch(function(){});
            if(accounts != null && accounts.length > 0){for(let i=0;i<accounts.length;i++){
                const account = accounts[i];
                const resultStatePDA = account.pubkey;
                let resultState = null;
                const record = {};
                resultState = await connection.getAccountInfo(resultStatePDA);
                if(resultState != null){
                    let decodedData = this.CORE_SWAP_STATE.decode(resultState.data);
                    const acct = account.pubkey.toString();
                    record.acct = acct;
                    const initializer = new PublicKey(decodedData.initializer).toString();
                    const initializer_mint = new PublicKey(decodedData.initializer_asset).toString();
                    const is_swap = new PublicKey(decodedData.is_swap).toString();
                    const utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
                    let taker = new PublicKey(decodedData.taker).toString();
                    let swap_mint = new PublicKey(decodedData.swap_asset).toString();
                    let swap_lamports = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
                    let swap_token_mint = new PublicKey(decodedData.swap_token_mint).toString();
                    let swap_tokens = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
                    let physical = parseInt(new BN(decodedData.physical, 10, "le"));
                    if(taker=="11111111111111111111111111111111"){taker=false;}
                    if(swap_mint=="11111111111111111111111111111111"){swap_mint=false;}
                    if(swap_token_mint=="11111111111111111111111111111111"){swap_token_mint=false;}
                    if(swap_tokens>0){}else{swap_tokens=0;}
                    if(swap_lamports>0){}else{swap_lamports=0;}
                    record.utime = utime;
                    record.seller = initializer;
                    record.buyer = taker;
                    record.sellerMint = initializer_mint;
                    record.buyerMint = swap_mint;
                    record.lamports = swap_lamports;
                    record.tokenMint = swap_token_mint;
                    record.units = swap_tokens;
                    record.physical = physical;
                    if(typeof _data_.display!="undefined"&&_data_.display===true){
                        if(record.lamports>0){
                            const lamports = await this.convert({"rpc":_data_.rpc,"amount":record.lamports,"mint":"So11111111111111111111111111111111111111112","display":_data_.display});
                            record.lamports = lamports.data;
                        }
                        if(record.units>0){
                            const units = await this.convert({"rpc":_data_.rpc,"amount":record.units,"mint":record.tokenMint,"display":_data_.display});
                            record.units = units.data;
                        }
                    }
                    CORE_RECEIVED.push(record);
                }
                if(i==(accounts.length-1)){
                    _result_.status="ok";
                    _result_.message="success";
                    _result_.data=CORE_RECEIVED;
                    return _result_;
                }
            }
            }
            else{
                _result_.status="ok";
                _result_.message="no contracts found";
                _result_.data=CORE_RECEIVED;
                return _result_;
            }
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async coreSent(_data_){
        try{
            if(typeof _data_.private=="undefined"||_data_.private!=true){_data_.private=false;}
            const connection = new Connection(_data_.rpc,"confirmed");
            const CORE_ProgramId = new PublicKey(this.CORE_MCSWAP_PROGRAM);
            const _result_ = {}
            let CORE_SENT = [];
            let accounts = null;
            accounts = await connection.getParsedProgramAccounts(CORE_ProgramId,{filters:[{dataSize:187,},{memcmp:{offset:10,bytes:_data_.wallet,},},],}).catch(function(){});
            if(accounts != null && accounts.length > 0){for(let i=0;i<accounts.length;i++){
                const account = accounts[i];
                const resultStatePDA = account.pubkey;
                let resultState = null;
                const record = {};
                resultState = await connection.getAccountInfo(resultStatePDA);
                if(resultState != null){
                    let decodedData = this.CORE_SWAP_STATE.decode(resultState.data);
                    const acct = account.pubkey.toString();
                    record.acct = acct;
                    const initializer = new PublicKey(decodedData.initializer).toString();
                    const initializer_mint = new PublicKey(decodedData.initializer_asset).toString();
                    const is_swap = new PublicKey(decodedData.is_swap).toString();
                    const utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
                    let taker = new PublicKey(decodedData.taker).toString();
                    let swap_mint = new PublicKey(decodedData.swap_asset).toString();
                    let swap_token_mint = new PublicKey(decodedData.swap_token_mint).toString();
                    let swap_tokens = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
                    let swap_lamports = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
                    let physical = parseInt(new BN(decodedData.physical, 10, "le"));
                    if(taker=="11111111111111111111111111111111"){taker=false;}
                    if(swap_mint=="11111111111111111111111111111111"){swap_mint=false;}
                    if(swap_token_mint=="11111111111111111111111111111111"){swap_token_mint=false;}
                    if(swap_tokens>0){}else{swap_tokens=0;}
                    if(swap_lamports>0){}else{swap_lamports=0;}
                    record.utime = utime;
                    record.seller = initializer;
                    record.buyer = taker;
                    record.sellerMint = initializer_mint;
                    record.buyerMint = swap_mint;
                    record.lamports = swap_lamports;
                    record.tokenMint = swap_token_mint;
                    record.units = swap_tokens;
                    record.physical = physical;
                    // if private
                    let pushit = false;
                    if(_data_.private === true){
                        if(record.buyer!=false){pushit=true;}
                    }
                    else{
                        if(record.buyer==false){pushit=true;}
                    }
                    if(pushit === true){
                        if(typeof _data_.display!="undefined"&&_data_.display===true){
                            if(record.lamports>0){
                                const lamports = await this.convert({"rpc":_data_.rpc,"amount":record.lamports,"mint":"So11111111111111111111111111111111111111112","display":_data_.display});
                                record.lamports = lamports.data;
                            }
                            if(record.units>0){
                                const units = await this.convert({"rpc":_data_.rpc,"amount":record.units,"mint":record.tokenMint,"display":_data_.display});
                                record.units = units.data;
                            }
                        }
                        CORE_SENT.push(record);
                    }
                }
                if(i==(accounts.length-1)){
                    _result_.status="ok";
                    _result_.message="success";
                    _result_.data=CORE_SENT;
                    return _result_;
                }
            }
            }
            else{
                _result_.status="ok";
                _result_.message="no contracts found";
                _result_.data=CORE_SENT;
                return _result_;
            }
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    // mcswap-nft
    async nftCreate(_data_){
        try{
            // ***************************************************************************
            if(typeof _data_.sellerEmail=="undefined"||_data_.sellerEmail==false){_data_.sellerEmail="";}
            if(typeof _data_.physical=="undefined"||_data_.physical==false){_data_.physical=0;}else{_data_.physical=parseInt(_data_.physical);}
            if(typeof _data_.builder!="undefined"&&_data_.builder==false){_data_.builder=false;}else{_data_.builder=true;}
            if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
            if(typeof _data_.signers=="undefined"||_data_.signers==false){_data_.signers=false;}
            let affiliateWallet = this.NFT_TREASURY;
            let affiliateFee = 0;
            if(typeof _data_.affiliateWallet!="undefined" && _data_.affiliateWallet!=false && 
            typeof _data_.affiliateFee!="undefined" && _data_.affiliateFee!=false && _data_.affiliateFee>0){
                affiliateWallet = _data_.affiliateWallet;
                affiliateFee = _data_.affiliateFee;
            }
            if(typeof _data_.convert!="undefined"&&_data_.convert===true&&typeof _data_.affiliateFee!="undefined"&&_data_.affiliateFee!=false&&_data_.affiliateFee>0){
                let affiliate_ = await this.convert({"rpc":_data_.rpc,"amount":_data_.affiliateFee,"mint":"So11111111111111111111111111111111111111112"});
                affiliateFee = affiliate_.data;
                _data_.affiliateFee = affiliate_.data;
            }
            if(typeof _data_.convert!="undefined"&&_data_.convert===true&&typeof _data_.lamports!="undefined"&&_data_.lamports!=false&&_data_.lamports>0){
                let amount_a = await this.convert({"rpc":_data_.rpc,"amount":_data_.lamports,"mint":"So11111111111111111111111111111111111111112"});
                _data_.lamports = amount_a.data;
            }else{_data_.lamports=0;}
            if(typeof _data_.convert!="undefined"&&_data_.convert===true&&typeof _data_.units!="undefined"&&_data_.units!=false&&_data_.units>0){
                let amount_b = await this.convert({"rpc":_data_.rpc,"amount":_data_.units,"mint":_data_.tokenMint});
                _data_.units = amount_b.data;
            }else{_data_.units=0;}
            if(_data_.seller==_data_.buyer){
                const _error_ = {}
                _error_.status="error";
                _error_.message="buyer and seller can not be the same";
                return _error_;
            }
            if(typeof _data_.sellerMint=="undefined"||_data_.sellerMint==false||_data_.sellerMint==""){
                const _error_ = {}
                _error_.status="error";
                _error_.message="sellerMint not defined";
                return _error_;
            }
            // ***************************************************************************
            let connection = new Connection(_data_.rpc, "confirmed");
            let taker = "11111111111111111111111111111111";
            if(typeof _data_.buyer!="undefined"&&_data_.buyer!=false&&_data_.buyer!=""){}else{_data_.buyer=taker;}
            let isSwap = true;
            const mint = _data_.sellerMint;
            let swapMint = "11111111111111111111111111111111";
            if(typeof _data_.buyerMint!="undefined"&&_data_.buyerMint!=false){swapMint=_data_.buyerMint;}else{isSwap=false;}
            let swapLamports=parseInt(_data_.lamports);
            let swapTokens = 0;
            let swapTokenMint = new PublicKey("11111111111111111111111111111111");
            if(typeof _data_.units!="undefined"&&_data_.units!=false&&_data_.units>0){swapTokens=parseInt(_data_.units);swapTokenMint=new PublicKey(_data_.tokenMint);}
            const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")],new PublicKey(this.NFT_MCSWAP_PROGRAM));
            const programState = await connection.getAccountInfo(programStatePDA[0]).catch(function(){});
            const encodedProgramStateData = programState.data;
            const decodedProgramStateData = this.NFT_PROGRAM_STATE.decode(encodedProgramStateData);
            const devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
            const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],new PublicKey(this.NFT_MCSWAP_PROGRAM));
            const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"), new PublicKey(mint).toBytes(), new PublicKey(swapMint).toBytes()],new PublicKey(this.NFT_MCSWAP_PROGRAM));
            let response = null;
            let meta_data = null;
            // ***************************************************************************
            let PROGRAM_1 = splToken.TOKEN_PROGRAM_ID;
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":mint}})});
            meta_data = await response.json();
            if(typeof meta_data.result?.mint_extensions != "undefined"){
                PROGRAM_1 = splToken.TOKEN_2022_PROGRAM_ID;
            }
            const swapVaultATA = await splToken.getAssociatedTokenAddress(new PublicKey(mint),swapVaultPDA[0],true,PROGRAM_1,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);        
            const createSwapVaultATAIx = splToken.createAssociatedTokenAccountInstruction(new PublicKey(_data_.seller),swapVaultATA,swapVaultPDA[0],new PublicKey(mint),PROGRAM_1,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
            const providerMintATA = await splToken.getAssociatedTokenAddress(new PublicKey(mint),new PublicKey(_data_.seller),false,PROGRAM_1,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
            // ***************************************************************************
            let PROGRAM_2 = splToken.TOKEN_PROGRAM_ID;
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":swapMint}})});
            meta_data = await response.json();
            if(typeof meta_data.result?.mint_extensions != "undefined"){
                PROGRAM_2 = splToken.TOKEN_2022_PROGRAM_ID;
            }
            // ***************************************************************************
            let createSwapMintATA = false;
            let swapMintATA = null;
            let createSwapMintATAIx = null;        
            if (swapMint != "11111111111111111111111111111111") {
              swapMintATA = await splToken.getAssociatedTokenAddress(new PublicKey(swapMint),new PublicKey(_data_.seller),false,PROGRAM_2,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
              let response_a = null;
              response_a = await connection.getAccountInfo(swapMintATA).catch(function(){});
              if (response_a == null) {
                createSwapMintATA = true;
                createSwapMintATAIx = splToken.createAssociatedTokenAccountInstruction(new PublicKey(_data_.seller),swapMintATA,
                new PublicKey(_data_.seller),new PublicKey(swapMint),PROGRAM_2,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
              }
            }
            // ***************************************************************************
            let createSwapTokenATA = false;
            let swapTokenATA = null;
            let createSwapTokenATAIx = null;        
            if(swapTokenMint.toString() != "11111111111111111111111111111111"){
                let PROGRAM_3 = splToken.TOKEN_PROGRAM_ID;
                response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":swapTokenMint.toString()}})});
                meta_data = await response.json();
                if(typeof meta_data.result.mint_extensions != "undefined"){
                    PROGRAM_3 = splToken.TOKEN_2022_PROGRAM_ID;
                }
                swapTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,new PublicKey(_data_.seller),false,PROGRAM_3,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
                let response_b = null;
                response_b = await connection.getAccountInfo(swapTokenATA).catch(function(error){});
                if (response_b == null) {
                    createSwapTokenATA = true;
                    createSwapTokenATAIx = splToken.createAssociatedTokenAccountInstruction(new PublicKey(_data_.seller),swapTokenATA,new PublicKey(_data_.seller),swapTokenMint,PROGRAM_3,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
                }
            }
            // ***************************************************************************
            const totalSize = 1 + 1 + 32 + 32 + 8 + 32 + 8 + 8 + 1; 
            let uarray = new Uint8Array(totalSize);
            let counter = 0;    
            uarray[counter++] = 0; // 0 = nft_swap InitializeSwap instruction
            if(isSwap==true){uarray[counter++]=1;}else{uarray[counter++]=0;}
            let arr;
            const takerb58 = bs58.decode(_data_.buyer);
            arr = Array.prototype.slice.call(Buffer.from(takerb58),0);
            for(let i = 0; i < arr.length; i++){uarray[counter++]=arr[i];}
            const swapMintb58 = bs58.decode(swapMint);
            arr = Array.prototype.slice.call(Buffer.from(swapMintb58), 0);
            for(let i = 0; i < arr.length; i++){uarray[counter++]=arr[i];}
            let byte;
            let byteArray;
            let index;
            byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
            for(index = 0; index < byteArray.length; index ++ ){byte=swapLamports & 0xff;byteArray[index]=byte;swapLamports=(swapLamports-byte)/256;}
            for(let i = 0; i < byteArray.length; i++) {uarray[counter++]=byteArray[i];}
            const swapTokenMintb58 = bs58.decode(swapTokenMint.toString());
            arr = Array.prototype.slice.call(Buffer.from(swapTokenMintb58),0);
            for(let i = 0; i < arr.length; i++){uarray[counter++]=arr[i];}
            byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
            for(index = 0; index < byteArray.length; index ++ ){byte=swapTokens & 0xff;byteArray[index]=byte;swapTokens=(swapTokens-byte)/256;}
            for(let i = 0; i < byteArray.length; i++){uarray[counter++]=byteArray[i];}
            byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
            for(let index = 0; index < byteArray.length; index ++ ){byte = affiliateFee & 0xff;byteArray [ index ] = byte;affiliateFee = (affiliateFee - byte) / 256 ;}
            for (let i = 0; i < byteArray.length; i++) {uarray[counter++] = byteArray[i];}
            uarray[counter++] = _data_.physical;
            // ***************************************************************************
            const keys = [
                { pubkey: new PublicKey(_data_.seller), isSigner: true, isWritable: true }, // 0
                { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 1
                { pubkey: swapVaultATA, isSigner: false, isWritable: true }, // 2
                { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 3
                { pubkey: providerMintATA, isSigner: false, isWritable: true }, // 4
                { pubkey: new PublicKey(mint), isSigner: false, isWritable: true }, // 5
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 6
                { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 7
                { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 8
                { pubkey: devTreasury, isSigner: false, isWritable: true }, // 9
                { pubkey: new PublicKey(affiliateWallet), isSigner: false, isWritable: true }, // 10
            ];
            // ***************************************************************************
            const initializeSwapIx = new TransactionInstruction({programId: new PublicKey(this.NFT_MCSWAP_PROGRAM),data: Buffer.from(uarray),keys});
            let instructions = null;
            if (isSwap == true) {
              if (createSwapMintATA == true && createSwapTokenATA == true) {instructions = [createSwapVaultATAIx,createSwapMintATAIx,createSwapTokenATAIx,initializeSwapIx];} 
              else if (createSwapMintATA == true) {instructions = [createSwapVaultATAIx,createSwapMintATAIx,initializeSwapIx];}
              else if (createSwapTokenATA == true) {instructions = [createSwapVaultATAIx,createSwapTokenATAIx,initializeSwapIx];} 
              else {instructions = [createSwapVaultATAIx,initializeSwapIx];}
            } 
            else {
              if (createSwapTokenATA == true) {instructions = [createSwapVaultATAIx,createSwapTokenATAIx,initializeSwapIx];}
              else {instructions = [createSwapVaultATAIx,initializeSwapIx];}
            }
            const lookupTableAccount = await connection.getAddressLookupTable(new PublicKey(this.NFT_STATIC_ALT)).then((res) => res.value);
            // ***************************************************************************
            const _tx_ = {};
            if(typeof _data_.tolerance!="undefined"){
                _tx_.tolerance = _data_.tolerance;              
            }
            if(typeof _data_.blink!="undefined"&&_data_.blink===true){
                _tx_.serialize = true;              
                _tx_.encode = true; 
                _tx_.compute = false;
                _tx_.fees = false;
            }
            else{
                _tx_.serialize = false;              
                _tx_.encode = false;
                _tx_.compute = true;
                _tx_.fees = true;
            }
            _tx_.rpc = _data_.rpc;                     
            _tx_.account = _data_.seller;       
            _tx_.instructions = instructions;
            _tx_.signers = false;
            _tx_.table = lookupTableAccount;                   
            _tx_.priority = _data_.priority;
            if(_data_.sellerEmail!=""){_tx_.memo = _data_.sellerEmail;}
            if(_data_.builder==false){
                return {"status":"ok","message":"builder disabled","ix":instructions,"table":lookupTableAccount};
            }
            else{
                return await this.tx(_tx_);
            }   
            // ***************************************************************************
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async nftCancel(_data_){
        try{
            // ***************************************************************************
            if(typeof _data_.builder!="undefined"&&_data_.builder==false){_data_.builder=false;}else{_data_.builder=true;}
            if(typeof _data_.priority=="undefined"||_data_.priority==false){_data_.priority=this.PRIORITY;}
            if(typeof _data_.buyerMint=="undefined"||_data_.buyerMint==false||_data_.buyerMint==""){_data_.buyerMint="11111111111111111111111111111111";}
            if(typeof _data_.sellerMint=="undefined"||_data_.sellerMint==false||_data_.sellerMint==""){
                const _error_ = {}
                _error_.status="error";
                _error_.message="buyerMint not defined";
                return _error_;
            }
            // ***************************************************************************
            const connection = new Connection(_data_.rpc,"confirmed");
            const assetId = _data_.sellerMint;
            let swapMint = "11111111111111111111111111111111";
            if (typeof _data_.buyerMint!="undefined"){swapMint=_data_.buyerMint;}
            const NFTSwapProgramId = new PublicKey(this.NFT_MCSWAP_PROGRAM);
            const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],NFTSwapProgramId);
            const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(assetId).toBytes(),new PublicKey(swapMint).toBytes()],NFTSwapProgramId);
            const swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(error){});
            const encodedSwapStateData = swapState.data;
            const decodedSwapStateData = this.NFT_SWAP_STATE.decode(encodedSwapStateData);
            const tempMintAccount = new PublicKey(decodedSwapStateData.temp_mint_account);
            _data_.seller = new PublicKey(decodedSwapStateData.initializer).toString();
            let response;
            let meta_data;
            let ASSET_PROGRAM_ID = splToken.TOKEN_PROGRAM_ID;
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":_data_.sellerMint}})});
            meta_data = await response.json();
            if(typeof meta_data.result.mint_extensions != "undefined"){
                ASSET_PROGRAM_ID = splToken.TOKEN_2022_PROGRAM_ID;
            }
            const initializerMintATA = await splToken.getAssociatedTokenAddress(new PublicKey(assetId),new PublicKey(_data_.seller),false,ASSET_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
            const totalSize = 1;
            let uarray = new Uint8Array(totalSize);
            let counter = 0;
            uarray[counter++] = 2; // 2 = nft_swap ReverseSwap instruction
            const reverseSwapIx = new TransactionInstruction({
              programId: NFTSwapProgramId,
              data: Buffer.from(uarray),
              keys: [
                { pubkey: new PublicKey(_data_.seller), isSigner: true, isWritable: true }, // 0
                { pubkey: swapVaultPDA[0], isSigner: false, isWritable: false }, // 1
                { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 2
                { pubkey: tempMintAccount, isSigner: false, isWritable: true }, // 3
                { pubkey: initializerMintATA, isSigner: false, isWritable: true }, // 4
                { pubkey: new PublicKey(assetId), isSigner: false, isWritable: true }, // 6
                { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 7
                { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 8
              ]
            });
            const instructions = [reverseSwapIx];
            // ***************************************************************************
            const _tx_ = {};
            if(typeof _data_.tolerance!="undefined"){
                _tx_.tolerance = _data_.tolerance;              
            }
            if(typeof _data_.blink!="undefined"&&_data_.blink===true){
                _tx_.serialize = true;              
                _tx_.encode = true; 
                _tx_.compute = false;
                _tx_.fees = false;
            }
            else{
                _tx_.serialize = false;              
                _tx_.encode = false;
                _tx_.compute = true;
                _tx_.fees = true;
            }
            _tx_.rpc = _data_.rpc;                     
            _tx_.account = _data_.seller;       
            _tx_.instructions = instructions;
            _tx_.signers = _data_.signers;
            _tx_.table = false;  
            _tx_.priority = _data_.priority;
            if(_data_.builder==false){
                return {"status":"ok","message":"builder disabled","ix":instructions,"table":false};
            }
            else{
                return await this.tx(_tx_);
            }   
            // ***************************************************************************
        }catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async nftExecute(_data_){
        try{
            // ***************************************************************************
            if(typeof _data_.memo=="undefined"){_data_.memo=false;}
            if(typeof _data_.builder!="undefined"&&_data_.builder==false){_data_.builder=false;}else{_data_.builder=true;}
            if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
            if(typeof _data_.signers=="undefined"||_data_.signers==false){_data_.signers=false;}
            let affiliateWallet = this.NFT_TREASURY;
            let affiliateFee = 0;
            if(typeof _data_.affiliateWallet!="undefined" && _data_.affiliateWallet!=false && 
            typeof _data_.affiliateFee!="undefined" && _data_.affiliateFee!=false && _data_.affiliateFee>0){
                affiliateWallet = _data_.affiliateWallet;
                affiliateFee = _data_.affiliateFee;
            }
            if(typeof _data_.convert!="undefined"&&_data_.convert===true&&typeof _data_.affiliateFee!="undefined"&&_data_.affiliateFee!=false&&_data_.affiliateFee>0){
                let affiliate_ = await this.convert({"rpc":_data_.rpc,"amount":_data_.affiliateFee,"mint":"So11111111111111111111111111111111111111112"});
                affiliateFee = affiliate_.data;
                _data_.affiliateFee = affiliate_.data;
            }
            if(typeof _data_.buyerMint=="undefined"||_data_.buyerMint==false){_data_.buyerMint="11111111111111111111111111111111";}
            // ***************************************************************************
            const connection = new Connection(_data_.rpc,"confirmed");
            const mint = _data_.sellerMint;
            let swapMint = "11111111111111111111111111111111";
            if(typeof _data_.buyerMint!="undefined"){swapMint=_data_.buyerMint;}
            let response;
            let meta_data;
            const NFTSwapProgramId = new PublicKey(this.NFT_MCSWAP_PROGRAM);
            const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")],NFTSwapProgramId);
            const programState = await connection.getAccountInfo(programStatePDA[0]).catch(function(error) {});        
            const encodedProgramStateData = programState.data;
            const decodedProgramStateData = this.NFT_PROGRAM_STATE.decode(encodedProgramStateData);
            const devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
            const feeLamports = new BN(decodedProgramStateData.fee_lamports, 10, "le").toString();
            const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],NFTSwapProgramId);
            const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(mint).toBytes(),new PublicKey(swapMint).toBytes()],NFTSwapProgramId);
            const swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(error){});
            let isSwap = true;
            const encodedSwapStateData = swapState.data;
            const decodedSwapStateData = this.NFT_SWAP_STATE.decode(encodedSwapStateData);
            if(new BN(decodedSwapStateData.is_swap, 10, "le")==0){isSwap=false}
            const initializer = new PublicKey(decodedSwapStateData.initializer);
            const initializerMint = new PublicKey(decodedSwapStateData.initializer_mint);
            const tempMintAccount = new PublicKey(decodedSwapStateData.temp_mint_account);
            const swapLamports = new BN(decodedSwapStateData.swap_lamports, 10, "le");
            const swapTokenMint = new PublicKey(decodedSwapStateData.swap_token_mint);
            const swapTokens = new BN(decodedSwapStateData.swap_tokens, 10, "le");
            // ***************************************************************************
            let ASSET_PROGRAM_1 = splToken.TOKEN_PROGRAM_ID;
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":initializerMint.toString()}})});
            meta_data = await response.json();
            if(typeof meta_data.result.mint_extensions != "undefined"){
                ASSET_PROGRAM_1 = splToken.TOKEN_2022_PROGRAM_ID;
            }
            let createInitializerMintATA = false;
            let createInitializerMintATAIx = null;
            const initializerMintATA = await splToken.getAssociatedTokenAddress(initializerMint,new PublicKey(_data_.buyer),false,ASSET_PROGRAM_1,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);
            let ataACCT = null;
            ataACCT = await connection.getAccountInfo(initializerMintATA).catch(function(error){});
            if(ataACCT==null){
              createInitializerMintATA = true;
              createInitializerMintATAIx = splToken.createAssociatedTokenAccountInstruction(new PublicKey(_data_.buyer),initializerMintATA,new PublicKey(_data_.buyer),initializerMint,ASSET_PROGRAM_1,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            }
            // ***************************************************************************
            let providerSwapMintATA = new PublicKey("11111111111111111111111111111111");
            let initializerSwapMintATA = new PublicKey("11111111111111111111111111111111");
            let ASSET_PROGRAM_2 = splToken.TOKEN_PROGRAM_ID;
            if(swapMint != "11111111111111111111111111111111") {  
                response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":swapMint}})});
                meta_data = await response.json();
                if(typeof meta_data.result.mint_extensions != "undefined"){
                    ASSET_PROGRAM_2 = splToken.TOKEN_2022_PROGRAM_ID;
                }
                providerSwapMintATA = await splToken.getAssociatedTokenAddress(new PublicKey(swapMint),new PublicKey(_data_.buyer),false,ASSET_PROGRAM_2,splToken.ASSOCIATED_TOKEN_PROGRAM_ID,);   
                initializerSwapMintATA = await splToken.getAssociatedTokenAddress(new PublicKey(swapMint),initializer,false,ASSET_PROGRAM_2,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            }
            const providerMintATA = await splToken.getAssociatedTokenAddress(initializerMint,new PublicKey(_data_.buyer),false,ASSET_PROGRAM_2,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            // ***************************************************************************
            let ASSET_PROGRAM_3 = splToken.TOKEN_PROGRAM_ID;
            let providerTokenATA = new PublicKey("11111111111111111111111111111111");
            let initializerTokenATA = new PublicKey("11111111111111111111111111111111");
            if(swapTokenMint != "11111111111111111111111111111111"){
                response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":swapTokenMint.toString()}})});
                meta_data = await response.json();
                if(typeof meta_data.result.mint_extensions != "undefined"){
                    ASSET_PROGRAM_3 = splToken.TOKEN_2022_PROGRAM_ID;
                }
                providerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,new PublicKey(_data_.buyer),false,ASSET_PROGRAM_3,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
                initializerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,initializer,false,ASSET_PROGRAM_3,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            }
            // ***************************************************************************
            const totalSize = 1 + 8;
            let uarray = new Uint8Array(totalSize);    
            let counter = 0;    
            uarray[counter++] = 1;   
            let byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
            for(let index = 0; index < byteArray.length; index ++ ){let byte = affiliateFee & 0xff;byteArray [ index ] = byte;affiliateFee = (affiliateFee - byte) / 256 ;}
            for (let i = 0; i < byteArray.length; i++) {uarray[counter++] = byteArray[i];}
            // ***************************************************************************
            const keys = [
              { pubkey: new PublicKey(_data_.buyer), isSigner: true, isWritable: true }, // 0
              { pubkey: initializer, isSigner: false, isWritable: true }, // 1
              { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 2
              { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 3
              { pubkey: swapVaultPDA[0], isSigner: false, isWritable: false }, // 4
              { pubkey: tempMintAccount, isSigner: false, isWritable: true }, // 5
              { pubkey: initializerMintATA, isSigner: false, isWritable: true }, // 6
              { pubkey: new PublicKey(mint), isSigner: false, isWritable: true }, // 7
              { pubkey: providerSwapMintATA, isSigner: false, isWritable: true }, // 8
              { pubkey: initializerSwapMintATA, isSigner: false, isWritable: true }, // 9
              { pubkey: new PublicKey(swapMint), isSigner: false, isWritable: true }, // 10
              { pubkey: providerTokenATA, isSigner: false, isWritable: true }, // 11
              { pubkey: initializerTokenATA, isSigner: false, isWritable: true }, // 12
              { pubkey: swapTokenMint, isSigner: false, isWritable: true }, // 13
              { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 14
              { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 15
              { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 16
              { pubkey: devTreasury, isSigner: false, isWritable: true }, // 17
              { pubkey: new PublicKey(affiliateWallet), isSigner: false, isWritable: true }, // 18
            ];
            // ***************************************************************************
            const swapNFTsIx = new TransactionInstruction({programId:NFTSwapProgramId,data:Buffer.from(uarray),keys:keys});
            const lookupTable = new PublicKey(this.NFT_STATIC_ALT);  
            const lookupTableAccount = await connection.getAddressLookupTable(lookupTable).then((res) => res.value);
            let instructions;
            if(createInitializerMintATA == true){instructions=[createInitializerMintATAIx,swapNFTsIx];} 
            else{instructions=[swapNFTsIx];}
            // ***************************************************************************
            const _tx_ = {};
            if(typeof _data_.tolerance!="undefined"){
                _tx_.tolerance = _data_.tolerance;              
            }
            if(typeof _data_.blink!="undefined"&&_data_.blink===true){
                _tx_.serialize = true;              
                _tx_.encode = true; 
                _tx_.compute = false;
                _tx_.fees = false;
            }
            else{
                _tx_.serialize = false;              
                _tx_.encode = false;
                _tx_.compute = true;
                _tx_.fees = true;
            }
            _tx_.rpc = _data_.rpc;                     
            _tx_.account = _data_.buyer;       
            _tx_.instructions = instructions;
            _tx_.table = lookupTableAccount;                   
            _tx_.priority = _data_.priority;
            _tx_.memo = _data_.memo;
            if(_data_.builder==false){
                return {"status":"ok","message":"builder disabled","ix":instructions,"table":lookupTableAccount};
            }
            else{
                return await this.tx(_tx_);
            }   
            // ***************************************************************************
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async nftReceived(_data_){
        try{
            const connection = new Connection(_data_.rpc,"confirmed");
            const NFT_ProgramId = new PublicKey(this.NFT_MCSWAP_PROGRAM);
            const _result_ = {}
            let NFT_RECEIVED = [];
            let accounts = null;
            accounts = await connection.getParsedProgramAccounts(NFT_ProgramId,{filters:[{dataSize:219,},{memcmp:{offset:106,bytes:_data_.wallet,},},],}).catch(function(){});
            if(accounts != null && accounts.length > 0){for(let i=0;i<accounts.length;i++){
                const account = accounts[i];
                const resultStatePDA = account.pubkey;
                let resultState = null;
                const record = {};
                resultState = await connection.getAccountInfo(resultStatePDA);
                if(resultState != null){
                    let decodedData = this.NFT_SWAP_STATE.decode(resultState.data);
                    const acct = account.pubkey.toString();
                    record.acct = acct;
                    const initializer = new PublicKey(decodedData.initializer).toString();
                    const initializer_mint = new PublicKey(decodedData.initializer_mint).toString();
                    const is_swap = new PublicKey(decodedData.is_swap).toString();
                    const utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
                    const temp_mint_account = new PublicKey(decodedData.temp_mint_account).toString();
                    let taker = new PublicKey(decodedData.taker).toString();
                    let swap_mint = new PublicKey(decodedData.swap_mint).toString();
                    let swap_lamports = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
                    let swap_token_mint = new PublicKey(decodedData.swap_token_mint).toString();
                    let swap_tokens = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
                    let physical = parseInt(new BN(decodedData.physical, 10, "le"));
                    if(taker=="11111111111111111111111111111111"){taker=false;}
                    if(swap_mint=="11111111111111111111111111111111"){swap_mint=false;}
                    if(swap_token_mint=="11111111111111111111111111111111"){swap_token_mint=false;}
                    if(swap_tokens>0){}else{swap_tokens=0;}
                    if(swap_lamports>0){}else{swap_lamports=0;}
                    record.utime = utime;
                    record.seller = initializer;
                    record.buyer = taker;
                    record.sellerMint = initializer_mint;
                    record.buyerMint = swap_mint;
                    record.lamports = swap_lamports;
                    record.tokenMint = swap_token_mint;
                    record.units = swap_tokens;
                    record.physical = physical;
                    if(typeof _data_.display!="undefined"&&_data_.display===true){
                        if(record.lamports>0){
                            const lamports = await this.convert({"rpc":_data_.rpc,"amount":record.lamports,"mint":"So11111111111111111111111111111111111111112","display":_data_.display});
                            record.lamports = lamports.data;
                        }
                        if(record.units>0){
                            const units = await this.convert({"rpc":_data_.rpc,"amount":record.units,"mint":record.tokenMint,"display":_data_.display});
                            record.units = units.data;
                        }
                    }
                    NFT_RECEIVED.push(record);
                }
                if(i==(accounts.length-1)){
                    _result_.status="ok";
                    _result_.message="success";
                    _result_.data=NFT_RECEIVED;
                    return _result_;
                }
            }}
            else{
                _result_.status="ok";
                _result_.message="no contracts found";
                _result_.data=NFT_RECEIVED;
                return _result_;
            }
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async nftSent(_data_){
        try{
            if(typeof _data_.private=="undefined"||_data_.private!=true){_data_.private=false;}
            const connection = new Connection(_data_.rpc,"confirmed");
            const NFT_ProgramId = new PublicKey(this.NFT_MCSWAP_PROGRAM);
            const _result_ = {}
            let NFT_SENT = [];
            let accounts = null;
            accounts = await connection.getParsedProgramAccounts(NFT_ProgramId,{filters:[{dataSize:219,},{memcmp:{offset:10,bytes:_data_.wallet,},},],}).catch(function(){});
            if(accounts != null && accounts.length > 0){for(let i=0;i<accounts.length;i++){
                const account = accounts[i];
                const resultStatePDA = account.pubkey;
                let resultState = null;
                const record = {};
                resultState = await connection.getAccountInfo(resultStatePDA);
                if(resultState != null){
                    let decodedData = this.NFT_SWAP_STATE.decode(resultState.data);
                    const acct = account.pubkey.toString();
                    record.acct = acct;
                    const initializer = new PublicKey(decodedData.initializer).toString();
                    const initializer_mint = new PublicKey(decodedData.initializer_mint).toString();
                    const is_swap = new PublicKey(decodedData.is_swap).toString();
                    const temp_mint_account = new PublicKey(decodedData.temp_mint_account).toString();
                    const utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
                    let taker = new PublicKey(decodedData.taker).toString();
                    let swap_mint = new PublicKey(decodedData.swap_mint).toString();
                    let swap_lamports = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
                    let swap_token_mint = new PublicKey(decodedData.swap_token_mint).toString();
                    let swap_tokens = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
                    let physical = parseInt(new BN(decodedData.physical, 10, "le"));
                    if(taker=="11111111111111111111111111111111"){taker=false;}
                    if(swap_mint=="11111111111111111111111111111111"){swap_mint=false;}
                    if(swap_token_mint=="11111111111111111111111111111111"){swap_token_mint=false;}
                    if(swap_tokens>0){}else{swap_tokens=0;}
                    if(swap_lamports>0){}else{swap_lamports=0;}
                    record.utime = utime;
                    record.seller = initializer;
                    record.buyer = taker;
                    record.sellerMint = initializer_mint;
                    record.buyerMint = swap_mint;
                    record.lamports = swap_lamports;
                    record.tokenMint = swap_token_mint;
                    record.units = swap_tokens;
                    record.physical = physical;
                    // if private
                    let pushit = false;
                    if(_data_.private === true){
                        if(record.buyer!=false){pushit=true;}
                    }
                    else{
                        if(record.buyer==false){pushit=true;}
                    }
                    if(pushit === true){
                        if(typeof _data_.display!="undefined"&&_data_.display===true){
                            if(record.lamports>0){
                                const lamports = await this.convert({"rpc":_data_.rpc,"amount":record.lamports,"mint":"So11111111111111111111111111111111111111112","display":_data_.display});
                                record.lamports = lamports.data;
                            }
                            if(record.units>0){
                                const units = await this.convert({"rpc":_data_.rpc,"amount":record.units,"mint":record.tokenMint,"display":_data_.display});
                                record.units = units.data;
                            }
                        }
                        NFT_SENT.push(record);
                    }
                }
                if(i==(accounts.length-1)){
                    _result_.status="ok";
                    _result_.message="success";
                    _result_.data=NFT_SENT;
                    return _result_;
                }
            }}
            else{
                _result_.status="ok";
                _result_.message="no contracts found";
                _result_.data=NFT_SENT;
                return _result_;
            }
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    // mcswap-pnft
    async pnftCreate(_data_){
        try{
            // ***************************************************************************
            if(typeof _data_.sellerEmail=="undefined"||_data_.sellerEmail==false){_data_.sellerEmail="";}
            if(typeof _data_.physical=="undefined"||_data_.physical==false){_data_.physical=0;}else{_data_.physical=parseInt(_data_.physical);}
            if(typeof _data_.builder!="undefined"&&_data_.builder==false){_data_.builder=false;}else{_data_.builder=true;}
            if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
            if(typeof _data_.signers=="undefined"||_data_.signers==false){_data_.signers=false;}
            let affiliateWallet = this.PNFT_TREASURY;
            let affiliateFee = 0;
            if(typeof _data_.affiliateWallet!="undefined" && _data_.affiliateWallet!=false && 
            typeof _data_.affiliateFee!="undefined" && _data_.affiliateFee!=false && _data_.affiliateFee>0){
                affiliateWallet = _data_.affiliateWallet;
                affiliateFee = _data_.affiliateFee;
            }
            if(typeof _data_.convert!="undefined"&&_data_.convert===true&&typeof _data_.affiliateFee!="undefined"&&_data_.affiliateFee!=false&&_data_.affiliateFee>0){
                let affiliate_ = await this.convert({"rpc":_data_.rpc,"amount":_data_.affiliateFee,"mint":"So11111111111111111111111111111111111111112"});
                affiliateFee = affiliate_.data;
                _data_.affiliateFee = affiliate_.data;
            }
            if(typeof _data_.convert!="undefined"&&_data_.convert===true&&typeof _data_.lamports!="undefined"&&_data_.lamports!=false&&_data_.lamports>0){
                let amount_a = await this.convert({"rpc":_data_.rpc,"amount":_data_.lamports,"mint":"So11111111111111111111111111111111111111112"});
                _data_.lamports = amount_a.data;
            }else{_data_.lamports=0;}
            if(typeof _data_.convert!="undefined"&&_data_.convert===true&&typeof _data_.units!="undefined"&&_data_.units!=false&&_data_.units>0){
                let amount_b = await this.convert({"rpc":_data_.rpc,"amount":_data_.units,"mint":_data_.tokenMint});
                _data_.units = amount_b.data;
            }else{_data_.units=0;}
            if(_data_.seller==_data_.buyer){
                const _error_ = {}
                _error_.status="error";
                _error_.message="buyer and seller can not be the same";
                return _error_;
            }
            if(typeof _data_.sellerMint=="undefined"||_data_.sellerMint==false||_data_.sellerMint==""){
                const _error_ = {}
                _error_.status="error";
                _error_.message="sellerMint not defined";
                return _error_;
            }
            // ***************************************************************************
            const connection = new Connection(_data_.rpc, "confirmed");
            const taker = "11111111111111111111111111111111";
            if(typeof _data_.buyer!="undefined"&&_data_.buyer!=false&&_data_.buyer!=""){buyer=new PublicKey(_data_.buyer);}else{_data_.buyer=taker;}
            let isSwap = true;
            const mint = _data_.sellerMint;
            let swapMint = "11111111111111111111111111111111";
            if(typeof _data_.buyerMint!="undefined"&&_data_.buyerMint!=false){swapMint=_data_.buyerMint;}else{isSwap=false;}
            let swapLamports = 0;
            if(typeof _data_.lamports!="undefined"&&_data_.lamports!=false&&_data_.lamports>0){swapLamports=parseInt(_data_.lamports);}
            let swapTokens = 0;
            let swapTokenMint = new PublicKey("11111111111111111111111111111111");
            if(typeof _data_.units!="undefined"&&_data_.units!=false&&_data_.units>0){swapTokens=parseInt(_data_.units);swapTokenMint=new PublicKey(_data_.tokenMint);}
            // ***************************************************************************
            const splATAProgramId = new PublicKey(this.PNFT_ATA_PROGRAM);
            const mplAuthRulesProgramId = new PublicKey(this.PNFT_RULES_PROGRAM);
            const mplAuthRulesAccount = new PublicKey(this.PNFT_RULES_ACCT);        
            const mplProgramid = new PublicKey(this.PNFT_METADATA_PROGRAM);
            const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")],new PublicKey(this.PNFT_MCSWAP_PROGRAM));
            const programState = await connection.getAccountInfo(programStatePDA[0]);
            const encodedProgramStateData = programState.data;
            const decodedProgramStateData = this.PNFT_PROGRAM_STATE.decode(encodedProgramStateData);
            const devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
            const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],new PublicKey(this.PNFT_MCSWAP_PROGRAM));
            const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(mint).toBytes(),new PublicKey(swapMint).toBytes()],new PublicKey(this.PNFT_MCSWAP_PROGRAM));
            const providerMintATA = await splToken.getAssociatedTokenAddress(new PublicKey(mint),new PublicKey(_data_.seller),false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            const tokenMetadataPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),new PublicKey(mint).toBytes()],mplProgramid);
            const tokenMasterEditionPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),new PublicKey(mint).toBytes(),Buffer.from("edition")],mplProgramid);
            const tokenDestinationATA = await splToken.getAssociatedTokenAddress(new PublicKey(mint),swapVaultPDA[0],true,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            const tokenRecordPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),new PublicKey(mint).toBytes(),Buffer.from("token_record"),new PublicKey(providerMintATA).toBytes()],mplProgramid);
            const tokenRecordDesinationPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),new PublicKey(mint).toBytes(),Buffer.from("token_record"),new PublicKey(tokenDestinationATA).toBytes()],mplProgramid);
            // ***************************************************************************
            let createSwapMintATA = false;
            let createSwapMintATAIx = null;        
            let swapMintATA = null;
            let takerMintInfo = null;        
            if(swapMint!="11111111111111111111111111111111"){
              swapMintATA = await splToken.getAssociatedTokenAddress(new PublicKey(swapMint),new PublicKey(_data_.seller),false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
              takerMintInfo = await connection.getAccountInfo(swapMintATA).catch(function(){});
              if(takerMintInfo==null){createSwapMintATA=true;createSwapMintATAIx=splToken.createAssociatedTokenAccountInstruction(new PublicKey(_data_.seller),swapMintATA,new PublicKey(_data_.seller),new PublicKey(swapMint),splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID)} 
              else{createSwapMintATA=false;}
            }        
            let PNFT_TOKEN_PROGRAM = splToken.TOKEN_PROGRAM_ID;
            let createSwapTokenATA = false;
            let createSwapTokenATAIx = null;
            let swapTokenATA = null;
            let swapTokenInfo = null;
            let response = null;
            if(swapTokenMint.toString()!="11111111111111111111111111111111"){
                response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":swapTokenMint.toString()}})});
                let getAsset = await response.json();
                if(typeof getAsset.result.mint_extensions!="undefined"){PNFT_TOKEN_PROGRAM=splToken.TOKEN_2022_PROGRAM_ID;}
                swapTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,new PublicKey(_data_.seller),false,PNFT_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
                swapTokenInfo = await connection.getAccountInfo(swapTokenATA).catch(function(){});        
                if(swapTokenInfo==null){createSwapTokenATA=true;createSwapTokenATAIx=splToken.createAssociatedTokenAccountInstruction(new PublicKey(_data_.seller),swapTokenATA,new PublicKey(_data_.seller),swapTokenMint,PNFT_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);}
                else{createSwapTokenATA=false;}
            }
            // ***************************************************************************
            const totalSize = 1 + 1 + 32 + 32 + 8 + 32 + 8 + 8 + 1;
            let uarray = new Uint8Array(totalSize);
            let counter = 0;    
            uarray[counter++] = 0;
            if(isSwap==true){uarray[counter++]=1;}else{uarray[counter++]=0;}
            let arr;
            let byteArray;
            const takerb58 = bs58.decode(_data_.buyer);
            arr = Array.prototype.slice.call(Buffer.from(takerb58),0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            const takerMintb58 = bs58.decode(swapMint);
            arr = Array.prototype.slice.call(Buffer.from(takerMintb58),0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            byteArray=[0,0,0,0,0,0,0,0];
            for(let index=0;index<byteArray.length;index++) {
                let byte = swapLamports & 0xff;
                byteArray [index] = byte;
                swapLamports=(swapLamports-byte)/256;
            }
            for(let i=0;i<byteArray.length;i++){uarray[counter++]=byteArray[i];}
            const swapTokenMintb58 = bs58.decode(swapTokenMint.toString());
            arr=Array.prototype.slice.call(Buffer.from(swapTokenMintb58),0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            byteArray=[0,0,0,0,0,0,0,0];
            for(let index=0;index<byteArray.length;index++){
                let byte = swapTokens & 0xff;
                byteArray [index] = byte;
                swapTokens=(swapTokens-byte)/256;
            }
            for(let i=0;i<byteArray.length;i++){uarray[counter++]=byteArray[i];}
            byteArray = [0,0,0,0,0,0,0,0];
            for(let index = 0; index < byteArray.length; index ++ ){let byte = affiliateFee & 0xff;byteArray [ index ] = byte;affiliateFee = (affiliateFee - byte) / 256 ;}
            for(let i = 0; i < byteArray.length; i++){uarray[counter++] = byteArray[i];}
            uarray[counter++] = _data_.physical;
            // ***************************************************************************
            const keys = [
                { pubkey: new PublicKey(_data_.seller), isSigner: true, isWritable: true }, // 0
                { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 1
                { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 2
                { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 3
                { pubkey: providerMintATA, isSigner: false, isWritable: true }, // 4
                { pubkey: new PublicKey(mint), isSigner: false, isWritable: false }, // 5
                { pubkey: tokenMetadataPDA[0], isSigner: false, isWritable: true }, // 6
                { pubkey: tokenMasterEditionPDA[0], isSigner: false, isWritable: false }, // 7
                { pubkey: tokenDestinationATA, isSigner: false, isWritable: true }, // 8
                { pubkey: tokenRecordPDA[0], isSigner: false, isWritable: true }, // 9
                { pubkey: tokenRecordDesinationPDA[0], isSigner: false, isWritable: true }, // 10
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 11
                { pubkey: SYSVAR_INSTRUCTIONS_PUBKEY, isSigner: false, isWritable: false }, // 12
                { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 13
                { pubkey: splATAProgramId, isSigner: false, isWritable: false }, // 14
                { pubkey: mplProgramid, isSigner: false, isWritable: false }, // 15
                { pubkey: mplAuthRulesProgramId, isSigner: false, isWritable: false }, // 16
                { pubkey: mplAuthRulesAccount, isSigner: false, isWritable: false }, // 17
                { pubkey: devTreasury, isSigner: false, isWritable: true }, // 18
                { pubkey: new PublicKey(affiliateWallet), isSigner: false, isWritable: true }, // 19
            ];
            // ***************************************************************************
            const initializeSwapIx = new TransactionInstruction({programId: new PublicKey(this.PNFT_MCSWAP_PROGRAM),data:Buffer.from(uarray),keys: keys});
            let instructions = null;
            if(createSwapMintATA===true&&createSwapTokenATA===true){instructions=[createSwapMintATAIx,createSwapTokenATAIx,initializeSwapIx];} 
            else if(createSwapMintATA===true){instructions=[createSwapMintATAIx,initializeSwapIx];} 
            else if ( createSwapTokenATA === true) {instructions=[createSwapTokenATAIx,initializeSwapIx];} 
            else {instructions=[initializeSwapIx];}
            // ***************************************************************************
            const _tx_ = {};
            if(typeof _data_.tolerance!="undefined"){
                _tx_.tolerance = _data_.tolerance;              
            }
            if(typeof _data_.blink!="undefined"&&_data_.blink===true){
                _tx_.serialize = true;              
                _tx_.encode = true; 
                _tx_.compute = false;
                _tx_.fees = false;
            }
            else{
                _tx_.serialize = false;              
                _tx_.encode = false;
                _tx_.compute = true;
                _tx_.fees = true;
            }
            _tx_.rpc = _data_.rpc;                     
            _tx_.account = _data_.seller;       
            _tx_.instructions = instructions;
            _tx_.signers = false;
            _tx_.table = false;               
            _tx_.priority = _data_.priority;
            if(_data_.sellerEmail!=""){_tx_.memo = _data_.sellerEmail;}
            if(_data_.builder==false){
                return {"status":"ok","message":"builder disabled","ix":instructions,"table":false};
            }
            else{
                return await this.tx(_tx_);
            }   
            // ***************************************************************************
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async pnftCancel(_data_){
        try{
            // ***************************************************************************
            if(typeof _data_.builder!="undefined"&&_data_.builder==false){_data_.builder=false;}else{_data_.builder=true;}
            if(typeof _data_.priority=="undefined"||_data_.priority==false){_data_.priority=this.PRIORITY;}
            if(typeof _data_.buyerMint=="undefined"||_data_.buyerMint==false||_data_.buyerMint==""){_data_.buyerMint="11111111111111111111111111111111";}
            if(typeof _data_.sellerMint=="undefined"||_data_.sellerMint==false||_data_.sellerMint==""){
                const _error_ = {}
                _error_.status="error";
                _error_.message="buyerMint not defined";
                return _error_;
            }
            // ***************************************************************************
            const connection = new Connection(_data_.rpc, "confirmed");
            let swapMint = "11111111111111111111111111111111";
            if (typeof _data_.buyerMint!="undefined"){swapMint=_data_.buyerMint;}
            const mint = _data_.sellerMint;
            const splATAProgramId = new PublicKey(this.PNFT_ATA_PROGRAM);
            const mplAuthRulesProgramId = new PublicKey(this.PNFT_RULES_PROGRAM);
            const mplAuthRulesAccount = new PublicKey(this.PNFT_RULES_ACCT);
            const mplProgramid = new PublicKey(this.PNFT_METADATA_PROGRAM);
            const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],new PublicKey(this.PNFT_MCSWAP_PROGRAM));
            const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(mint).toBytes(),new PublicKey(swapMint).toBytes()],new PublicKey(this.PNFT_MCSWAP_PROGRAM));
            const swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(error){});
            const encodedSwapStateData = swapState.data;
            const decodedSwapStateData = this.PNFT_SWAP_STATE.decode(encodedSwapStateData);
            _data_.seller = new PublicKey(decodedSwapStateData.initializer).toString();
            const vaultMintATA = await splToken.getAssociatedTokenAddress(new PublicKey(mint),swapVaultPDA[0],true,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            const tokenMetadataPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),new PublicKey(mint).toBytes()],mplProgramid);
            const tokenMasterEditionPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),new PublicKey(mint).toBytes(),Buffer.from("edition")],mplProgramid);
            const tokenDestinationATA = await splToken.getAssociatedTokenAddress(new PublicKey(mint),new PublicKey(_data_.seller),false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            const tokenRecordPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),new PublicKey(mplProgramid).toBytes(),new PublicKey(mint).toBytes(),Buffer.from("token_record"),new PublicKey(vaultMintATA).toBytes()],mplProgramid);
            const tokenRecordDesinationPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),new PublicKey(mplProgramid).toBytes(),new PublicKey(mint).toBytes(),Buffer.from("token_record"),new PublicKey(tokenDestinationATA).toBytes()],mplProgramid,);
            const totalSize = 1 + 32;
            let uarray = new Uint8Array(totalSize);    
            let counter = 0;    
            uarray[counter++] = 2; // 2 = ReverseSwap Instruction
            const swapMintb58 = bs58.decode(swapMint);
            const arr = Array.prototype.slice.call(Buffer.from(swapMintb58),0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            const reverseSwapIx = new TransactionInstruction({programId:new PublicKey(this.PNFT_MCSWAP_PROGRAM),data: Buffer.from(uarray),
                keys: [
                    { pubkey: new PublicKey(_data_.seller), isSigner: true, isWritable: true }, // 0
                    { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 1
                    { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 2
                    { pubkey: vaultMintATA, isSigner: false, isWritable: true }, // 3
                    { pubkey: new PublicKey(mint), isSigner: false, isWritable: false }, // 4
                    { pubkey: tokenMetadataPDA[0], isSigner: false, isWritable: true }, // 5
                    { pubkey: tokenMasterEditionPDA[0], isSigner: false, isWritable: false }, // 6
                    { pubkey: tokenDestinationATA, isSigner: false, isWritable: true }, // 7
                    { pubkey: tokenRecordPDA[0], isSigner: false, isWritable: true }, // 8
                    { pubkey: tokenRecordDesinationPDA[0], isSigner: false, isWritable: true }, // 9
                    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 10
                    { pubkey: SYSVAR_INSTRUCTIONS_PUBKEY, isSigner: false, isWritable: false }, // 11
                    { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 12
                    { pubkey: splATAProgramId, isSigner: false, isWritable: false }, // 13
                    { pubkey: new PublicKey(mplProgramid), isSigner: false, isWritable: false }, // 14
                    { pubkey: mplAuthRulesProgramId, isSigner: false, isWritable: false }, // 15
                    { pubkey: mplAuthRulesAccount, isSigner: false, isWritable: false }, // 16
                ]
            });
            const instructions = [reverseSwapIx];
            // ***************************************************************************
            const _tx_ = {};
            if(typeof _data_.tolerance!="undefined"){
                _tx_.tolerance = _data_.tolerance;              
            }
            if(typeof _data_.blink!="undefined"&&_data_.blink===true){
                _tx_.serialize = true;              
                _tx_.encode = true; 
                _tx_.compute = false;
                _tx_.fees = false;
            }
            else{
                _tx_.serialize = false;              
                _tx_.encode = false;
                _tx_.compute = true;
                _tx_.fees = true;
            }
            _tx_.rpc = _data_.rpc;                     
            _tx_.account = _data_.seller;       
            _tx_.instructions = instructions;
            _tx_.signers = _data_.signers;
            _tx_.table = false;  
            _tx_.priority = _data_.priority;
            if(_data_.builder==false){
                return {"status":"ok","message":"builder disabled","ix":instructions,"table":false};
            }
            else{
                return await this.tx(_tx_);
            }   
            // ***************************************************************************
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async pnftExecute(_data_){
        try{
            // ***************************************************************************
            if(typeof _data_.memo=="undefined"){_data_.memo=false;}
            if(typeof _data_.builder!="undefined"&&_data_.builder==false){_data_.builder=false;}else{_data_.builder=true;}
            if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
            if(typeof _data_.signers=="undefined"||_data_.signers==false){_data_.signers=false;}
            let affiliateWallet = this.PNFT_TREASURY;
            let affiliateFee = 0;
            if(typeof _data_.affiliateWallet!="undefined" && _data_.affiliateWallet!=false && 
            typeof _data_.affiliateFee!="undefined" && _data_.affiliateFee!=false && _data_.affiliateFee>0){
                affiliateWallet = _data_.affiliateWallet;
                affiliateFee = _data_.affiliateFee;
            }
            if(typeof _data_.convert!="undefined"&&_data_.convert===true&&typeof _data_.affiliateFee!="undefined"&&_data_.affiliateFee!=false&&_data_.affiliateFee>0){
                let affiliate_ = await this.convert({"rpc":_data_.rpc,"amount":_data_.affiliateFee,"mint":"So11111111111111111111111111111111111111112"});
                affiliateFee = affiliate_.data;
                _data_.affiliateFee = affiliate_.data;
            }
            if(typeof _data_.buyerMint=="undefined"||_data_.buyerMint==false){_data_.buyerMint="11111111111111111111111111111111";}
            // ***************************************************************************
            const connection = new Connection(_data_.rpc,"confirmed");
            const sellerMint = _data_.sellerMint;
            let buyerMint = "11111111111111111111111111111111";
            if(typeof _data_.buyerMint!="undefined"){buyerMint=_data_.buyerMint;}
            const splATAProgramId = new PublicKey(this.PNFT_ATA_PROGRAM);
            const mplAuthRulesProgramId = new PublicKey(this.PNFT_RULES_PROGRAM);
            const mplAuthRulesAccount = new PublicKey(this.PNFT_RULES_ACCT);
            const mplProgramid = new PublicKey(this.PNFT_METADATA_PROGRAM);
            const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")],new PublicKey(this.PNFT_MCSWAP_PROGRAM));
            const programState = await connection.getAccountInfo(programStatePDA[0]).catch(function(error){}); 
            const encodedProgramStateData = programState.data;
            const decodedProgramStateData = this.PNFT_PROGRAM_STATE.decode(encodedProgramStateData);
            const devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
            const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],new PublicKey(this.PNFT_MCSWAP_PROGRAM));
            const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(sellerMint).toBytes(),new PublicKey(buyerMint).toBytes()],new PublicKey(this.PNFT_MCSWAP_PROGRAM));
            const swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(error){});        
            const encodedSwapStateData = swapState.data;
            const decodedSwapStateData = this.PNFT_SWAP_STATE.decode(encodedSwapStateData);
            const initializer = new PublicKey(decodedSwapStateData.initializer);
            const initializerTokenMint = new PublicKey(decodedSwapStateData.initializer_mint);
            const takerTokenMint = new PublicKey(decodedSwapStateData.swap_mint);
            const swapTokenMint = new PublicKey(decodedSwapStateData.swap_token_mint);
            const vaultTokenMintATA = await splToken.getAssociatedTokenAddress(initializerTokenMint,swapVaultPDA[0],true,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            const tokenMetadataPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),initializerTokenMint.toBytes()],mplProgramid);
            const tokenMasterEditionPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),initializerTokenMint.toBytes(),Buffer.from("edition")],mplProgramid);
            const tokenDestinationATA = await splToken.getAssociatedTokenAddress(initializerTokenMint,new PublicKey(_data_.buyer),false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            let createTokenDestinationATA = false;
            let createTokenDestinationATAIx = null;
            const DestinationResp=await connection.getAccountInfo(tokenDestinationATA)
            if(DestinationResp==null){createTokenDestinationATA=true;createTokenDestinationATAIx=splToken.createAssociatedTokenAccountInstruction(new PublicKey(_data_.buyer),tokenDestinationATA,new PublicKey(_data_.buyer),initializerTokenMint,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);}
            else{createTokenDestinationATA=false;}
            const tokenRecordPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),initializerTokenMint.toBytes(),Buffer.from("token_record"),vaultTokenMintATA.toBytes()],mplProgramid);
            const tokenRecordDesinationPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),initializerTokenMint.toBytes(),Buffer.from("token_record"),tokenDestinationATA.toBytes()],mplProgramid);
            const takerTokenMintATA = await splToken.getAssociatedTokenAddress(takerTokenMint,new PublicKey(_data_.buyer),false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            const takerTokenMetadataPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),takerTokenMint.toBytes()],mplProgramid);
            const takerTokenMasterEditionPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),takerTokenMint.toBytes(),Buffer.from("edition")],mplProgramid);
            const takerTokenDestinationATA = await splToken.getAssociatedTokenAddress(takerTokenMint,initializer,false,splToken.TOKEN_PROGRAM_ID,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            const takerTokenRecordPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),takerTokenMint.toBytes(),Buffer.from("token_record"),takerTokenMintATA.toBytes()],mplProgramid,);
            const takerTokenRecordDesinationPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"),mplProgramid.toBytes(),takerTokenMint.toBytes(),Buffer.from("token_record"),takerTokenDestinationATA.toBytes()],mplProgramid);
            let PNFT_TOKEN_PROGRAM = splToken.TOKEN_PROGRAM_ID;
            let response;
            if(swapTokenMint.toString()!="11111111111111111111111111111111"){  
                response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":swapTokenMint.toString()}})});
                let getAsset = await response.json();
                if(typeof getAsset.result.mint_extensions!="undefined"){PNFT_TOKEN_PROGRAM=splToken.TOKEN_2022_PROGRAM_ID;}
            }
            const swapTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,new PublicKey(_data_.buyer),false,PNFT_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            const initializerSwapTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,initializer,false,PNFT_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            // ***************************************************************************
            const totalSize = 1 + 8;
            let uarray = new Uint8Array(totalSize);    
            let counter = 0;    
            uarray[counter++] = 1; // 1 = SwapNFTs Instruction
            var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
            for (let index = 0; index < byteArray.length; index ++ ) {let byte = affiliateFee & 0xff;byteArray [ index ] = byte;affiliateFee = (affiliateFee - byte) / 256 ;}
            for (let i = 0; i < byteArray.length; i++) {uarray[counter++] = byteArray[i];}
            // ***************************************************************************
            const keys = [
                { pubkey: new PublicKey(_data_.buyer), isSigner: true, isWritable: true }, // 0
                { pubkey: initializer, isSigner: false, isWritable: true }, // 1
                { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 2
                { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 3
                { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 4
                { pubkey: vaultTokenMintATA, isSigner: false, isWritable: true }, // 5
                { pubkey: initializerTokenMint, isSigner: false, isWritable: false }, // 6
                { pubkey: tokenMetadataPDA[0], isSigner: false, isWritable: true }, // 7
                { pubkey: tokenMasterEditionPDA[0], isSigner: false, isWritable: false }, // 8
                { pubkey: tokenDestinationATA, isSigner: false, isWritable: true }, // 9
                { pubkey: tokenRecordPDA[0], isSigner: false, isWritable: true }, // 10
                { pubkey: tokenRecordDesinationPDA[0], isSigner: false, isWritable: true }, // 11
                { pubkey: takerTokenMintATA, isSigner: false, isWritable: true }, // 12
                { pubkey: takerTokenMint, isSigner: false, isWritable: false }, // 13
                { pubkey: takerTokenMetadataPDA[0], isSigner: false, isWritable: true }, // 14
                { pubkey: takerTokenMasterEditionPDA[0], isSigner: false, isWritable: false }, // 15
                { pubkey: takerTokenDestinationATA, isSigner: false, isWritable: true }, // 16
                { pubkey: takerTokenRecordPDA[0], isSigner: false, isWritable: true }, // 17
                { pubkey: takerTokenRecordDesinationPDA[0], isSigner: false, isWritable: true }, // 18
                { pubkey: swapTokenATA, isSigner: false, isWritable: true }, // 19
                { pubkey: swapTokenMint, isSigner: false, isWritable: true }, // 20
                { pubkey: initializerSwapTokenATA, isSigner: false, isWritable: true }, // 21            
                { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 21
                { pubkey: SYSVAR_INSTRUCTIONS_PUBKEY, isSigner: false, isWritable: false }, // 23
                { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 24
                { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 25
                { pubkey: splATAProgramId, isSigner: false, isWritable: false }, // 26
                { pubkey: mplProgramid, isSigner: false, isWritable: false }, // 27
                { pubkey: mplAuthRulesProgramId, isSigner: false, isWritable: false }, // 28
                { pubkey: mplAuthRulesAccount, isSigner: false, isWritable: false }, // 29
                { pubkey: devTreasury, isSigner: false, isWritable: true }, // 30
                { pubkey: new PublicKey(affiliateWallet), isSigner: false, isWritable: true }, // 31
            ];
            // ***************************************************************************
            const swapPNFTsIx = new TransactionInstruction({programId:new PublicKey(this.PNFT_MCSWAP_PROGRAM),data:Buffer.from(uarray),keys:keys});
            const lookupTable = new PublicKey(this.PNFT_STATIC_ALT);
            const lookupTableAccount = await connection.getAddressLookupTable(lookupTable).then((res)=>res.value);
            let instructions = null;
            if(createTokenDestinationATA==true){instructions=[createTokenDestinationATAIx,swapPNFTsIx];}else{instructions=[swapPNFTsIx];}
            // ***************************************************************************
            const _tx_ = {};
            if(typeof _data_.tolerance!="undefined"){
                _tx_.tolerance = _data_.tolerance;              
            }
            if(typeof _data_.blink!="undefined"&&_data_.blink===true){
                _tx_.serialize = true;              
                _tx_.encode = true; 
                _tx_.compute = false;
                _tx_.fees = false;
            }
            else{
                _tx_.serialize = false;              
                _tx_.encode = false;
                _tx_.compute = true;
                _tx_.fees = true;
            }
            _tx_.rpc = _data_.rpc;                     
            _tx_.account = _data_.buyer;       
            _tx_.instructions = instructions;
            _tx_.table = lookupTableAccount;                   
            _tx_.priority = _data_.priority;
            _tx_.memo = _data_.memo;
            if(_data_.builder==false){
                return {"status":"ok","message":"builder disabled","ix":instructions,"table":lookupTableAccount};
            }
            else{
                return await this.tx(_tx_);
            }   
            // ***************************************************************************
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async pnftReceived(_data_){
        try{
            const connection = new Connection(_data_.rpc,"confirmed");
            const PNFT_ProgramId = new PublicKey(this.PNFT_MCSWAP_PROGRAM);
            const _result_ = {}
            let PNFT_RECEIVED = [];
            let accounts = null;
            accounts = await connection.getParsedProgramAccounts(PNFT_ProgramId,{filters:[{dataSize:187,},{memcmp:{offset:74,bytes:_data_.wallet,},},],}).catch(function(){});
            if(accounts != null){for(let i=0;i<accounts.length;i++){
                const account = accounts[i];
                const resultStatePDA = account.pubkey;
                let resultState = null;
                const record = {};
                resultState = await connection.getAccountInfo(resultStatePDA);
                if(resultState != null){
                    let decodedData = this.PNFT_SWAP_STATE.decode(resultState.data);
                    const acct = account.pubkey.toString();
                    record.acct = acct;
                    const initializer = new PublicKey(decodedData.initializer).toString();
                    const initializer_mint = new PublicKey(decodedData.initializer_mint).toString();
                    const is_swap = new PublicKey(decodedData.is_swap).toString();
                    const utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
                    let taker = new PublicKey(decodedData.taker).toString();
                    let swap_mint = new PublicKey(decodedData.swap_mint).toString();
                    let swap_lamports = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
                    let swap_token_mint = new PublicKey(decodedData.swap_token_mint).toString();
                    let swap_tokens = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
                    let physical = parseInt(new BN(decodedData.physical, 10, "le"));
                    if(taker=="11111111111111111111111111111111"){taker=false;}
                    if(swap_mint=="11111111111111111111111111111111"){swap_mint=false;}
                    if(swap_token_mint=="11111111111111111111111111111111"){swap_token_mint=false;}
                    if(swap_tokens>0){}else{swap_tokens=0;}
                    if(swap_lamports>0){}else{swap_lamports=0;}
                    record.utime = utime;
                    record.seller = initializer;
                    record.buyer = taker;
                    record.sellerMint = initializer_mint;
                    record.buyerMint = swap_mint;
                    record.lamports = swap_lamports;
                    record.tokenMint = swap_token_mint;
                    record.units = swap_tokens;
                    record.physical = physical;
                    if(typeof _data_.display!="undefined"&&_data_.display===true){
                        if(record.lamports>0){
                            const lamports = await this.convert({"rpc":_data_.rpc,"amount":record.lamports,"mint":"So11111111111111111111111111111111111111112","display":_data_.display});
                            record.lamports = lamports.data;
                        }
                        if(record.units>0){
                            const units = await this.convert({"rpc":_data_.rpc,"amount":record.units,"mint":record.tokenMint,"display":_data_.display});
                            record.units = units.data;
                        }
                    }
                    PNFT_RECEIVED.push(record);
                }
                if(i==(accounts.length-1)){
                    _result_.status="ok";
                    _result_.message="success";
                    _result_.data=PNFT_RECEIVED;
                    return _result_;
                }
            }}
            else{
                _result_.status="ok";
                _result_.message="no contracts found";
                _result_.data=PNFT_RECEIVED;
                return _result_;
            }
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async pnftSent(_data_){
        try{
            if(typeof _data_.private=="undefined"||_data_.private!=true){_data_.private=false;}
            const connection = new Connection(_data_.rpc,"confirmed");
            const PNFT_ProgramId = new PublicKey(this.PNFT_MCSWAP_PROGRAM);
            const _result_ = {}
            let PNFT_SENT = [];
            let accounts = null;
            accounts = await connection.getParsedProgramAccounts(PNFT_ProgramId,{filters:[{dataSize:187,},{memcmp:{offset:10,bytes:_data_.wallet,},},],}).catch(function(){});
            if(accounts != null){for(let i=0;i<accounts.length;i++){
                const account = accounts[i];
                const resultStatePDA = account.pubkey;
                let resultState = null;
                const record = {};
                resultState = await connection.getAccountInfo(resultStatePDA);
                if(resultState != null){
                    let decodedData = this.PNFT_SWAP_STATE.decode(resultState.data);
                    const acct = account.pubkey.toString();
                    record.acct = acct;
                    const initializer = new PublicKey(decodedData.initializer).toString();
                    const initializer_mint = new PublicKey(decodedData.initializer_mint).toString();
                    const is_swap = new PublicKey(decodedData.is_swap).toString();
                    const utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
                    let taker = new PublicKey(decodedData.taker).toString();
                    let swap_mint = new PublicKey(decodedData.swap_mint).toString();
                    let swap_lamports = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
                    let swap_token_mint = new PublicKey(decodedData.swap_token_mint).toString();
                    let swap_tokens = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
                    let physical = parseInt(new BN(decodedData.physical, 10, "le"));
                    if(taker=="11111111111111111111111111111111"){taker=false;}
                    if(swap_mint=="11111111111111111111111111111111"){swap_mint=false;}
                    if(swap_token_mint=="11111111111111111111111111111111"){swap_token_mint=false;}
                    if(swap_tokens>0){}else{swap_tokens=0;}
                    if(swap_lamports>0){}else{swap_lamports=0;}
                    record.utime = utime;
                    record.seller = initializer;
                    record.buyer = taker;
                    record.sellerMint = initializer_mint;
                    record.buyerMint = swap_mint;
                    record.lamports = swap_lamports;
                    record.tokenMint = swap_token_mint;
                    record.units = swap_tokens;
                    record.physical = physical;
                    // if private
                    let pushit = false;
                    if(_data_.private === true){
                        if(record.buyer!=false){pushit=true;}
                    }
                    else{
                        if(record.buyer==false){pushit=true;}
                    }
                    if(pushit === true){
                        if(typeof _data_.display!="undefined"&&_data_.display===true){
                            if(record.lamports>0){
                                const lamports = await this.convert({"rpc":_data_.rpc,"amount":record.lamports,"mint":"So11111111111111111111111111111111111111112","display":_data_.display});
                                record.lamports = lamports.data;
                            }
                            if(record.units>0){
                                const units = await this.convert({"rpc":_data_.rpc,"amount":record.units,"mint":record.tokenMint,"display":_data_.display});
                                record.units = units.data;
                            }
                        }
                        PNFT_SENT.push(record);
                    }
                }
                if(i==(accounts.length-1)){
                    _result_.status="ok";
                    _result_.message="success";
                    _result_.data=PNFT_SENT;
                    return _result_;
                }
            }}
            else{
                _result_.status="ok";
                _result_.message="no contracts found";
                _result_.data=PNFT_SENT;
                return _result_;
            }
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    // mcswap-cnft
    async cnftCreate(_data_){
        try{
            const max_proofs = 18;
            // ***************************************************************************
            if(typeof _data_.sellerEmail=="undefined"||_data_.sellerEmail==false){_data_.sellerEmail="";}
            if(typeof _data_.physical=="undefined"||_data_.physical==false){_data_.physical=0;}else{_data_.physical=parseInt(_data_.physical);}
            if(typeof _data_.builder!="undefined"&&_data_.builder==false){_data_.builder=false;}else{_data_.builder=true;}
            if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
            if(typeof _data_.signers=="undefined"||_data_.signers==false){_data_.signers=false;}
            let affiliateWallet = this.CNFT_TREASURY;
            let affiliateFee = 0;
            if(typeof _data_.affiliateWallet!="undefined" && _data_.affiliateWallet!=false && 
            typeof _data_.affiliateFee!="undefined" && _data_.affiliateFee!=false && _data_.affiliateFee>0){
                affiliateWallet = _data_.affiliateWallet;
                affiliateFee = _data_.affiliateFee;
            }
            if(typeof _data_.convert!="undefined"&&_data_.convert===true&&typeof _data_.affiliateFee!="undefined"&&_data_.affiliateFee!=false&&_data_.affiliateFee>0){
                let affiliate_ = await this.convert({"rpc":_data_.rpc,"amount":_data_.affiliateFee,"mint":"So11111111111111111111111111111111111111112"});
                affiliateFee = affiliate_.data;
                _data_.affiliateFee = affiliate_.data;
            }
            if(typeof _data_.convert!="undefined"&&_data_.convert===true&&typeof _data_.lamports!="undefined"&&_data_.lamports!=false&&_data_.lamports>0){
                let amount_a = await this.convert({"rpc":_data_.rpc,"amount":_data_.lamports,"mint":"So11111111111111111111111111111111111111112"});
                _data_.lamports = amount_a.data;
            }else{_data_.lamports=0;}
            if(typeof _data_.convert!="undefined"&&_data_.convert===true&&typeof _data_.units!="undefined"&&_data_.units!=false&&_data_.units>0){
                let amount_b = await this.convert({"rpc":_data_.rpc,"amount":_data_.units,"mint":_data_.tokenMint});
                _data_.units = amount_b.data;
            }else{_data_.units=0;}
            if(_data_.seller==_data_.buyer){
                const _error_ = {}
                _error_.status="error";
                _error_.message="buyer and seller can not be the same";
                return _error_;
            }
            if(typeof _data_.sellerMint=="undefined"||_data_.sellerMint==false||_data_.sellerMint==""){
                const _error_ = {}
                _error_.status="error";
                _error_.message="sellerMint not defined";
                return _error_;
            }
            // ***************************************************************************
            const connection = new Connection(_data_.rpc, "confirmed");
            let assetId = _data_.sellerMint;
            let swapAssetId = "11111111111111111111111111111111";
            if(typeof _data_.buyerMint!="undefined"&&_data_.buyerMint!=false){swapAssetId=_data_.buyerMint;}
            let swapLamports = 0;
            if(typeof _data_.lamports!="undefined"&&_data_.lamports!=false&&_data_.lamports>0){swapLamports=_data_.lamports;}
            let swapTokens = 0;
            let swapTokenMint = new PublicKey("11111111111111111111111111111111");
            if(typeof _data_.tokenMint!="undefined"&&_data_.tokenMint!=false){swapTokenMint=new PublicKey(_data_.tokenMint);swapTokens=_data_.units;}
            let isSwap=true;
            if(swapAssetId=="11111111111111111111111111111111"){isSwap=false;}
            const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")],new PublicKey(this.CNFT_MCSWAP_PROGRAM));
            const programState = await connection.getAccountInfo(programStatePDA[0]);  
            const encodedProgramStateData = programState.data;
            const decodedProgramStateData = this.CNFT_PROGRAM_STATE.decode(encodedProgramStateData);
            const devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
            const delegate = new PublicKey(_data_.seller);
            // ***************************************************************************
            let response;
            let getAsset;
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":assetId}})});
            getAsset = await response.json();
            let leafId = getAsset.result.compression.leaf_id;
            
            let getAssetProof;
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAssetProof","params":{"id":assetId}})});
            getAssetProof = await response.json();
            let treeAccount = await solanaAccountCompression.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,new PublicKey(getAssetProof.result.tree_id));  
            let treeAuthorityPDA = treeAccount.getAuthority();
            let canopyDepth = treeAccount.getCanopyDepth();
            let proof = [];
            proof = getAssetProof.result.proof.slice(0,getAssetProof.result.proof.length-(!!canopyDepth ? canopyDepth:0)).map((node)=>({pubkey:new PublicKey(node),isWritable:false,isSigner:false,}));
            
            let swapAssetOwner = "11111111111111111111111111111111";
            let swapDelegate = "11111111111111111111111111111111";
            let swapDatahash = "11111111111111111111111111111111";
            let swapCreatorhash = "11111111111111111111111111111111";
            let swapLeafId = 0;
            let swapTreeId  = "11111111111111111111111111111111";
            let swapRoot  = "11111111111111111111111111111111";
            let swapProof = []; 
            let getSwapAsset;
            let getSwapAssetProof;
            // ***************************************************************************
            if (isSwap === true) {
                response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":swapAssetId}})});
                getSwapAsset = await response.json();
                if(typeof _data_.buyer!="undefined"&&_data_.buyer!=false){
                    swapAssetOwner = getSwapAsset.result.ownership.owner;
                    if(getSwapAsset.result.ownership.delegated==true){swapDelegate=getSwapAsset.result.ownership.delegate;}
                }
                swapDatahash = getSwapAsset.result.compression.data_hash;
                swapCreatorhash = getSwapAsset.result.compression.creator_hash;
                swapLeafId = getSwapAsset.result.compression.leaf_id;
                response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAssetProof","params":{"id":swapAssetId}})});
                getSwapAssetProof = await response.json();
                swapTreeId =  getSwapAssetProof.result.tree_id;
                let swapProofTotal = getSwapAssetProof.result.proof;
                swapRoot = getSwapAssetProof.result.root;
                const swapTreeAccount = await solanaAccountCompression.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,new PublicKey(getSwapAssetProof.result.tree_id));
                const swapCanopyDepth = swapTreeAccount.getCanopyDepth();
                swapProof = getSwapAssetProof.result.proof.slice(0,getSwapAssetProof.result.proof.length-(!!swapCanopyDepth ? swapCanopyDepth:0)).map((node)=>({pubkey: new PublicKey(node),isWritable:false,isSigner:false,}));
            }
            if((proof.length+swapProof.length)>max_proofs){
                const _error_ = {}
                _error_.status="error";
                _error_.message="combined proofs ("+(proof.length+swapProof.length)+") can not excede ("+max_proofs+")";
                return _error_;
            }
            else{
                const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],new PublicKey(this.CNFT_MCSWAP_PROGRAM));
                const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(assetId).toBytes(),new PublicKey(swapAssetId).toBytes()],new PublicKey(this.CNFT_MCSWAP_PROGRAM));        
                let tokenATA = null;
                let createTokenATA = null;
                let createTokenATAIx = null;
                let CNFT_TOKEN_PROGRAM = splToken.TOKEN_PROGRAM_ID;
                if(swapTokenMint.toString()!="11111111111111111111111111111111"){
                    response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":swapTokenMint.toString()}})});
                    let getToken = await response.json();
                    if(typeof getToken.result.mint_extensions!="undefined"){CNFT_TOKEN_PROGRAM=splToken.TOKEN_2022_PROGRAM_ID;}
                    tokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,new PublicKey(_data_.seller),false,CNFT_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
                    response = null;
                    response = await connection.getAccountInfo(tokenATA);
                    if(response==null){
                        createTokenATA = true;
                        createTokenATAIx = splToken.createAssociatedTokenAccountInstruction(new PublicKey(_data_.seller),tokenATA,new PublicKey(_data_.seller),swapTokenMint,CNFT_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
                    }
                    else{createTokenATA=false;}
                }
                let totalSize = 1 + 1 + 32 + 32 + 32 + 32 + 8 + 32 + 32 + 32 + 32 + 32 + 32 + 32 + 8 + 1 + 8 + 32 + 8 + 8 + 1;        
                let uarray = new Uint8Array(totalSize);
                let counter = 0;    
                uarray[counter++] = 0; // 0 = cnft_swap InitializeSwap instruction        
                if(isSwap===true){uarray[counter++]=1;}else{uarray[counter++]=0;}        
                let arr;
                let byte;
                let index;
                let byteArray;
                const assetIdb58 = bs58.decode(assetId);
                arr = Array.prototype.slice.call(Buffer.from(assetIdb58), 0);
                for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}        
                const rootb58 = bs58.decode(getAssetProof.result.root);
                arr = Array.prototype.slice.call(Buffer.from(rootb58),0);
                for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}        
                const datahashb58 = bs58.decode(getAsset.result.compression.data_hash);
                arr = Array.prototype.slice.call(Buffer.from(datahashb58), 0);
                for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
                const creatorhashb58 = bs58.decode(getAsset.result.compression.creator_hash);
                arr = Array.prototype.slice.call(Buffer.from(creatorhashb58), 0);
                for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
                byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
                for (index = 0; index < byteArray.length; index ++ ) {
                    byte = leafId & 0xff;
                    byteArray [ index ] = byte;
                    leafId = (leafId - byte) / 256 ;
                }
                for(let i=0;i<byteArray.length;i++){uarray[counter++]=byteArray[i];}
                const swapAssetIdb58 = bs58.decode(swapAssetId);
                arr = Array.prototype.slice.call(Buffer.from(swapAssetIdb58), 0);
                for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
                const swapTreeId58 = bs58.decode(swapTreeId);
                arr = Array.prototype.slice.call(Buffer.from(swapTreeId58), 0);
                for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
                const swapAssetRootb58 = bs58.decode(swapRoot);
                arr = Array.prototype.slice.call(Buffer.from(swapAssetRootb58), 0);
                for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
                const swapAssetDatahashb58 = bs58.decode(swapDatahash); 
                arr = Array.prototype.slice.call(Buffer.from(swapAssetDatahashb58), 0);
                for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
                const swapAssetCreatorhashb58 = bs58.decode(swapCreatorhash); 
                arr = Array.prototype.slice.call(Buffer.from(swapAssetCreatorhashb58), 0);
                for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
                const swapAssetOwnerb58 = bs58.decode(swapAssetOwner); 
                arr = Array.prototype.slice.call(Buffer.from(swapAssetOwnerb58), 0);
                for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
                const swapDelegateb58 = bs58.decode(swapDelegate); 
                arr = Array.prototype.slice.call(Buffer.from(swapDelegateb58), 0);
                for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
                byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
                for(index=0;index<byteArray.length;index ++){
                    byte = swapLeafId & 0xff;
                    byteArray [ index ] = byte;
                    swapLeafId = (swapLeafId - byte) / 256 ;
                }
                for(let i=0;i<byteArray.length;i++){uarray[counter++]=byteArray[i];}
                uarray[counter++]=proof.length;
                byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
                for(index=0;index<byteArray.length;index++){
                    byte = swapLamports & 0xff;
                    byteArray [ index ] = byte;
                    swapLamports = (swapLamports - byte) / 256 ;
                }
                for(let i=0;i<byteArray.length;i++){uarray[counter++]=byteArray[i];}
                const swapTokenMintb58 = bs58.decode(swapTokenMint.toString());
                arr = Array.prototype.slice.call(Buffer.from(swapTokenMintb58), 0);
                for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
                byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
                for(index=0;index<byteArray.length;index++){
                    byte = swapTokens & 0xff;
                    byteArray [ index ] = byte;
                    swapTokens = (swapTokens - byte) / 256 ;
                }
                for(let i=0;i<byteArray.length;i++){uarray[counter++]=byteArray[i];}
                byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
                for(let index = 0; index < byteArray.length; index ++ ){byte = affiliateFee & 0xff;byteArray [ index ] = byte;affiliateFee = (affiliateFee - byte) / 256 ;}
                for(let i = 0; i < byteArray.length; i++){uarray[counter++] = byteArray[i];}
                uarray[counter++] = _data_.physical;
                // ***************************************************************************
                let keys = [
                    { pubkey: new PublicKey(_data_.seller), isSigner: true, isWritable: true }, // 0
                    { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 1
                    { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 2
                    { pubkey: treeAuthorityPDA, isSigner: false, isWritable: false }, // 3
                    { pubkey: new PublicKey(getAssetProof.result.tree_id), isSigner: false, isWritable: true }, // 4
                    { pubkey: delegate, isSigner: false, isWritable: true }, // 5
                    { pubkey: new PublicKey(this.CNFT_BUBBLEGUM_PROGRAM), isSigner: false, isWritable: false }, // 6
                    { pubkey: solanaAccountCompression.PROGRAM_ID, isSigner: false, isWritable: false }, // 7
                    { pubkey: solanaAccountCompression.SPL_NOOP_PROGRAM_ID, isSigner: false, isWritable: false }, // 8
                    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 9
                    { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 10
                    { pubkey: devTreasury, isSigner: false, isWritable: true }, // 11
                    { pubkey: new PublicKey(affiliateWallet), isSigner: false, isWritable: true }, // 12
                ];
                for(let i=0;i<proof.length;i++){keys.push(proof[i]);}
                const initializeSwapIx = new TransactionInstruction({programId:new PublicKey(this.CNFT_MCSWAP_PROGRAM),data:Buffer.from(uarray),keys:keys});
                const msLookupTable = new PublicKey(this.CNFT_STATIC_ALT);     
                const lookupTableAccount = await connection.getAddressLookupTable(msLookupTable).then((res)=>res.value);            
                let instructions;
                if(createTokenATA===true){instructions=[createTokenATAIx,initializeSwapIx];} 
                else{instructions=[initializeSwapIx];}
                // ***************************************************************************
                const _tx_ = {};
                if(typeof _data_.tolerance!="undefined"){
                    _tx_.tolerance = _data_.tolerance;              
                }
                if(typeof _data_.blink!="undefined"&&_data_.blink===true){
                    _tx_.serialize = true;              
                    _tx_.encode = true; 
                    _tx_.compute = false;
                    _tx_.fees = false;
                }
                else{
                    _tx_.serialize = false;              
                    _tx_.encode = false;
                    _tx_.compute = true;
                    _tx_.fees = true;
                }
                _tx_.rpc = _data_.rpc;                     
                _tx_.account = _data_.seller;       
                _tx_.instructions = instructions;
                _tx_.signers = false;
                _tx_.table = lookupTableAccount;               
                _tx_.priority = _data_.priority;
                if(_data_.sellerEmail!=""){_tx_.memo = _data_.sellerEmail;}
                if(_data_.builder==false){
                    return {"status":"ok","message":"builder disabled","ix":instructions,"table":lookupTableAccount};
                }
                else{
                    return await this.tx(_tx_);
                }
                // ***************************************************************************
            }
            // ***************************************************************************
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async cnftCancel(_data_){
        try{
            // ***************************************************************************
            if(typeof _data_.builder!="undefined"&&_data_.builder==false){_data_.builder=false;}else{_data_.builder=true;}
            if(typeof _data_.priority=="undefined"||_data_.priority==false){_data_.priority=this.PRIORITY;}
            if(typeof _data_.buyerMint=="undefined"||_data_.buyerMint==false||_data_.buyerMint==""){_data_.buyerMint="11111111111111111111111111111111";}
            if(typeof _data_.sellerMint=="undefined"||_data_.sellerMint==false||_data_.sellerMint==""){
                const _error_ = {}
                _error_.status="error";
                _error_.message="buyerMint not defined";
                return _error_;
            }
            // ***************************************************************************
            const connection = new Connection(_data_.rpc, "confirmed");
            const assetId = _data_.sellerMint;
            let swapMint = "11111111111111111111111111111111";
            if (typeof _data_.buyerMint!="undefined"){swapMint=_data_.buyerMint;}
            const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(assetId).toBytes(),new PublicKey(swapMint).toBytes()],new PublicKey(this.CNFT_MCSWAP_PROGRAM));
            const swapState = await connection.getAccountInfo(swapStatePDA[0]);
            const encodedSwapStateData = swapState.data;
            const decodedSwapStateData = this.CNFT_SWAP_STATE.decode(encodedSwapStateData);
            _data_.seller = new PublicKey(decodedSwapStateData.initializer).toString();
            let response;
            let getAsset;
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":assetId}})});
            getAsset = await response.json();
            let getAssetProof;
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAssetProof","params":{"id":assetId}})});
            getAssetProof = await response.json();
            const treeAccount = await solanaAccountCompression.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,new PublicKey(getAssetProof.result.tree_id),);
            const treeAuthorityPDA = treeAccount.getAuthority();
            const canopyDepth = treeAccount.getCanopyDepth();
            const proof = getAssetProof.result.proof.slice(0, getAssetProof.result.proof.length - (!!canopyDepth ? canopyDepth : 0))
            .map((node)=>({pubkey:new PublicKey(node),isWritable:false,isSigner:false,}));
            const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],new PublicKey(this.CNFT_MCSWAP_PROGRAM));
            // ***************************************************************************
            let totalSize = 1 + 32 + 32 + 1;
            let uarray = new Uint8Array(totalSize);
            let counter = 0;
            uarray[counter++] = 2;
            let arr = false;
            let assetIdb58 = bs58.decode(assetId);
            arr = Array.prototype.slice.call(Buffer.from(assetIdb58), 0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            let swapAssetIdb58 = bs58.decode(swapMint);
            arr = Array.prototype.slice.call(Buffer.from(swapAssetIdb58), 0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            uarray[counter++] = proof.length;
            // ***************************************************************************
            const keys = [
              {
                pubkey: new PublicKey(_data_.seller),
                isSigner: true,
                isWritable: true
              }, // 0
              {
                pubkey: swapVaultPDA[0],
                isSigner: false,
                isWritable: true
              }, // 1
              {
                pubkey: swapStatePDA[0],
                isSigner: false,
                isWritable: true
              }, // 2
              {
                pubkey: treeAuthorityPDA,
                isSigner: false,
                isWritable: false
              }, // 3
              {
                pubkey: new PublicKey(getAssetProof.result.tree_id),
                isSigner: false,
                isWritable: true
              }, // 4
              {
                pubkey: new PublicKey(this.CNFT_BUBBLEGUM_PROGRAM),
                isSigner: false,
                isWritable: false
              }, // 5
              {
                pubkey: solanaAccountCompression.PROGRAM_ID,
                isSigner: false,
                isWritable: false
              }, // 6
              {
                pubkey: solanaAccountCompression.SPL_NOOP_PROGRAM_ID,
                isSigner: false,
                isWritable: false
              }, // 7
              {
                pubkey: SystemProgram.programId,
                isSigner: false,
                isWritable: false
              }, // 8
            ];
            // ***************************************************************************
            for(let i=0;i<proof.length;i++){keys.push(proof[i]);}
            const reverseSwapIx = new TransactionInstruction({programId:new PublicKey(this.CNFT_MCSWAP_PROGRAM),data:Buffer.from(uarray),keys:keys});
            const instructions = [reverseSwapIx];
            // ***************************************************************************
            const _tx_ = {};
            if(typeof _data_.tolerance!="undefined"){
                _tx_.tolerance = _data_.tolerance;              
            }
            if(typeof _data_.blink!="undefined"&&_data_.blink===true){
                _tx_.serialize = true;              
                _tx_.encode = true; 
                _tx_.compute = false;
                _tx_.fees = false;
            }
            else{
                _tx_.serialize = false;              
                _tx_.encode = false;
                _tx_.compute = true;
                _tx_.fees = true;
            }
            _tx_.rpc = _data_.rpc;                     
            _tx_.account = _data_.seller;       
            _tx_.instructions = instructions;
            _tx_.signers = _data_.signers;
            _tx_.table = false;  
            _tx_.priority = _data_.priority;
            if(_data_.builder==false){
                return {"status":"ok","message":"builder disabled","ix":instructions,"table":false};
            }
            else{
                return await this.tx(_tx_);
            }   
            // ***************************************************************************
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async cnftExecute(_data_){
        try{
            // ***************************************************************************
            if(typeof _data_.memo=="undefined"){_data_.memo=false;}
            if(typeof _data_.builder!="undefined"&&_data_.builder==false){_data_.builder=false;}else{_data_.builder=true;}
            if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
            if(typeof _data_.signers=="undefined"||_data_.signers==false){_data_.signers=false;}
            let affiliateWallet = this.CNFT_TREASURY;
            let affiliateFee = 0;
            if(typeof _data_.affiliateWallet!="undefined" && _data_.affiliateWallet!=false &&  _data_.affiliateFee!=false && _data_.affiliateFee>0){
                affiliateWallet = _data_.affiliateWallet;
                affiliateFee = _data_.affiliateFee;
            }
            if(typeof _data_.convert!="undefined"&&_data_.convert===true&&typeof _data_.affiliateFee!="undefined"&&_data_.affiliateFee!=false&&_data_.affiliateFee>0){
                let affiliate_ = await this.convert({"rpc":_data_.rpc,"amount":_data_.affiliateFee,"mint":"So11111111111111111111111111111111111111112"});
                affiliateFee = affiliate_.data;
                _data_.affiliateFee = affiliate_.data;
            }
            if(typeof _data_.buyerMint=="undefined"||_data_.buyerMint==false){_data_.buyerMint="11111111111111111111111111111111";}
            // ***************************************************************************
            const connection = new Connection(_data_.rpc,"confirmed");
            const assetId = _data_.sellerMint;
            let swapAssetId = "11111111111111111111111111111111";
            if(typeof _data_.buyerMint!="undefined"){swapAssetId=_data_.buyerMint;}   
            const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")],new PublicKey(this.CNFT_MCSWAP_PROGRAM));
            const programState = await connection.getAccountInfo(programStatePDA[0]);  
            const encodedProgramStateData = programState.data;
            const decodedProgramStateData = this.CNFT_PROGRAM_STATE.decode(encodedProgramStateData);
            const feeLamports = new BN(decodedProgramStateData.fee_lamports, 10, "le");
            const devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
            const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(assetId).toBytes(),new PublicKey(swapAssetId).toBytes()],new PublicKey(this.CNFT_MCSWAP_PROGRAM));
            const swapState = await connection.getAccountInfo(swapStatePDA[0]);        
            let isSwap = true;      
            const encodedSwapStateData = swapState.data;
            const decodedSwapStateData = this.CNFT_SWAP_STATE.decode(encodedSwapStateData);
            if(new BN(decodedSwapStateData.is_swap,10,"le")==0){isSwap=false;}
            const swapInitializer = new PublicKey(decodedSwapStateData.initializer);
            const swapLeafOwner = new PublicKey(decodedSwapStateData.swap_leaf_owner);
            let swapDelegate = new PublicKey(decodedSwapStateData.swap_delegate);
            const swapLamports = new BN(decodedSwapStateData.swap_lamports, 10, "le");
            const swapTokenMint = new PublicKey(decodedSwapStateData.swap_token_mint);
            const swapTokens = new BN(decodedSwapStateData.swap_tokens, 10, "le");
            // ***************************************************************************
            let response;
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":assetId}})});
            const getAsset = await response.json();
            response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
            body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAssetProof","params":{"id":assetId}})});
            const getAssetProof = await response.json();
            const treeAccount = await solanaAccountCompression.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,new PublicKey(getAssetProof.result.tree_id),);  
            const treeAuthorityPDA = treeAccount.getAuthority();
            const canopyDepth = treeAccount.getCanopyDepth();
            const proof = getAssetProof.result.proof.slice(0,getAssetProof.result.proof.length-(!!canopyDepth ? canopyDepth : 0))
            .map((node)=>({pubkey:new PublicKey(node),isWritable:false,isSigner:false,}));
            // ***************************************************************************
            let swapDatahash = "11111111111111111111111111111111";
            let swapCreatorhash = "11111111111111111111111111111111";
            let swapLeafId = 0;
            let swapTreeId = "11111111111111111111111111111111";
            let swapRoot = "11111111111111111111111111111111";
            let swapTreeAuthorityPDA = new PublicKey("11111111111111111111111111111111");
            let swapProof = null;
            if(isSwap===true){
                swapDelegate = new PublicKey(_data_.buyer);
                response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":swapAssetId}})});
                const getSwapAsset = await response.json();
                swapDatahash = getSwapAsset.result.compression.data_hash;
                swapCreatorhash = getSwapAsset.result.compression.creator_hash;
                swapLeafId = getSwapAsset.result.compression.leaf_id;
                response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAssetProof","params":{"id":swapAssetId}})});
                const getSwapAssetProof = await response.json();
                swapTreeId = getSwapAssetProof.result.tree_id;
                swapRoot = getSwapAssetProof.result.root;
                const swapTreeAccount = await solanaAccountCompression.ConcurrentMerkleTreeAccount.fromAccountAddress(connection,new PublicKey(getSwapAssetProof.result.tree_id),);
                swapTreeAuthorityPDA = swapTreeAccount.getAuthority();
                const swapCanopyDepth = swapTreeAccount.getCanopyDepth();
                swapProof = getSwapAssetProof.result.proof
                .slice(0, getSwapAssetProof.result.proof.length-(!!swapCanopyDepth ? swapCanopyDepth : 0))
                .map((node)=>({pubkey:new PublicKey(node),isWritable:false,isSigner:false,}));        
            }
            if(swapProof==null){swapProof=[];}
            const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],new PublicKey(this.CNFT_MCSWAP_PROGRAM));    
            let TOKEN_PROGRAM = splToken.TOKEN_PROGRAM_ID;
            if(swapTokenMint.toString()!="11111111111111111111111111111111"){
                response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":swapTokenMint.toString()}})});
                let meta_data = await response.json();
                if(typeof meta_data.result.mint_extensions!="undefined"){TOKEN_PROGRAM=splToken.TOKEN_2022_PROGRAM_ID;}
            }
            const initializerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,swapInitializer,false,TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            const providerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,new PublicKey(_data_.buyer),false,TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
            // ***************************************************************************
            const totalSize = 1 + 32 + 32 + 1 + 1 + 8;
            let uarray = new Uint8Array(totalSize);
            let counter = 0;    
            uarray[counter++] = 1; // 1 = cnft_swap SwapcNFTs instruction
            let arr;
            let assetIdb58 = bs58.decode(assetId);
            arr = Array.prototype.slice.call(Buffer.from(assetIdb58),0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            let swapAssetIdb58 = bs58.decode(swapAssetId);
            arr = Array.prototype.slice.call(Buffer.from(swapAssetIdb58),0);
            for(let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            uarray[counter++] = proof.length;
            if(isSwap==true){uarray[counter++]=swapProof.length;}else{uarray[counter++]=0;}
            let byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
            for(let index = 0; index < byteArray.length; index ++ ){let byte = affiliateFee & 0xff;byteArray [ index ] = byte;affiliateFee = (affiliateFee - byte) / 256 ;}
            for(let i = 0; i < byteArray.length; i++){uarray[counter++] = byteArray[i];}
            // ***************************************************************************
            const keys = [
              { pubkey: new PublicKey(_data_.buyer), isSigner: true, isWritable: true }, // 0
              { pubkey: new PublicKey(swapInitializer), isSigner: false, isWritable: true }, // 1
              { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 2
              { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 3
              { pubkey: treeAuthorityPDA, isSigner: false, isWritable: false }, // 4
              { pubkey: new PublicKey(getAssetProof.result.tree_id), isSigner: false, isWritable: true }, // 5
              { pubkey: swapTreeAuthorityPDA, isSigner: false, isWritable: false }, // 6
              { pubkey: new PublicKey(swapTreeId), isSigner: false, isWritable: true }, // 7 
              { pubkey: new PublicKey(swapDelegate), isSigner: false, isWritable: true }, // 8
              { pubkey: new PublicKey(swapTokenMint), isSigner: false, isWritable: true }, // 9
              { pubkey: new PublicKey(this.CNFT_BUBBLEGUM_PROGRAM), isSigner: false, isWritable: false }, // 10
              { pubkey: solanaAccountCompression.PROGRAM_ID, isSigner: false, isWritable: false }, // 11
              { pubkey: solanaAccountCompression.SPL_NOOP_PROGRAM_ID, isSigner: false, isWritable: false }, // 12
              { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 13
              { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 14
              { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 15
              { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 16
              { pubkey: providerTokenATA, isSigner: false, isWritable: true }, // 17
              { pubkey: initializerTokenATA, isSigner: false, isWritable: true }, // 18
              { pubkey: devTreasury, isSigner: false, isWritable: true }, // 19
              { pubkey: new PublicKey(affiliateWallet), isSigner: false, isWritable: true }, // 20
            ];
            // ***************************************************************************
            for(let i=0;i<proof.length;i++){keys.push(proof[i]);}    
            if(isSwap===true){for(let i=0;i<swapProof.length;i++){keys.push(swapProof[i]);}}
            const swapcNFTsIx = new TransactionInstruction({programId:new PublicKey(this.CNFT_MCSWAP_PROGRAM),data:Buffer.from(uarray),keys:keys,});
            const msLookupTable = new PublicKey(this.CNFT_STATIC_ALT);
            const lookupTableAccount = await connection.getAddressLookupTable(msLookupTable).then((res)=>res.value);
            const instructions = [swapcNFTsIx];
            // ***************************************************************************
            const _tx_ = {};
            if(typeof _data_.tolerance!="undefined"){
                _tx_.tolerance = _data_.tolerance;              
            }
            if(typeof _data_.blink!="undefined"&&_data_.blink===true){
                _tx_.serialize = true;              
                _tx_.encode = true; 
                _tx_.compute = false;
                _tx_.fees = false;
            }
            else{
                _tx_.serialize = false;              
                _tx_.encode = false;
                _tx_.compute = true;
                _tx_.fees = true;
            }
            _tx_.rpc = _data_.rpc;                     
            _tx_.account = _data_.buyer;       
            _tx_.instructions = instructions;
            _tx_.table = lookupTableAccount;                   
            _tx_.priority = _data_.priority;
            _tx_.memo = _data_.memo;
            if(_data_.builder==false){
                return {"status":"ok","message":"builder disabled","ix":instructions,"table":lookupTableAccount};
            }
            else{
                return await this.tx(_tx_);
            }   
            // ***************************************************************************
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async cnftReceived(_data_){
    try{
        const connection = new Connection(_data_.rpc,"confirmed");
        const NFT_ProgramId = new PublicKey(this.CNFT_MCSWAP_PROGRAM);
        const _result_ = {}
        let CNFT_RECEIVED = [];
        let accounts = null;
        accounts = await connection.getParsedProgramAccounts(NFT_ProgramId,{filters:[{dataSize:523,},{memcmp:{offset:410,bytes:_data_.wallet,},},],}).catch(function(){});
        if(accounts != null){for(let i=0;i<accounts.length;i++){
            const account = accounts[i];
            const resultStatePDA = account.pubkey;
            let resultState = null;
            const record = {};
            resultState = await connection.getAccountInfo(resultStatePDA);
            if(resultState != null){
                let decodedData = this.CNFT_SWAP_STATE.decode(resultState.data);
                const acct = account.pubkey.toString();
                record.acct = acct;
                const initializer = new PublicKey(decodedData.initializer).toString();
                const initializer_mint = new PublicKey(decodedData.asset_id).toString();
                const is_swap = new PublicKey(decodedData.is_swap).toString();
                const utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
                let taker = new PublicKey(decodedData.swap_leaf_owner).toString();
                let swap_mint = new PublicKey(decodedData.swap_asset_id).toString();
                let swap_lamports = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
                let swap_token_mint = new PublicKey(decodedData.swap_token_mint).toString();
                let swap_tokens = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
                let physical = parseInt(new BN(decodedData.physical, 10, "le"));
                if(taker=="11111111111111111111111111111111"){taker=false;}
                if(swap_mint=="11111111111111111111111111111111"){swap_mint=false;}
                if(swap_token_mint=="11111111111111111111111111111111"){swap_token_mint=false;}
                if(swap_tokens>0){}else{swap_tokens=0;}
                if(swap_lamports>0){}else{swap_lamports=0;}
                record.utime = utime;
                record.seller = initializer;
                record.buyer = taker;
                record.sellerMint = initializer_mint;
                record.buyerMint = swap_mint;
                record.lamports = swap_lamports;
                record.tokenMint = swap_token_mint;
                record.units = swap_tokens;
                record.physical = physical;
                if(typeof _data_.display!="undefined"&&_data_.display===true){
                    if(record.lamports>0){
                        const lamports = await this.convert({"rpc":_data_.rpc,"amount":record.lamports,"mint":"So11111111111111111111111111111111111111112","display":_data_.display});
                        record.lamports = lamports.data;
                    }
                    if(record.units>0){
                        const units = await this.convert({"rpc":_data_.rpc,"amount":record.units,"mint":record.tokenMint,"display":_data_.display});
                        record.units = units.data;
                    }
                }
                CNFT_RECEIVED.push(record);
            }
            if(i==(accounts.length-1)){
                _result_.status="ok";
                _result_.message="success";
                _result_.data=CNFT_RECEIVED;
                return _result_;
            }
        }
        }
        else{
            _result_.status="ok";
            _result_.message="no contracts found";
            _result_.data=CNFT_RECEIVED;
            return _result_;
        }
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    async cnftSent(_data_){
    try{
        if(typeof _data_.private=="undefined"||_data_.private!=true){_data_.private=false;}
        const connection = new Connection(_data_.rpc,"confirmed");
        const NFT_ProgramId = new PublicKey(this.CNFT_MCSWAP_PROGRAM);
        const _result_ = {}
        let CNFT_SENT = [];
        let accounts = null;
        accounts = await connection.getParsedProgramAccounts(NFT_ProgramId,{filters:[{dataSize:523,},{memcmp:{offset:10,bytes:_data_.wallet,},},],}).catch(function(){});
        if(accounts != null){for(let i=0;i<accounts.length;i++){
            const account = accounts[i];
            const resultStatePDA = account.pubkey;
            let resultState = null;
            const record = {};
            resultState = await connection.getAccountInfo(resultStatePDA);
            if(resultState != null){
                let decodedData = this.CNFT_SWAP_STATE.decode(resultState.data);
                const acct = account.pubkey.toString();
                record.acct = acct;
                const initializer = new PublicKey(decodedData.initializer).toString();
                const initializer_mint = new PublicKey(decodedData.asset_id).toString();
                const is_swap = new PublicKey(decodedData.is_swap).toString();
                const utime = parseInt(new BN(decodedData.utime, 10, "le").toString());
                let taker = new PublicKey(decodedData.swap_leaf_owner).toString();
                let swap_mint = new PublicKey(decodedData.swap_asset_id).toString();
                let swap_lamports = parseInt(new BN(decodedData.swap_lamports, 10, "le"));
                let swap_token_mint = new PublicKey(decodedData.swap_token_mint).toString();
                let swap_tokens = parseInt(new BN(decodedData.swap_tokens, 10, "le"));
                let physical = parseInt(new BN(decodedData.physical, 10, "le"));
                if(taker=="11111111111111111111111111111111"){taker=false;}
                if(swap_mint=="11111111111111111111111111111111"){swap_mint=false;}
                if(swap_token_mint=="11111111111111111111111111111111"){swap_token_mint=false;}
                if(swap_tokens>0){}else{swap_tokens=0;}
                if(swap_lamports>0){}else{swap_lamports=0;}
                record.utime = utime;
                record.seller = initializer;
                record.buyer = taker;
                record.sellerMint = initializer_mint;
                record.buyerMint = swap_mint;
                record.lamports = swap_lamports;
                record.tokenMint = swap_token_mint;
                record.units = swap_tokens;
                record.physical = physical;
                // if private
                let pushit = false;
                if(_data_.private === true){
                    if(record.buyer!=false){pushit=true;}
                }
                else{
                    if(record.buyer==false){pushit=true;}
                }
                if(pushit === true){
                    if(typeof _data_.display!="undefined"&&_data_.display===true){
                        if(record.lamports>0){
                            const lamports = await this.convert({"rpc":_data_.rpc,"amount":record.lamports,"mint":"So11111111111111111111111111111111111111112","display":_data_.display});
                            record.lamports = lamports.data;
                        }
                        if(record.units>0){
                            const units = await this.convert({"rpc":_data_.rpc,"amount":record.units,"mint":record.tokenMint,"display":_data_.display});
                            record.units = units.data;
                        }
                    }
                    CNFT_SENT.push(record);
                }
            }
            if(i==(accounts.length-1)){
                _result_.status="ok";
                _result_.message="success";
                _result_.data=CNFT_SENT;
                return _result_;
            }
        }
        }
        else{
            _result_.status="ok";
            _result_.message="no contracts found";
            _result_.data=CNFT_SENT;
            return _result_;
        }
    }
    catch(err){
        const _error_ = {}
        _error_.status="error";
        _error_.message=err;
        return _error_;
    }
    }
    // helpers
    async find(_data_){
        const _result_={}
        if(typeof _data_.rpc=="undefined"){_result_.status="error";_result_.message="no rpc provided";return;}
        if(typeof _data_.standard=="undefined"){_result_.status="error";_result_.message="no standard provided";return;}
        if(typeof _data_.mint=="undefined"){_result_.status="error";_result_.message="no mint provided";return;}
        if(typeof _data_.seller=="undefined"){_result_.status="error";_result_.message="no seller provided";return;}
        if(typeof _data_.private=="undefined"){_data_.private=false;}
        try{
            let escrows = [];
            const params = {
                rpc: _data_.rpc,
                display: false,
                private: _data_.private,
                wallet: _data_.seller
            };
            if(_data_.standard=="nft"){
                escrows = await this.nftSent(params);
            }
            else if(_data_.standard=="cnft"){
                escrows = await this.cnftSent(params);
            }
            else if(_data_.standard=="pnft"){
                escrows = await this.pnftSent(params);
            }
            else if(_data_.standard=="core"){
                escrows = await this.coreSent(params);
            }
            if(escrows.data.length>0){
                for(let i=0;i<escrows.data.length;i++){
                    const escrow = escrows.data[i];
                    if(_data_.mint==escrow.sellerMint){
                        i = escrows.data.length;
                        return escrow.acct;
                    }
                }
            }
            else{
                return false;
            }
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async fetch(_data_){
        try{
            const _result_={}
            if(typeof _data_.standard=="undefined"){_result_.status="error";_result_.message="no standard provided";return;}
            if(typeof _data_.escrow=="undefined"){_result_.status="error";_result_.message="no escrow id provided";return;}
            let PROGRAM;
            let STATE;
            let NAME;
            const connection=new Connection(_data_.rpc,"confirmed");
            if(_data_.standard=="spl"){
                PROGRAM = this.SPL_MCSWAP_PROGRAM;
                STATE = this.SPL_SWAP_STATE;
                NAME = "swap-state";
                const STATE_PDA = new PublicKey(_data_.escrow);
                const SWAP_STATE=await connection.getAccountInfo(new PublicKey(STATE_PDA));
                const encoded=SWAP_STATE.data;
                const decoded=STATE.decode(encoded);
                _result_.seller=(new PublicKey(decoded.initializer)).toString();
                _result_.buyer=(new PublicKey(decoded.taker)).toString();
                _result_.token1Mint=(new PublicKey(decoded.token1_mint)).toString();
                _result_.token2Mint=(new PublicKey(decoded.token2_mint)).toString();
                _result_.token3Mint=(new PublicKey(decoded.token3_mint)).toString();
                _result_.token4Mint=(new PublicKey(decoded.token4_mint)).toString();
                _result_.token1Amount=new BN(decoded.token1_amount, 10, "le");
                _result_.token2Amount=new BN(decoded.token2_amount, 10, "le");
                _result_.token3Amount=new BN(decoded.token3_amount, 10, "le");
                _result_.token4Amount=new BN(decoded.token4_amount, 10, "le");
                _result_.token1Amount=parseInt(_result_.token1Amount);
                _result_.token2Amount=parseInt(_result_.token2Amount);
                _result_.token3Amount=parseInt(_result_.token3Amount);
                _result_.token4Amount=parseInt(_result_.token4Amount);
                _result_.physical = parseInt(new BN(decoded.physical, 10, "le"));
                if(_result_.buyer=="11111111111111111111111111111111"){_result_.buyer=false;}
                if(_result_.token2Mint=="11111111111111111111111111111111"){_result_.token2Mint=false;}
                if(_result_.token4Mint=="11111111111111111111111111111111"){_result_.token4Mint=false;}
                if(typeof _data_.display!="undefined"&&_data_.display===true){
                    const token1Amount=await this.convert({"rpc":_data_.rpc,"amount":_result_.token1Amount,"mint":_result_.token1Mint,"display":_data_.display});
                    const token3Amount = await this.convert({"rpc":_data_.rpc,"amount":_result_.token3Amount,"mint":_result_.token3Mint,"display":_data_.display});
                    _result_.token1Amount=token1Amount.data;
                    _result_.token3Amount=token3Amount.data;
                    _result_.token1Symbol=token1Amount.symbol;
                    _result_.token3Symbol=token3Amount.symbol;
                    _result_.token1Decimals=token1Amount.decimals;
                    _result_.token3Decimals=token3Amount.decimals;
                    if(_result_.token2Mint != false){
                        const token2Amount = await this.convert({"rpc":_data_.rpc,"amount":_result_.token2Amount,"mint":_result_.token2Mint,"display":_data_.display});
                        _result_.token2Amount=token2Amount.data;
                        _result_.token2Symbol=token2Amount.symbol;
                        _result_.token2Decimals=token2Amount.decimals;
                    }
                    else{
                        _result_.token2Amount=0;
                        _result_.token2Symbol=false;
                        _result_.token2Decimals=0;
                    }
                    if(_result_.token4Mint != false){
                        const token4Amount = await this.convert({"rpc":_data_.rpc,"amount":_result_.token4Amount,"mint":_result_.token4Mint,"display":_data_.display});
                        _result_.token4Amount=token4Amount.data;
                        _result_.token4Symbol=token4Amount.symbol;
                        _result_.token4Decimals=token4Amount.decimals;
                    }
                    else{
                        _result_.token4Amount=0;
                        _result_.token4Symbol=false;
                        _result_.token4Decimals=0;
                    }
                    if(typeof _result_.token2Amount=="undefined"){_result_.token2Amount=0;_result_.token2Decimals=0;_result_.token2Symbol=false;}
                    if(typeof _result_.token4Amount=="undefined"){_result_.token4Amount=0;_result_.token4Decimals=0;_result_.token4Symbol=false;}                }
                return _result_;
            }
            else{
                if(_data_.standard=="core"){
                    PROGRAM = this.CORE_MCSWAP_PROGRAM;
                    STATE = this.CORE_SWAP_STATE;
                    NAME = "swap-state";
                }
                else if(_data_.standard=="nft"){
                    PROGRAM = this.NFT_MCSWAP_PROGRAM;
                    STATE = this.NFT_SWAP_STATE;
                    NAME = "swap-state";
                }
                else if(_data_.standard=="cnft"){
                    PROGRAM = this.CNFT_MCSWAP_PROGRAM;
                    STATE = this.CNFT_SWAP_STATE;
                    NAME = "swap-state";
                }
                else if(_data_.standard=="pnft"){
                    PROGRAM = this.PNFT_MCSWAP_PROGRAM;
                    STATE = this.PNFT_SWAP_STATE;
                    NAME = "swap-state";
                }
                if(typeof _data_.buyerMint=="undefined"||_data_.buyerMint==""||_data_.buyerMint==false){_data_.buyerMint="11111111111111111111111111111111";}
                const STATE_PDA=new PublicKey(_data_.escrow);
                const SWAP_STATE=await connection.getAccountInfo(STATE_PDA).catch(function(){});
                const encoded=SWAP_STATE.data;
                const decoded=STATE.decode(encoded);
                if(_data_.standard=="core"){
                    _result_.sellerMint=new PublicKey(decoded.initializer_asset).toString();
                    _result_.buyerMint=new PublicKey(decoded.swap_asset).toString();
                }
                else if(_data_.standard=="cnft"){
                    _result_.sellerMint=new PublicKey(decoded.asset_id).toString();
                    _result_.buyerMint=new PublicKey(decoded.swap_asset_id).toString();
                }
                else{
                    _result_.sellerMint=new PublicKey(decoded.initializer_mint).toString();
                    _result_.buyerMint=new PublicKey(decoded.swap_mint).toString();
                }
                if(_data_.standard=="cnft"){
                    _result_.buyer=new PublicKey(decoded.swap_leaf_owner).toString();
                }
                else{
                    _result_.buyer=new PublicKey(decoded.taker).toString();
                }
                _result_.seller=new PublicKey(decoded.initializer).toString();
                _result_.lamports=parseInt(new BN(decoded.swap_lamports,10,"le"));
                _result_.tokenMint=new PublicKey(decoded.swap_token_mint).toString();
                _result_.units=parseInt(new BN(decoded.swap_tokens,10,"le"));
                _result_.physical = parseInt(new BN(decoded.physical, 10, "le"));
                if(_result_.buyerMint=="11111111111111111111111111111111"){_result_.buyerMint=false;}
                if(_result_.buyer=="11111111111111111111111111111111"){_result_.buyer=false;}
                if(_result_.tokenMint=="11111111111111111111111111111111"){_result_.tokenMint=false;}
                _result_.symbol=false;
                _result_.decimals=0;
                if(typeof _data_.display!="undefined"&&_data_.display===true){
                    const lamports=await this.convert({"rpc":_data_.rpc,"amount":_result_.lamports,"mint":"So11111111111111111111111111111111111111112","display":_data_.display});
                    _result_.lamports=lamports.data;
                    if(_result_.tokenMint!=false){
                        const units=await this.convert({"rpc":_data_.rpc,"amount":_result_.units,"mint":_result_.tokenMint,"display":_data_.display});
                        _result_.units=units.data;
                        _result_.symbol=units.symbol;
                        _result_.decimals=units.decimals;
                    }
                }
                return _result_;
            }
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async fee(_data_){
        const connection=new Connection(_data_.rpc,"confirmed");
            let PROGRAM;
            let STATE;
            let NAME;
            if(_data_.standard=="spl"){
                PROGRAM = this.SPL_MCSWAP_PROGRAM;
                STATE = this.SPL_PROGRAM_STATE;
                NAME = "program-state";
            }
            else if(_data_.standard=="core"){
                PROGRAM = this.CORE_MCSWAP_PROGRAM;
                STATE = this.CORE_PROGRAM_STATE;
                NAME = "program-state";
            }
            else if(_data_.standard=="nft"){
                PROGRAM = this.NFT_MCSWAP_PROGRAM;
                STATE = this.NFT_PROGRAM_STATE;
                NAME = "program-state";
            }
            else if(_data_.standard=="cnft"){
                PROGRAM = this.CNFT_MCSWAP_PROGRAM;
                STATE = this.CNFT_PROGRAM_STATE;
                NAME = "program-state";
            }
            else if(_data_.standard=="pnft"){
                PROGRAM = this.PNFT_MCSWAP_PROGRAM;
                STATE = this.PNFT_PROGRAM_STATE;
                NAME = "program-state";
            }
            const FEE_PROGRAM_PDA=PublicKey.findProgramAddressSync([Buffer.from(NAME)],new PublicKey(PROGRAM));
            const FEE_PROGRAM_STATE=await connection.getAccountInfo(FEE_PROGRAM_PDA[0]).catch(function(err){
                console.log("err", err);
            });
            const decodedData=STATE.decode(FEE_PROGRAM_STATE.data);
            let lamports;
            if(_data_.standard=="spl"){lamports=parseInt(new BN(decodedData.dev_lamports,10,"le").toString());}
            else{lamports=parseInt(new BN(decodedData.fee_lamports,10,"le").toString());}
            if(typeof _data_.display!="undefined" && _data_.display===true){return Number.parseFloat(lamports/1000000000).toFixed(9);}else{return lamports;}
    }
    // utilities
    async convert(_data_){
        try{
            let decimals;
            let symbol;
            if(_data_.mint=="So11111111111111111111111111111111111111112"){
                decimals = 9;
                symbol = "SOL";
            }
            else{
                const response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
                body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":_data_.mint}})});
                const meta_data = await response.json();
                decimals = meta_data.result.token_info.decimals;
                symbol = meta_data.result.token_info.symbol;
            }
            let amount = 0;
            let multiply = 1;
            for(let i = 0; i < decimals; i++){multiply = multiply * 10;}
            if(typeof _data_.display!="undefined"&&_data_.display===true){
                amount=(_data_.amount/multiply).toFixed(decimals);
            }
            else{amount=parseInt(_data_.amount*multiply);}
            const _response_={}
            _response_.status="ok";
            _response_.message="conversion successful";
            _response_.data=amount;
            _response_.symbol=symbol;
            _response_.decimals=decimals;
            return _response_;
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async send(rpc,tx){
        try{
            const connection = new Connection(rpc,"confirmed");
            const signature = await connection.sendRawTransaction(tx.serialize(),{skipPreflight:true,maxRetries:0});
            return signature;
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }
    async status(cluster,sig,max=10,int=4){
        return await new Promise(resolve=>{
            let start = 1;
            let connection = null;
            connection = new Connection(cluster, "confirmed");
            let intervalID = setInterval(async()=>{
            let tx_status = null;
            tx_status = await connection.getSignatureStatuses([sig], {searchTransactionHistory: true,});
            if (tx_status == null || 
            typeof tx_status.value == "undefined" || 
            tx_status.value == null || 
            tx_status.value[0] == null || 
            typeof tx_status.value[0] == "undefined" || 
            typeof tx_status.value[0].confirmationStatus == "undefined"){
                console.log("trying again...");
            } 
            else if(tx_status.value[0].confirmationStatus == "processed"){
                start = 1;
            }
            else if(tx_status.value[0].confirmationStatus == "confirmed"){
                console.log("confirming...");
                start = 1;
            }
            else if (tx_status.value[0].confirmationStatus == "finalized"){
                if(tx_status.value[0].err != null){
                resolve('program error!');
                clearInterval(intervalID);
                }
                resolve('finalized');
                clearInterval(intervalID);
            }
            start++;
            if(start == max + 1){
                resolve((max * int)+' seconds max wait reached');
                clearInterval(intervalID);
            }
            },(int * 1000));
        });  
    }
    async ComputeLimit(cluster,opti_payer,opti_ix,opti_tolerance,blockhash,opti_table=false){
        const connection = new Connection(cluster, 'confirmed');
        const opti_sim_limit = ComputeBudgetProgram.setComputeUnitLimit({units:1400000});
        const opti_fee_limit = ComputeBudgetProgram.setComputeUnitPrice({microLamports:10000});
        let re_ix = [];
        for (let o in opti_ix) {re_ix.push(opti_ix[o]);}
        opti_ix = re_ix;
        opti_ix.unshift(opti_sim_limit);
        opti_ix.unshift(opti_fee_limit);
        let opti_msg = null;
        opti_msg = new TransactionMessage({payerKey:opti_payer.publicKey,recentBlockhash:blockhash,instructions:opti_ix,}).compileToV0Message(opti_table);
        const opti_tx = new VersionedTransaction(opti_msg);    
        const opti_cu_res = await connection.simulateTransaction(opti_tx,{replaceRecentBlockhash:true,sigVerify:false,});
        if(opti_cu_res.value.err != null){
            return {"status":"error","message":"simulation error","details":opti_cu_res.value.err,"logs":opti_cu_res.value.logs};
        }
        const opti_consumed = opti_cu_res.value.unitsConsumed;
        const opti_cu_limit = Math.ceil(opti_consumed * opti_tolerance);
        console.log("setting cu limit", opti_cu_limit);
        return opti_cu_limit;
    }
    async FeeEstimate(cluster,payer,priority_level,instructions,blockhash,table=false){
        const connection = new Connection(cluster,'confirmed',);
        let re_ix = [];
        for (let o in instructions) {re_ix.push(instructions[o]);}
        instructions = re_ix;
        const _msg = new TransactionMessage({payerKey:payer.publicKey,recentBlockhash:blockhash,instructions:instructions,}).compileToV0Message(table);
        const tx = new VersionedTransaction(_msg);
        const response = await fetch(cluster, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            jsonrpc: "2.0",
            id: "1",
            method: "getPriorityFeeEstimate",
            params: [
                {
                transaction: bs58.encode(tx.serialize()), // Pass the serialized transaction in Base58
                options: { priorityLevel: priority_level },
                },
            ],
            }),
        });
        let data = await response.json();
        data = parseInt(data.result.priorityFeeEstimate);
        if(data == 1){data = 100000;}
        if(data < 10000){data = 10000;}
        console.log("fee estimate", data);
        return data;
    }
    async tx(_data_){
        let _obj_={};let _rpc_;let _account_;let _instructions_;let _signers_;let _priority_;let _tolerance_;let _serialize_;let _encode_;let _table_;let _compute_;let _fees_;let _memo_;
        if(typeof _data_.rpc=="undefined"){_obj_.message="missing rpc";return _obj_;}else{_rpc_=_data_.rpc;}
        if(typeof _data_.account=="undefined"){_obj_.message="missing account";return _obj_;}else{_account_=_data_.account;}
        if(typeof _data_.instructions=="undefined"){_obj_.message="missing instructions";return _obj_;}else{_instructions_=_data_.instructions;}
        if(typeof _data_.signers=="undefined" || _data_.signers==false){_signers_=false;}else{_signers_=_data_.signers;}
        if(typeof _data_.priority=="undefined"){_priority_="Low";}else{_priority_=_data_.priority;}
        if(typeof _data_.tolerance=="undefined" || _data_.tolerance==false){_tolerance_=1.1;}else{_tolerance_=_data_.tolerance;}
        if(typeof _data_.serialize=="undefined"){_serialize_=false;}else{_serialize_=_data_.serialize;}
        if(typeof _data_.encode=="undefined"){_encode_=false;}else{_encode_=_data_.encode;}
        if(typeof _data_.compute=="undefined"){_compute_=true;}else{_compute_=_data_.compute;}
        if(typeof _data_.fees=="undefined"){_fees_=true;}else{_fees_=_data_.fees;}
        if(typeof _data_.table=="undefined" || _data_.table==false){_table_=[];}else{_table_=[_data_.table];}
        if(typeof _data_.memo!="undefined" && _data_.memo!=false){_memo_=_data_.memo;}else{_memo_=false;}
        const _wallet_= new PublicKey(_account_);
        const connection = new Connection(_rpc_,"confirmed");
        const _blockhash_ = (await connection.getLatestBlockhash('confirmed')).blockhash;
        if(_priority_=="Extreme"){_priority_="VeryHigh";}
        let _payer_={publicKey:_wallet_}
        if(_memo_ != false){
            const memoIx = createMemoInstruction(_memo_,[new PublicKey(_account_)]);
            _instructions_.push(memoIx);
        }
        if(_compute_ != false){
            let _cu_ = null;
            _cu_= await this.ComputeLimit(_rpc_,_payer_,_instructions_,_tolerance_,_blockhash_,_table_);
            if(typeof _cu_.logs != "undefined"){
                _obj_.status="error";
                _cu_.message="there was an error when simulating the transaction";
                return _cu_;
            }
            else if(_cu_==null){
                _obj_.status="error";
                _obj_.message="there was an error when optimizing compute limit";
                return _obj_;
            }
            _instructions_.unshift(ComputeBudgetProgram.setComputeUnitLimit({units:_cu_}));
        }
        if(_fees_ != false){
            const get_priority = await this.FeeEstimate(_rpc_,_payer_,_priority_,_instructions_,_blockhash_,_table_);
            _instructions_.unshift(ComputeBudgetProgram.setComputeUnitPrice({microLamports:get_priority}));
        }
        let _message_ = new TransactionMessage({payerKey:_wallet_,recentBlockhash:_blockhash_,instructions:_instructions_,}).compileToV0Message(_table_);
        let _tx_ = new VersionedTransaction(_message_);
        if(_signers_!=false){
            _tx_.sign(_signers_);
        }
        if(_serialize_ === true){
            _tx_=_tx_.serialize();
        }
        if(_encode_ === true){
            _tx_= Buffer.from(_tx_).toString("base64");
        }
        if(_serialize_ == false || _encode_ == false){
            _obj_ = _tx_;
        }
        else{
            _obj_.status="ok";
            _obj_.message="success";
            _obj_.transaction=_tx_;
        }
        return _obj_;
    }
}
const _mcswap_ = new mcswap();
export default _mcswap_;