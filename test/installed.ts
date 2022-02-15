import { config } from "dotenv";
config();
import { AUCTIONClient, utils, constants } from "../src";
import { parseTokenMeta, sleep, getDeploy } from "./utils";

import {
	CLValueBuilder,
	Keys,
	CLPublicKey,
	CLAccountHash,
	CLPublicKeyType,
} from "casper-js-sdk";

const { AUCTIONEvents } = constants;

const {

	NODE_ADDRESS,
	EVENT_STREAM_ADDRESS,
	CHAIN_NAME,

	MASTER_KEY_PAIR_PATH,
	CONTRACT_NAME,
	RESERVE_WISE_PAYMENT_AMOUNT,

	CREATED_AT,
	SLUG,
	ID,
	CURRENT_PRICE,
	STATUS,
	EXPIRES_AT,
	START_PRICE,
	CURRENT_WINNER_ID,
	INVENTORY_ITEM_ID,
	PAYMENT_CONFIRMATION,
	MASS_OF_ITEM,
	TAX_BY_MASS_OF_ITEM,
	SALES_TAX,
	EXCISE_RATE,
	TOTAL_PRICE,
	USER_ID,
	TITLE,
	DESCRIPTION,
	IMAGE_ID,
	SMALL_IMAGE,
	LARGE_IMAGE,
	VERSION,
	SIMPLE_AUCTION_CONTRACT_HASH
} = process.env;

const KEYS = Keys.Ed25519.parseKeyFiles(
	`${MASTER_KEY_PAIR_PATH}/public_key.pem`,
	`${MASTER_KEY_PAIR_PATH}/secret_key.pem`
);

const auction = new AUCTIONClient(
	NODE_ADDRESS!,
	CHAIN_NAME!,
	EVENT_STREAM_ADDRESS!
);

const test = async () => {
	
	await auction.setContractHash(SIMPLE_AUCTION_CONTRACT_HASH!);

	console.log("... Contract Hash:",SIMPLE_AUCTION_CONTRACT_HASH!);

	const store_deploy = await auction.store(
		KEYS,
		CREATED_AT!,
		SLUG!,
		ID!,
		CURRENT_PRICE!,
		STATUS!,
		EXPIRES_AT!,
		START_PRICE!,
		CURRENT_WINNER_ID!,
		INVENTORY_ITEM_ID!,
		PAYMENT_CONFIRMATION!,
		MASS_OF_ITEM!,
		TAX_BY_MASS_OF_ITEM!,
		SALES_TAX!,
		EXCISE_RATE!,
		TOTAL_PRICE!,
		USER_ID!,
		TITLE!,
		DESCRIPTION!,
		IMAGE_ID!,
		SMALL_IMAGE!,
		LARGE_IMAGE!,
		VERSION!,
		RESERVE_WISE_PAYMENT_AMOUNT!
	);
	console.log("... store deploy hash: ", store_deploy);

	await getDeploy(NODE_ADDRESS!, store_deploy);
	console.log("... store created successfully");

	// const update = await auction.update(
	// 	KEYS,
	// 	CREATED_AT!,
	// 	SLUG!,
	// 	ID!,
	// 	CURRENT_PRICE!,
	// 	STATUS!,
	// 	EXPIRES_AT!,
	// 	START_PRICE!,
	// 	CURRENT_WINNER_ID!,
	// 	INVENTORY_ITEM_ID!,
	// 	PAYMENT_CONFIRMATION!,
	// 	MASS_OF_ITEM!,
	// 	TAX_BY_MASS_OF_ITEM!,
	// 	SALES_TAX!,
	// 	EXCISE_RATE!,
	// 	TOTAL_PRICE!,
	// 	USER_ID!,
	// 	TITLE!,
	// 	DESCRIPTION!,
	// 	IMAGE_ID!,
	// 	SMALL_IMAGE!,
	// 	LARGE_IMAGE!,
	// 	VERSION!,
	// 	RESERVE_WISE_PAYMENT_AMOUNT!
	// );
	// console.log("... update deploy hash: ", update);
	// await getDeploy(NODE_ADDRESS!, update);
	// console.log("... update created successfully");
	// /*=========================Getters=========================*/

	// const get_data = await auction.get_data(ID!);
	// console.log(`... Contract get_data: ${get_data}`);
};

test();
