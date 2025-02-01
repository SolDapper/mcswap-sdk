// name: mcswap-sdk
// author: @SolDapper
// license: MIT https://github.com/SolDapper/mcswap-sdk/blob/master/LICENSE
'use strict';
import { PublicKey, Keypair, Connection, TransactionInstruction, TransactionMessage, VersionedTransaction, ComputeBudgetProgram, SystemProgram, SYSVAR_INSTRUCTIONS_PUBKEY } from "@solana/web3.js";
import * as solanaAccountCompression from "@solana/spl-account-compression";
import BufferLayout from "@solana/buffer-layout";
import * as splToken from "@solana/spl-token";
import bs58 from 'bs58';
import BN from "bn.js";
const publicKey=(property="publicKey")=>{return BufferLayout.blob(32,property);}
const uint64=(property="uint64")=>{return BufferLayout.blob(8,property);}

class mcswap {
    
    constructor(){

        this.NAME = "McSwap Javascript SDK";
        this.PRIORITY = "Low";
        
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
        ]);
        
    }

    // mcswap-spl
    async splCreate(_data_){
        try{
            // ***************************************************************************
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
            if(_data_.seller==_data_.buyer){
                const _error_ = {}
                _error_.status="error";
                _error_.message="buyer seller wallet conflict";
                return _error_;
            }
            // ***************************************************************************
            const connection = new Connection(_data_.rpc,"confirmed");
            const seller = new PublicKey(_data_.seller);
            const buyer = new PublicKey(_data_.buyer);
            // console.log("seller", seller.toString());
            // console.log("buyer", buyer.toString());
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
            // console.log("token1Mint", token1Mint);
            // console.log("token1Amount", token1Amount);
            // console.log("token2Mint", token2Mint);
            // console.log("token2Amount", token2Amount);
            // console.log("token3Mint", token3Mint);
            // console.log("token3Amount", token3Amount);
            // console.log("token4Mint", token4Mint);
            // console.log("token4Amount", token4Amount);
            // console.log("affiliateWallet", affiliateWallet);
            // console.log("affiliateFee", affiliateFee);
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
            // console.log("is_22_1", is_22_1);
            // console.log("is_22_2", is_22_2);
            // console.log("is_22_3", is_22_3);
            // console.log("is_22_4", is_22_4);
            // console.log("SPL_PROGRAM_1", SPL_PROGRAM_1.toString());
            // console.log("SPL_PROGRAM_2", SPL_PROGRAM_2.toString());
            // console.log("SPL_PROGRAM_3", SPL_PROGRAM_3.toString());
            // console.log("SPL_PROGRAM_4", SPL_PROGRAM_4.toString());
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
            else{
                const _error_ = {}
                _error_.status="error";
                _error_.message="Program State Not Initialized!";
                return _error_;
            }
            const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),seller.toBytes(),buyer.toBytes()],new PublicKey(this.SPL_MCSWAP_PROGRAM));
            // console.log("devTreasury", devTreasury.toString());
            // console.log("swapVaultPDA", swapVaultPDA.toString());
            // console.log("swapStatePDA", swapStatePDA[0].toString());
            // ***************************************************************************
            
            let token1Setting = false;
            let token2Setting = false;

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
            // console.log("createToken3ATA", createToken3ATA);
            // console.log("createToken4ATA", createToken4ATA);
            // ***************************************************************************
            
            const totalSize = 1 + 32 + 8 + 8 + 32 + 8 + 32 + 8 + 8;
            // console.log("totalSize", totalSize);
        
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
                // console.log("token 1 - super token extension fee");
                let token1LessFee = token1Amount - (token1Amount * (transferFeeBasisPoints_1 / 100 / 100));
                byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
                for (let index = 0; index < byteArray.length; index ++ ) {
                    byte = token1LessFee & 0xff;
                    byteArray [ index ] = byte;
                    token1LessFee = (token1LessFee - byte) / 256 ;
                }
            }
            else{
                // console.log("token 1 - no extension");
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
                // console.log("token 2 - super token extension fee");
                let token2LessFee = token2Amount - (token2Amount * (transferFeeBasisPoints_2 / 100 / 100));
                byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
                for (let index = 0; index < byteArray.length; index ++ ) {
                    byte = token2LessFee & 0xff;
                    byteArray [ index ] = byte;
                    token2LessFee = (token2LessFee - byte) / 256 ;
                }
            }
            else{
                // console.log("token 2 - no extension");
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

            // console.log("KEYS");
            // console.log("seller:", seller.toString());
            // console.log("programStatePDA:", programStatePDA[0].toString());
            // console.log("swapVaultPDA:", swapVaultPDA.toString());
            // console.log("swapStatePDA:", swapStatePDA[0].toString());
            // console.log("token1Mint:", new PublicKey(token1Mint).toString());
            // console.log("providerToken1ATA:", providerToken1ATA.toString());
            // console.log("token2Mint:", new PublicKey(token2Mint).toString());
            // console.log("providerToken2ATA:", providerToken2ATA.toString());
            // console.log("SystemProgram:", SystemProgram.programId.toString());
            // console.log("TOKEN_PROGRAM_ID:", splToken.TOKEN_PROGRAM_ID.toString());
            // console.log("TOKEN_2022_PROGRAM_ID:", splToken.TOKEN_2022_PROGRAM_ID.toString());
            // console.log("devTreasury:", devTreasury.toString());
            // console.log("affiliateWallet:", new PublicKey(affiliateWallet).toString());

            // console.log("tempToken1Account:", tempToken1Account);
            // console.log("tempToken1:", tempToken1);

            // console.log("tempToken2Account:", tempToken2Account);
            // console.log("tempToken2:", tempToken2);

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
            // console.log("ALT");
            // console.log("lookupTable", lookupTable.toString());
            // ***************************************************************************
            if(createToken3ATA==true && createToken4ATA==true){instructions=[createToken3ATAIx,createToken4ATAIx,initializeSwapIx];}
            else if(createToken3ATA==true){instructions=[createToken3ATAIx,initializeSwapIx];} 
            else if(createToken4ATA==true){instructions=[createToken4ATAIx,initializeSwapIx];} 
            else{instructions=[initializeSwapIx];}
            // ***************************************************************************
            // build transaction
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

            // console.log("_data_.rpc", _data_.rpc);
            // console.log("_data_.seller", _data_.seller);
            // console.log("signers", signers);
            // console.log("lookupTableAccount", lookupTableAccount);
            // console.log("_data_.priority", _data_.priority);

            _tx_.rpc = _data_.rpc;                     
            _tx_.account = _data_.seller;       
            _tx_.instructions = instructions;
            _tx_.signers = signers;
            _tx_.table = lookupTableAccount;                   
            _tx_.priority = _data_.priority;
            return await this.tx(_tx_);
            // build transaction
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
            if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
            if(typeof _data_.signers=="undefined"||_data_.signers==false){_data_.signers=false;}
            const connection = new Connection(_data_.rpc, "confirmed");
            const seller = new PublicKey(_data_.seller);
            const buyer = new PublicKey(_data_.buyer);
            const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")],new PublicKey(this.SPL_MCSWAP_PROGRAM));
            const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],new PublicKey(this.SPL_MCSWAP_PROGRAM));
            // ***************************************************************************
            const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),seller.toBytes(),buyer.toBytes()],new PublicKey(this.SPL_MCSWAP_PROGRAM));
            const swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(){const _error_={};_error_.status="error";_error_.message="Contract Not Found!";return _error_;});
            const encodedSwapStateData = swapState.data;
            const decodedSwapStateData = this.SPL_SWAP_STATE.decode(encodedSwapStateData);
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
            const takerb58=bs58.decode(_data_.buyer);
            const arr=Array.prototype.slice.call(Buffer.from(takerb58),0);
            for (let i=0;i<arr.length;i++){uarray[counter++]=arr[i];}
            const keys = [
                { pubkey: seller, isSigner: true, isWritable: true }, // 0
                { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 1
                { pubkey: swapVaultPDA[0], isSigner: false, isWritable: false }, // 2
                { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 3
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
            if(!lookupTableAccount){
                const _error_ = {}
                _error_.status="error";
                _error_.message="Could not fetch ALT!";
                return _error_;
            }
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
            return await this.tx(_tx_);
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
            // ***************************************************************************
            const connection = new Connection(_data_.rpc, "confirmed");
            const seller = new PublicKey(_data_.seller);
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
            const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),seller.toBytes(),buyer.toBytes()],new PublicKey(this.SPL_MCSWAP_PROGRAM));
            let swapState = null;
            swapState = await connection.getAccountInfo(swapStatePDA[0]);
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
            if(swapState!=null){
                const encodedSwapStateData = swapState.data;
                const decodedSwapStateData = this.SPL_SWAP_STATE.decode(encodedSwapStateData);
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
                { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 4
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
            // console.log("keys: ", keys);
            const executeSwapIx = new TransactionInstruction({programId:new PublicKey(this.SPL_MCSWAP_PROGRAM),data:Buffer.from(uarray),keys:keys});
            const lookupTable = new PublicKey(this.SPL_STATIC_ALT);
            const lookupTableAccount = await connection.getAddressLookupTable(lookupTable).then((res)=>res.value);
            if(!lookupTableAccount){const _error_={};_error_.status="error";_error_.message="Could not fetch ALT!";return _error_;}
            // // ***************************************************************************
            let instructions = [];
            if(createToken1ATA===true && createToken2ATA===true){console.log("ix 1");instructions=[createToken1ATAIx,createToken2ATAIx,executeSwapIx];}
            else if(createToken1ATA===true){console.log("ix 2");instructions=[createToken1ATAIx,executeSwapIx];}
            else if(createToken2ATA===true){console.log("ix 3");instructions=[createToken2ATAIx,executeSwapIx];}
            else{console.log("ix 4");instructions=[executeSwapIx];}
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
            return await this.tx(_tx_);
            // build transaction
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
            accounts = await connection.getParsedProgramAccounts(SPL_ProgramId,{filters:[{dataSize:297,},{memcmp:{offset:185,bytes:wallet,},},],}).catch(function(){});
            if(accounts != null){for(let i=0;i<accounts.length;i++){
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
                  if(typeof _data_.display!="undefined"&&_data_.display===true){
                    const token_1_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_1_amount,"mint":record.token_1_mint,"display":_data_.display});
                    const token_2_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_2_amount,"mint":record.token_2_mint,"display":_data_.display});
                    const token_3_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_3_amount,"mint":record.token_3_mint,"display":_data_.display});
                    const token_4_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_4_amount,"mint":record.token_4_mint,"display":_data_.display});
                    record.token_1_amount = token_1_amount.data;
                    record.token_2_amount = token_2_amount.data;
                    record.token_3_amount = token_3_amount.data;
                    record.token_4_amount = token_4_amount.data;
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
            const _result_ = {}
            let connection = new Connection(_data_.rpc, "confirmed");
            const _wallet_ = new PublicKey(_data_.wallet);
            const wallet = _wallet_.toString();
            const SPL_ProgramId = new PublicKey(this.SPL_MCSWAP_PROGRAM);
            let SPL_SENT = [];
            let accounts = null;
            accounts = await connection.getParsedProgramAccounts(SPL_ProgramId,{filters:[{dataSize:297,},{memcmp:{offset:9,bytes:wallet,},},],}).catch(function(){});
            if(accounts != null){for(let i=0;i<accounts.length;i++){
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
                    if(typeof _data_.display!="undefined"&&_data_.display===true){
                    const token_1_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_1_amount,"mint":record.token_1_mint,"display":_data_.display});
                    const token_2_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_2_amount,"mint":record.token_2_mint,"display":_data_.display});
                    const token_3_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_3_amount,"mint":record.token_3_mint,"display":_data_.display});
                    const token_4_amount = await this.convert({"rpc":_data_.rpc,"amount":record.token_4_amount,"mint":record.token_4_mint,"display":_data_.display});
                    record.token_1_amount = token_1_amount.data;
                    record.token_2_amount = token_2_amount.data;
                    record.token_3_amount = token_3_amount.data;
                    record.token_4_amount = token_4_amount.data;
                    }
                    SPL_SENT.push(record);
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
            let buyer = new PublicKey(taker);
            if(typeof _data_.buyer!="undefined"&&_data_.buyer!=false&&_data_.buyer!=""){buyer=new PublicKey(_data_.buyer);}else{_data_.buyer=taker;}
            // ***************************************************************************
            let isSwap = true;
            if(typeof _data_.buyerMint=="undefined"||typeof _data_.buyerMint==false||_data_.buyerMint==""){_data_.buyerMint="11111111111111111111111111111111";isSwap=false;}
            if(typeof _data_.tokenMint=="undefined"||typeof _data_.tokenMint==false||_data_.tokenMint==""){_data_.units=0;_data_.tokenMint="11111111111111111111111111111111";}
            if(typeof _data_.lamports=="undefined"||typeof _data_.lamports==false){_data_.lamports=0;}
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
            const totalSize = 1 + 1 + 32 + 32 + 8 + 32 + 8 + 8;
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
            // build transaction
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
            return await this.tx(_tx_);
            // ***************************************************************************
        }
        catch(err){
            const _error_ = {}
            _error_.status="error";
            _error_.message=err;
            return _error_;
        }
    }

    // async coreCancel(_data_){
    //     try{
    //         // ***************************************************************************
    //         if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
    //         if(typeof _data_.buyerMint=="undefined"||_data_.buyerMint===false){_data_.buyerMint="11111111111111111111111111111111";}
    //         if(typeof _data_.sellerMint=="undefined"||_data_.sellerMint===false){
    //             const _error_ = {}
    //             _error_.status="error";
    //             _error_.message="seller nft mint not defined";
    //             return _error_;
    //         }
    //         const connection = new Connection(_data_.rpc, "confirmed");
    //         const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],new PublicKey(this.CORE_MCSWAP_PROGRAM));
    //         const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(_data_.sellerMint).toBytes(),new PublicKey(_data_.buyerMint).toBytes()],new PublicKey(this.MCSWAP_CORE_PROGRAM));
    //         let assetCollection = new PublicKey("11111111111111111111111111111111");
    //         const response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
    //         body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":_data_.sellerMint}})});
    //         const getAsset = await response.json();
    //         if(typeof getAsset.result.grouping!="undefined"&&typeof getAsset.result.grouping[0]!="undefined"&&typeof getAsset.result.grouping[0].group_value!="undefined"){assetCollection = getAsset.result.grouping[0].group_value;}
    //         const totalSize = 1 + 32;
    //         let uarray = new Uint8Array(totalSize);    
    //         let counter = 0;    
    //         uarray[counter++] = 2;
    //         const swapAssetb58 = bs58.decode(_data_.buyerMint);
    //         const arr = Array.prototype.slice.call(Buffer.from(swapAssetb58), 0);
    //         for(let i = 0; i < arr.length; i++) {uarray[counter++] = arr[i];}
    //         const keys = [
    //           { pubkey: new PublicKey(_data_.seller), isSigner: true, isWritable: true }, // 0
    //           { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 1
    //           { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 2
    //           { pubkey: new PublicKey(_data_.sellerMint), isSigner: false, isWritable: true }, // 3
    //           { pubkey: new PublicKey(assetCollection), isSigner: false, isWritable: true }, // 4
    //           { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 5
    //           { pubkey: new PublicKey(this.CORE_PROGRAM), isSigner: false, isWritable: false }, // 6
    //         ];
    //         const reverseSwapIx = new TransactionInstruction({programId:new PublicKey(this.CORE_MCSWAP_PROGRAM),data:Buffer.from(uarray),keys:keys});
    //         const instructions = [reverseSwapIx];
    //         // ***************************************************************************
    //         const _tx_ = {};
    //         if(typeof _data_.tolerance!="undefined"){
    //             _tx_.tolerance = _data_.tolerance;              
    //         }
    //         if(typeof _data_.blink!="undefined"&&_data_.blink===true){
    //             _tx_.serialize = true;              
    //             _tx_.encode = true; 
    //             _tx_.compute = false;
    //             _tx_.fees = false;
    //         }
    //         else{
    //             _tx_.serialize = false;              
    //             _tx_.encode = false;
    //             _tx_.compute = true;
    //             _tx_.fees = true;
    //         }
    //         _tx_.rpc = _data_.rpc;                     
    //         _tx_.account = _data_.seller;       
    //         _tx_.instructions = instructions;
    //         _tx_.signers = _data_.signers;
    //         _tx_.table = lookupTableAccount;  
    //         _tx_.priority = _data_.priority;
    //         return await this.tx(_tx_);
    //         // ***************************************************************************
    //     }
    //     catch(err){
    //         const _error_ = {}
    //         _error_.status="error";
    //         _error_.message=err;
    //         return _error_;
    //     }
    // }

    // async coreExecute(_data_){
    //     try{
    //         // ***************************************************************************
    //         if(typeof _data_.priority=="undefined"||_data_.priority===false){_data_.priority=this.PRIORITY;}
    //         if(typeof _data_.signers=="undefined"||_data_.signers==false){_data_.signers=false;}
    //         let affiliateWallet = this.TREASURY;
    //         let affiliateFee = 0;
    //         if(typeof _data_.affiliateWallet!="undefined" && _data_.affiliateWallet!=false && 
    //         typeof _data_.affiliateFee!="undefined" && _data_.affiliateFee!=false && _data_.affiliateFee>0){
    //             affiliateWallet = _data_.affiliateWallet;
    //             affiliateFee = _data_.affiliateFee;
    //         }
    //         if(typeof _data_.convert!="undefined"&&_data_.convert===true&&typeof _data_.affiliateFee!="undefined"&&_data_.affiliateFee!=false&&_data_.affiliateFee>0){
    //             let affiliate_ = await this.convert({"rpc":_data_.rpc,"amount":_data_.affiliateFee,"mint":"So11111111111111111111111111111111111111112"});
    //             affiliateFee = affiliate_.data;
    //             _data_.affiliateFee = affiliate_.data;
    //         }
    //         if(typeof _data_.buyerMint=="undefined"||_data_.buyerMint==false){_data_.buyerMint="11111111111111111111111111111111";}
    //         // ***************************************************************************
    //         const connection = new Connection(_data_.rpc,"confirmed");
    //         const programStatePDA = PublicKey.findProgramAddressSync([Buffer.from("program-state")],new PublicKey(this.CORE_MCSWAP_PROGRAM));
    //         const programState = await connection.getAccountInfo(programStatePDA[0]).catch(function(){});
    //         const encodedProgramStateData = programState.data;
    //         const decodedProgramStateData = this.CORE_PROGRAM_STATE.decode(encodedProgramStateData);
    //         const devTreasury = new PublicKey(decodedProgramStateData.dev_treasury);
    //         const swapVaultPDA = PublicKey.findProgramAddressSync([Buffer.from("swap-vault")],new PublicKey(this.MCSWAP_CORE_PROGRAM));
    //         const swapStatePDA = PublicKey.findProgramAddressSync([Buffer.from("swap-state"),new PublicKey(_data_.sellerMint).toBytes(),new PublicKey(_data_.buyerMint).toBytes()],new PublicKey(this.CORE_MCSWAP_PROGRAM)); 
    //         const swapState = await connection.getAccountInfo(swapStatePDA[0]).catch(function(error){});
    //         let isSwap = true;
    //         const encodedSwapStateData = swapState.data;
    //         const decodedSwapStateData = this.CORE_SWAP_STATE.decode(encodedSwapStateData);
    //         if(new BN(decodedSwapStateData.is_swap, 10, "le") == 0){isSwap = false;}
    //         const initializer = new PublicKey(decodedSwapStateData.initializer);
    //         const initializerAsset = new PublicKey(decodedSwapStateData.initializer_asset);
    //         const swapLamports = new BN(decodedSwapStateData.swap_lamports, 10, "le");
    //         const swapTokenMint = new PublicKey(decodedSwapStateData.swap_token_mint);
    //         const swapTokens = new BN(decodedSwapStateData.swap_tokens, 10, "le");
    //         // ***************************************************************************

    //         let assetCollection = new PublicKey("11111111111111111111111111111111");
    //         const response = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
    //         body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":_data_.sellerMint}})});
    //         const getAsset = await response.json();
    //         if(typeof getAsset.result.grouping!="undefined"&&typeof getAsset.result.grouping[0]!="undefined"&&typeof getAsset.result.grouping[0].group_value!="undefined"){
    //         assetCollection = getAsset.result.grouping[0].group_value;}

    //         let swapAssetCollection = new PublicKey("11111111111111111111111111111111");
    //         if(_data_.buyerMint!="11111111111111111111111111111111"){  
    //             const resp = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
    //             body:JSON.stringify({"jsonrpc":"2.0","id":"text","method":"getAsset","params":{"id":_data_.buyerMint}})});
    //             const getAss = await resp.json();
    //             if(typeof getAss.result.grouping!="undefined"&&typeof getAss.result.grouping[0]!="undefined"&&typeof getAss.result.grouping[0].group_value!="undefined"){
    //             swapAssetCollection = getAss.result.grouping[0].group_value;}
    //         }

    //         let CORE_TOKEN_PROGRAM = splToken.TOKEN_PROGRAM_ID;
    //         if(swapTokenMint.toString()!="11111111111111111111111111111111"){  
    //             const resp_ = await fetch(_data_.rpc,{method:'POST',headers:{"Content-Type":"application/json"},
    //             body:JSON.stringify({"jsonrpc":"2.0","id":"1A","method":"getAsset","params":{"id":swapTokenMint.toString()}})});
    //             const getAss_ = await resp_.json();
    //             if(typeof getAss_.result.mint_extensions!="undefined"){CORE_TOKEN_PROGRAM=splToken.TOKEN_2022_PROGRAM_ID;}
    //         }

    //         const buyerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,new PublicKey(_data_.buyer),false,CORE_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
    //         const sellerTokenATA = await splToken.getAssociatedTokenAddress(swapTokenMint,initializer,false,CORE_TOKEN_PROGRAM,splToken.ASSOCIATED_TOKEN_PROGRAM_ID);
    //         // ***************************************************************************

    //         const totalSize = 1;
    //         let uarray = new Uint8Array(totalSize);    
    //         let counter = 0;    
    //         uarray[counter++] = 1;
    //         const keys = [
    //             { pubkey: new PublicKey(_data_.buyer), isSigner: true, isWritable: true }, // 0
    //             { pubkey: initializer, isSigner: false, isWritable: true }, // 1
    //             { pubkey: programStatePDA[0], isSigner: false, isWritable: false }, // 2
    //             { pubkey: swapVaultPDA[0], isSigner: false, isWritable: true }, // 3
    //             { pubkey: swapStatePDA[0], isSigner: false, isWritable: true }, // 4
    //             { pubkey: new PublicKey(_data_.sellerMint), isSigner: false, isWritable: true }, // 5
    //             { pubkey: new PublicKey(assetCollection), isSigner: false, isWritable: true }, // 6
    //             { pubkey: new PublicKey(_data_.buyerMint), isSigner: false, isWritable: true }, // 7
    //             { pubkey: new PublicKey(swapAssetCollection), isSigner: false, isWritable: true }, // 8
    //             { pubkey: providerTokenATA, isSigner: false, isWritable: true }, // 9
    //             { pubkey: new PublicKey(swapTokenMint), isSigner: false, isWritable: true }, // 10  HERE
    //             { pubkey: initializerTokenATA, isSigner: false, isWritable: true }, // 11
    //             { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }, // 12
    //             { pubkey: new PublicKey(this.CORE_PROGRAM_ID), isSigner: false, isWritable: false }, // 13
    //             { pubkey: splToken.TOKEN_PROGRAM_ID, isSigner: false, isWritable: false }, // 14
    //             { pubkey: splToken.TOKEN_2022_PROGRAM_ID, isSigner: false, isWritable: false }, // 15  HERE
    //             { pubkey: devTreasury, isSigner: false, isWritable: true }, // 16
    //             { pubkey: mcDegensTreasury, isSigner: false, isWritable: true }, // 17
    //         ];
    //         const swapNFTsIx = new TransactionInstruction({programId:new PublicKey(this.MCSWAP_CORE_PROGRAM),data:Buffer.from(uarray),keys:keys});
    //         const instructions = [swapNFTsIx];
    //         // build transaction
    //         const _tx_ = {};
    //         if(typeof _data_.blink!="undefined"&&_data_.blink===true){
    //             _tx_.serialize = true;              
    //             _tx_.encode = true; 
    //             _tx_.fees = false;   
    //         }
    //         else{
    //             _tx_.serialize = false;              
    //             _tx_.encode = false;
    //             _tx_.fees = true;   
    //         }
    //         if(typeof _data_.compute=="undefined"||_data_.compute===true){_tx_.compute=true;}else{_tx_.compute=false;} 
    //         _tx_.rpc = _data_.rpc;                     
    //         _tx_.account = _data_.buyer;           
    //         _tx_.instructions = instructions;   
    //         _tx_.signers = false;                
    //         _tx_.table = false;  
    //         _tx_.tolerance = 1.2;                     
    //         _tx_.priority = _data_.priority; 
    //         return await this.tx(_tx_);
    //         // build transaction
    //     }
    //     catch(err){
    //         const _error_ = {}
    //         _error_.status="error";
    //         _error_.message=err;
    //         return _error_;
    //     }
    // }











    
    async fetch(_data_){
        try{
            const _result_={}
            if(typeof _data_.standard=="undefined"){_result_.status="error";_result_.message="requires standard parameter";return;}
            let PROGRAM;
            let STATE;
            let NAME;
            const connection=new Connection(_data_.rpc,"confirmed");
            if(_data_.standard=="spl"){
                PROGRAM = this.SPL_MCSWAP_PROGRAM;
                STATE = this.SPL_SWAP_STATE;
                NAME = "swap-state";
                if(typeof _data_.seller=="undefined"||_data_.seller==""||typeof _data_.buyer=="undefined"||_data_.buyer==""){
                    _result_.status="error";
                    _result_.message="seller and buyer required";
                    return _result_;
                }
                const STATE_PDA=PublicKey.findProgramAddressSync([Buffer.from(NAME),new PublicKey(_data_.seller).toBytes(),new PublicKey(_data_.buyer).toBytes()],new PublicKey(PROGRAM));
                const SWAP_STATE=await connection.getAccountInfo(new PublicKey(STATE_PDA[0]));
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
                if(typeof _data_.display!="undefined"&&_data_.display===true){
                    const token1Amount=await this.convert({"rpc":_data_.rpc,"amount":_result_.token1Amount,"mint":_result_.token1Mint,"display":_data_.display});
                    const token2Amount=await this.convert({"rpc":_data_.rpc,"amount":_result_.token2Amount,"mint":_result_.token2Mint,"display":_data_.display});
                    const token3Amount=await this.convert({"rpc":_data_.rpc,"amount":_result_.token3Amount,"mint":_result_.token3Mint,"display":_data_.display});
                    const token4Amount=await this.convert({"rpc":_data_.rpc,"amount":_result_.token4Amount,"mint":_result_.token4Mint,"display":_data_.display});
                    _result_.token1Amount=token1Amount.data;
                    _result_.token2Amount=token2Amount.data;
                    _result_.token3Amount=token3Amount.data;
                    _result_.token4Amount=token4Amount.data;
                    _result_.token1Symbol=token1Amount.symbol;
                    _result_.token2Symbol=token2Amount.symbol;
                    _result_.token3Symbol=token3Amount.symbol;
                    _result_.token4Symbol=token4Amount.symbol;
                    _result_.token1Decimals=token1Amount.decimals;
                    _result_.token2Decimals=token2Amount.decimals;
                    _result_.token3Decimals=token3Amount.decimals;
                    _result_.token4Decimals=token4Amount.decimals;
                    if(typeof _result_.token2Amount=="undefined"){_result_.token2Amount=0;_result_.token2Decimals=0;_result_.token2Symbol="-";}
                    if(typeof _result_.token4Amount=="undefined"){_result_.token4Amount=0;_result_.token4Decimals=0;_result_.token4Symbol="-";}
                }
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
                    NAME = "cNFT-swap";
                }
                else if(_data_.standard=="pnft"){
                    PROGRAM = this.PNFT_MCSWAP_PROGRAM;
                    STATE = this.PNFT_SWAP_STATE;
                    NAME = "swap-state";
                }
                if(typeof _data_.buyerMint=="undefined"||_data_.buyerMint==""||_data_.buyerMint==false){_data_.buyerMint="11111111111111111111111111111111";}
                const STATE_PDA=PublicKey.findProgramAddressSync([Buffer.from(NAME),new PublicKey(_data_.sellerMint).toBytes(),new PublicKey(_data_.buyerMint).toBytes()],new PublicKey(PROGRAM));
                const SWAP_STATE=await connection.getAccountInfo(STATE_PDA[0]).catch(function(){});
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
                if(typeof _data_.display!="undefined"&&_data_.display===true){
                    const lamports=await this.convert({"rpc":_data_.rpc,"amount":_result_.lamports,"mint":"So11111111111111111111111111111111111111112","display":_data_.display});
                    const units=await this.convert({"rpc":_data_.rpc,"amount":_result_.units,"mint":_result_.tokenMint,"display":_data_.display});
                    _result_.lamports=lamports.data;
                    _result_.units=units.data;
                    _result_.symbol=units.symbol;
                    _result_.decimals=units.decimals;
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
                NAME = "cNFT-program-state";
            }
            else if(_data_.standard=="pnft"){
                PROGRAM = this.PNFT_MCSWAP_PROGRAM;
                STATE = this.PNFT_PROGRAM_STATE;
                NAME = "program-state";
            }
            const FEE_PROGRAM_PDA=PublicKey.findProgramAddressSync([Buffer.from(NAME)],new PublicKey(PROGRAM));
            const FEE_PROGRAM_STATE=await connection.getAccountInfo(FEE_PROGRAM_PDA[0]).catch(function(){});
            const decodedData=STATE.decode(FEE_PROGRAM_STATE.data);
            let lamports;
            if(_data_.standard=="spl"){lamports=parseInt(new BN(decodedData.dev_lamports,10,"le").toString());}
            else{lamports=parseInt(new BN(decodedData.fee_lamports,10,"le").toString());}
            if(typeof _data_.display!="undefined" && _data_.display===true){return Number.parseFloat(lamports/1000000000).toFixed(9);}else{return lamports;}
    }
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
        // console.log("simulation", opti_cu_res);
        if(opti_cu_res.value.err != null){
            return {"status":"error","message":"simulation error","details":opti_cu_res.value.err,"logs":opti_cu_res.value.logs}
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
        if(data < 10000){data = 10000;}
        console.log("fee estimate", data);
        return data;
    }
    async tx(_data_){
        let _obj_={};let _rpc_;let _account_;let _instructions_;let _signers_;let _priority_;let _tolerance_;let _serialize_;let _encode_;let _table_;let _compute_;let _fees_;
        if(typeof _data_.rpc=="undefined"){_obj_.message="missing rpc";return _obj_;}else{_rpc_=_data_.rpc;}
        if(typeof _data_.account=="undefined"){_obj_.message="missing account";return _obj_;}else{_account_=_data_.account;}
        if(typeof _data_.instructions=="undefined"){_obj_.message="missing instructions";return _obj_;}else{_instructions_=_data_.instructions;}
        if(typeof _data_.signers=="undefined" || _data_.signers==false){_signers_=false;}else{_signers_=_data_.signers;}
        if(typeof _data_.priority=="undefined"){_priority_="Low";}else{_priority_=_data_.priority;}
        if(typeof _data_.tolerance=="undefined"){_tolerance_="1.1";}else{_tolerance_=_data_.tolerance;}
        if(typeof _data_.serialize=="undefined"){_serialize_=false;}else{_serialize_=_data_.serialize;}
        if(typeof _data_.encode=="undefined"){_encode_=false;}else{_encode_=_data_.encode;}
        if(typeof _data_.compute=="undefined"){_compute_=true;}else{_compute_=_data_.compute;}
        if(typeof _data_.fees=="undefined"){_fees_=true;}else{_fees_=_data_.fees;}
        if(typeof _data_.table=="undefined" || _data_.table==false){_table_=[];}else{_table_=[_data_.table];}
        const _wallet_= new PublicKey(_account_);
        const connection = new Connection(_rpc_,"confirmed");
        const _blockhash_ = (await connection.getLatestBlockhash('confirmed')).blockhash;
        if(_priority_=="Extreme"){_priority_="VeryHigh";}
        let _payer_={publicKey:_wallet_}
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
            // _obj_.status="ok";
            // _obj_.message="success";
            // _obj_.tx=_tx_;
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