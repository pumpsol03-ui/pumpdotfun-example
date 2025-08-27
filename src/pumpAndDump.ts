import { Keypair, Connection } from "@solana/web3.js";
import { PumpFunSDK } from "pumpdotfun-sdk-v3.0";
import { loadConfig } from "./config";
import { AnchorProvider, Wallet } from "@coral-xyz/anchor";

// This example interacts directly with pumpdotfun-sdk-v3.0
// Using instructions would still work the same as described in the package's readme.

async function pumpAndDump() {
	let connection = new Connection(process.env.HELIUS_RPC_URL || "");

	let anchor_wallet = new Wallet(new Keypair());
	const provider = new AnchorProvider(connection, anchor_wallet, {
		commitment: "finalized",
	});

	let pumpfunClient = new PumpFunSDK(provider);

	// Load configuration from environment variables
	const config = loadConfig();
	const { wallet, tokenMetadata, buyAmount } = config;

	// STEP 1 - Create The Token
	//
	// Generate a new mint keypair for the token
	let mintKeypair = Keypair.generate();

	// create token - buy amount set to zero so this will only create the token & not buy.
	let token = await pumpfunClient.createAndBuy(wallet, mintKeypair, tokenMetadata, 0n);
	let token_mint = mintKeypair.publicKey.toBase58();

	console.log("Token created successfully!");
	console.log("Token Mint:", token_mint);
	console.log("https://solscan.io/tx/", token.signature);


	const buyResult = await pumpfunClient.buy(
		wallet,
		mintKeypair.publicKey,
		buyAmount
	);
	console.log("Buy Successful: https://solscan.io/tx/", buyResult.signature);

	// To get the sell amount - fetch the token balance or more effectively track your wallet via wss/grpc to extract the buy amount.
	let sellAmount: bigint = 0n;
	const sellResult = await pumpfunClient.sell(
		wallet,
		mintKeypair.publicKey,
		sellAmount
	);
	console.log("Sell Successful: https://solscan.io/tx/", sellResult.signature);

}

// Execute the bundler function
pumpAndDump().catch(console.error);
