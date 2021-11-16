import { config } from "dotenv";
config();
import { WISETokenClient, utils, constants } from "../src";
import { parseTokenMeta, sleep, getDeploy } from "./utils";

import {
	CLValueBuilder,
	Keys,
	CLPublicKey,
	CLAccountHash,
	CLPublicKeyType,
} from "casper-js-sdk";

const { WISEEvents } = constants;

const {
	NODE_ADDRESS,
	EVENT_STREAM_ADDRESS,
	CHAIN_NAME,
	WASM_PATH,
	MASTER_KEY_PAIR_PATH,
	RECEIVER_ACCOUNT_ONE,
	INSTALL_PAYMENT_AMOUNT,
	SET_FEE_TO_PAYMENT_AMOUNT,
	SET_FEE_TO_SETTER_PAYMENT_AMOUNT,
	CREATE_PAIR_PAYMENT_AMOUNT,
	CONTRACT_NAME,
	RESERVE_WISE_PAYMENT_AMOUNT,
	IMMUTABLE_TRANSFORMER,
	TRANSFORMER_PURSE,
	EQUALIZER_ADDRESS,
	INVESTOR_ADDRESS,
	AMOUNT,
	LOCK_DAYS,
	PURSE,
	TOKEN_ADDRESS,
	TOKEN_AMOUNT,
} = process.env;

const KEYS = Keys.Ed25519.parseKeyFiles(
	`${MASTER_KEY_PAIR_PATH}/public_key.pem`,
	`${MASTER_KEY_PAIR_PATH}/secret_key.pem`
);

const test = async () => {
	const wise = new WISETokenClient(
		NODE_ADDRESS!,
		CHAIN_NAME!,
		EVENT_STREAM_ADDRESS!
	);

	// const listener = liquidity.onEvent(
	// 	[
	// 		LIQUIDITYEvents.SetFeeTo,
	// 		LIQUIDITYEvents.SetFeeToSetter,
	// 		LIQUIDITYEvents.CreatePair,
	// 	],
	// 	(eventName, deploy, result) => {
	// 		if (deploy.success) {
	// 			console.log(
	// 				`Successfull deploy of: ${eventName}, deployHash: ${deploy.deployHash}`
	// 			);
	// 			console.log(result.value());
	// 		} else {
	// 			console.log(
	// 				`Failed deploy of ${eventName}, deployHash: ${deploy.deployHash}`
	// 			);
	// 			console.log(`Error: ${deploy.error}`);
	// 		}
	// 	}
	// );

	await sleep(5 * 1000);

	let accountInfo = await utils.getAccountInfo(NODE_ADDRESS!, KEYS.publicKey);

	console.log(`... Account Info: `);
	console.log(JSON.stringify(accountInfo, null, 2));

	const contractHash = await utils.getAccountNamedKeyValue(
		accountInfo,
		`${CONTRACT_NAME!}_contract_hash`
	);

	console.log(`... Contract Hash: ${contractHash}`);

	// We don't need hash- prefix so i'm removing it
	// await liquidity.setContractHash(contractHash.slice(5));

	const setLiquidityTransfomer = await wise.setLiquidityTransfomer(
		KEYS,
		IMMUTABLE_TRANSFORMER!,
		TRANSFORMER_PURSE!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log(
		"... setLiquidityTransfomer deploy hash: ",
		setLiquidityTransfomer
	);
	await getDeploy(NODE_ADDRESS!, setLiquidityTransfomer);
	console.log("... setLiquidityTransfomer created successfully");

	const setBusd = await wise.setBusd(
		KEYS,
		EQUALIZER_ADDRESS!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... setBusd deploy hash: ", setBusd);
	await getDeploy(NODE_ADDRESS!, setBusd);
	console.log("... setBusd created successfully");

	const renounceKeeper = await wise.renounceKeeper(
		KEYS,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... renounceKeeper deploy hash: ", renounceKeeper);
	await getDeploy(NODE_ADDRESS!, renounceKeeper);
	console.log(".PURSE.. renounceKeeper createINVESTMENT_DAYd successfully");

	const mintSupply = await wise.mintSupply(
		KEYS,
		INVESTOR_ADDRESS!,
		AMOUNT!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... mintSupply deploy hash: ", mintSupply);
	await getDeploy(NODE_ADDRESS!, mintSupply);
	console.log("... mintSupply created successfully");

	const extendLtAuction = await wise.extendLtAuction(
		KEYS,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... extendLtAuction deploy hash: ", extendLtAuction);
	await getDeploy(NODE_ADDRESS!, extendLtAuction);
	console.log("... extendLtAuction created successfully");

	/*=========================Getters=========================*/

	const createStakeWithBnb = await wise.createStakeWithBnb(
		LOCK_DAYS,
		KEYS.publicKey,
		AMOUNT,
		PURSE
	);
	console.log(`... Contract createStakeWithBnb: ${createStakeWithBnb}`);

	const createStakeWithToken = await wise.createStakeWithToken(
		KEYS.publicKey,
		TOKEN_AMOUNT,
		LOCK_DAYS,
		KEYS.publicKey
	);
	console.log(`... Contract createStakeWithToken: ${createStakeWithToken}`);

	const getPairAddress = await wise.getPairAddress();
	console.log(`... Contract getPairAddress: ${getPairAddress}`);

	const getTotalStaked = await wise.getTotalStaked();
	console.log(`... Contract getTotalStaked: ${getTotalStaked}`);

	const getLiquidityTransformer = await wise.getLiquidityTransformer();
	console.log(
		`... Contract getLiquidityTransformer: ${getLiquidityTransformer}`
	);

	const getSyntheticTokenAddress = await wise.getSyntheticTokenAddress();
	console.log(
		`... Contract getSyntheticTokenAddress: ${getSyntheticTokenAddress}`
	);
};

test();
