import { Keypair } from "@solana/web3.js";
import { CreateTokenMetadata } from "./types";
import fs from "fs";
import dotenv from "dotenv";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Load environment variables from .env
dotenv.config();

export interface Config {
	wallet: Keypair;
	tokenMetadata: CreateTokenMetadata;
	buyAmount: bigint;
}

export function loadConfig(): Config {
	// Get wallet secret key from .env and create Keypair
	let walletSecret = process.env.WALLET_SECRET;
	if (!walletSecret) {
		throw new Error("WALLET_SECRET not set in .env");
	}
	let wallet = Keypair.fromSecretKey(bs58.decode(walletSecret));

	let tokenName = process.env.TOKEN_NAME;
	let tokenSymbol = process.env.TOKEN_SYMBOL;
	let tokenDescription = process.env.TOKEN_DESCRIPTION;
	// Load token image if path is provided
	const tokenImagePath = process.env.TOKEN_FILE_PATH;
	let token_image: Blob | null = null;
	// buy in floats e.g. 0.1
	let buyAmountSol = process.env.BUY_AMOUNT_SOL;

	if (!tokenName || !tokenSymbol || !tokenDescription || !tokenImagePath || !buyAmountSol) {
		throw new Error("Crucial vals not set in .env");
	}

	let buyAmount = BigInt(buyAmountSol) * 1000_000_000n;

	const imageBuffer = fs.readFileSync(tokenImagePath);
	token_image = new Blob([imageBuffer]);

	// Get token metadata from .env
	let tokenMetadata: CreateTokenMetadata = {
		name: tokenName,
		symbol: tokenSymbol,
		description: tokenDescription,
		file: token_image as Blob
	};

	return {
		wallet,
		tokenMetadata,
		buyAmount,
	};
}
