import {
	CasperClient,
	CLPublicKey,
	CLAccountHash,
	CLByteArray,
	CLKey,
	CLString,
	CLTypeBuilder,
	CLValue,
	CLValueBuilder,
	CLValueParsers,
	CLMap,
	DeployUtil,
	EventName,
	EventStream,
	Keys,
	RuntimeArgs,
	CLURef,
	decodeBase16,
	AccessRights,
	CLU64,
	CLU256,
} from "casper-js-sdk";
import { AUCTIONEvents } from "./constants";
import * as utils from "./utils";
import { RecipientType, IPendingDeploy } from "./types";
// const axios = require("axios").default;

class AUCTIONClient {

	private contractName: string = "AUCTION";
	private contractHash: string = "AUCTION";
	private contractPackageHash: string = "AUCTION";

	private isListening = false;
	private pendingDeploys: IPendingDeploy[] = [];

	constructor(
		private nodeAddress: string,
		private chainName: string,
		private eventStreamAddress?: string
	) {}

	public async install(
		keys: Keys.AsymmetricKey,

		// _bep20: string,
		// uniswapFactory: string,
		// syntheticHelper: string,
		// syntheticToken: string,
		contractName: string,
		paymentAmount: string,
		wasmPath: string
	) {
		// const bep20 = new CLByteArray(Uint8Array.from(Buffer.from(_bep20, "hex")));

		// const uniswap_factory = new CLByteArray(
		// 	Uint8Array.from(Buffer.from(uniswapFactory, "hex"))
		// );
		// const synthetic_helper = new CLByteArray(
		// 	Uint8Array.from(Buffer.from(syntheticHelper, "hex"))
		// );
		// const synthetic_token = new CLByteArray(
		// 	Uint8Array.from(Buffer.from(syntheticToken, "hex"))
		// );

		const runtimeArgs = RuntimeArgs.fromMap({
			contract_name: CLValueBuilder.string(contractName),
			// bep20: CLValueBuilder.key(bep20),
			// uniswap_factory: CLValueBuilder.key(uniswap_factory),
			// synthetic_helper: CLValueBuilder.key(synthetic_helper),
			// synthetic_token: CLValueBuilder.key(synthetic_token),
		});

		const deployHash = await installWasmFile({
			chainName: this.chainName,
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys,
			pathToContract: wasmPath,
			runtimeArgs,
		});

		if (deployHash !== null) {
			return deployHash;
		} else {
			throw Error("Problem with installation");
		}
	}
	public async setContractHash(hash: string) {
		const stateRootHash = await utils.getStateRootHash(this.nodeAddress);
		const contractData = await utils.getContractData(
		  this.nodeAddress,
		  stateRootHash,
		  hash
		);
	
		const { contractPackageHash, namedKeys } = contractData.Contract!;
		this.contractHash = hash;
		this.contractPackageHash = contractPackageHash.replace(
		  "contract-package-wasm",
		  ""
		);
		const LIST_OF_NAMED_KEYS = [
		  'balances',
		  'nonces',
		  'allowances',
		  `${this.contractName}_package_hash`,
		  `${this.contractName}_package_hash_wrapped`,
		  `${this.contractName}_contract_hash`,
		  `${this.contractName}_contract_hash_wrapped`,
		  `${this.contractName}_package_access_token`,
		];
		// @ts-ignore
		this.namedKeys = namedKeys.reduce((acc, val) => {
		  if (LIST_OF_NAMED_KEYS.includes(val.name)) {
			return { ...acc, [utils.camelCased(val.name)]: val.key };
		  }
		  return acc;
		}, {});
	}
	public async store(
		keys: Keys.AsymmetricKey,
		created_at: string,
		slug: string,
		id: string,
		current_price: string,
		_status: string,
		expires_at: string,
		start_price: string,
		current_winner_id: string,
		inventory_item_id: string,
		payment_confirmation: string,
		mass_of_item: string,
		tax_by_mass_of_item: string,
		sales_tax: string,
		excise_rate: string,
		total_price: string,
		user_id: string,
		title: string,
		description: string,
		image_id: string,
		small_image: string,
		large_image: string,
		version: string,
		paymentAmount: string
	) {
		const runtimeArgs = RuntimeArgs.fromMap({
			created_at: CLValueBuilder.string(created_at),
			slug: CLValueBuilder.string(slug),
			id: CLValueBuilder.string(id),
			current_price: CLValueBuilder.u256(current_price),
			status: CLValueBuilder.string(_status),
			expires_at: CLValueBuilder.string(expires_at),
			start_price: CLValueBuilder.u256(start_price),
			current_winner_id: CLValueBuilder.string(current_winner_id),
			inventory_item_id: CLValueBuilder.string(inventory_item_id),
			payment_confirmation: CLValueBuilder.bool(true),
			mass_of_item: CLValueBuilder.u256(mass_of_item),
			tax_by_mass_of_item: CLValueBuilder.u256(tax_by_mass_of_item),
			sales_tax: CLValueBuilder.u256(sales_tax),
			excise_rate: CLValueBuilder.u256(excise_rate),
			total_price: CLValueBuilder.u256(total_price),
			user_id: CLValueBuilder.string(user_id),
			title: CLValueBuilder.string(title),
			description: CLValueBuilder.string(description),
			image_id: CLValueBuilder.string(image_id),
			small_image: CLValueBuilder.string(small_image),
			large_image: CLValueBuilder.string(large_image),
			version: CLValueBuilder.u256(version),
		});

		
		const deployHash = await contractCall({
			nodeAddress: this.nodeAddress,
			keys,
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "store",
			runtimeArgs,
			paymentAmount,
		});

		if (deployHash !== null) {
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
		
	}

	public async update(
		keys: Keys.AsymmetricKey,
		created_at: string,
		slug: string,
		id: string,
		current_price: string,
		_status: string,
		expires_at: string,
		start_price: string,
		current_winner_id: string,
		inventory_item_id: string,
		payment_confirmation: string,
		mass_of_item: string,
		tax_by_mass_of_item: string,
		sales_tax: string,
		excise_rate: string,
		total_price: string,
		user_id: string,
		title: string,
		description: string,
		image_id: string,
		small_image: string,
		large_image: string,
		version: string,
		paymentAmount: string
	) {
		const runtimeArgs = RuntimeArgs.fromMap({
			created_at: CLValueBuilder.string(created_at),
			slug: CLValueBuilder.string(slug),
			id: CLValueBuilder.string(id),
			current_price: CLValueBuilder.u256(current_price),
			status: CLValueBuilder.string(_status),
			expires_at: CLValueBuilder.string(expires_at),
			start_price: CLValueBuilder.u256(start_price),
			current_winner_id: CLValueBuilder.string(current_winner_id),
			inventory_item_id: CLValueBuilder.string(inventory_item_id),
			payment_confirmation: CLValueBuilder.bool(true),
			mass_of_item: CLValueBuilder.u256(mass_of_item),
			tax_by_mass_of_item: CLValueBuilder.u256(tax_by_mass_of_item),
			sales_tax: CLValueBuilder.u256(sales_tax),
			excise_rate: CLValueBuilder.u256(excise_rate),
			total_price: CLValueBuilder.u256(total_price),
			user_id: CLValueBuilder.string(user_id),
			title: CLValueBuilder.string(title),
			description: CLValueBuilder.string(description),
			image_id: CLValueBuilder.string(image_id),
			small_image: CLValueBuilder.string(small_image),
			large_image: CLValueBuilder.string(large_image),
			version: CLValueBuilder.u256(version),
		});

		const deployHash = await contractCall({
			chainName: this.chainName,
			contractHash: this.contractHash,
			entryPoint: "update",
			paymentAmount,
			nodeAddress: this.nodeAddress,
			keys: keys,
			runtimeArgs,
		});

		if (deployHash !== null) {
			// this.addPendingDeploy(LIQUIDITYEvents.SetFeeTo, deployHash);
			return deployHash;
		} else {
			throw Error("Invalid Deploy");
		}
	}

	/*=========================Getters=========================*/

	public async get_data(id: string) {
		// const id = CLValueBuilder.string(_id);

		const result = await utils.contractDictionaryGetter(
			this.nodeAddress,
			id,
			"get_data"
		);
		const maybeValue = result.value().unwrap();
		return maybeValue.value().toString();
	}
}

interface IInstallParams {
	nodeAddress: string;
	keys: Keys.AsymmetricKey;
	chainName: string;
	pathToContract: string;
	runtimeArgs: RuntimeArgs;
	paymentAmount: string;
}

const installWasmFile = async ({
	nodeAddress,
	keys,
	chainName,
	pathToContract,
	runtimeArgs,
	paymentAmount,
}: IInstallParams): Promise<string> => {
	const client = new CasperClient(nodeAddress);

	// Set contract installation deploy (unsigned).
	let deploy = DeployUtil.makeDeploy(
		new DeployUtil.DeployParams(
			CLPublicKey.fromHex(keys.publicKey.toHex()),
			chainName
		),
		DeployUtil.ExecutableDeployItem.newModuleBytes(
			utils.getBinary(pathToContract),
			runtimeArgs
		),
		DeployUtil.standardPayment(paymentAmount)
	);

	// Sign deploy.
	deploy = client.signDeploy(deploy, keys);

	// Dispatch deploy to node.
	return await client.putDeploy(deploy);
};

interface IContractCallParams {
	nodeAddress: string;
	keys: Keys.AsymmetricKey;
	chainName: string;
	entryPoint: string;
	runtimeArgs: RuntimeArgs;
	paymentAmount: string;
	contractHash: string;
}

const contractCall = async ({
	nodeAddress,
	keys,
	chainName,
	contractHash,
	entryPoint,
	runtimeArgs,
	paymentAmount,
}: IContractCallParams) => {
	const client = new CasperClient(nodeAddress);
	const contractHashAsByteArray = utils.contractHashToByteArray(contractHash);

	let deploy = DeployUtil.makeDeploy(
		new DeployUtil.DeployParams(keys.publicKey, chainName),
		DeployUtil.ExecutableDeployItem.newStoredContractByHash(
			contractHashAsByteArray,
			entryPoint,
			runtimeArgs
		),
		DeployUtil.standardPayment(paymentAmount)
	);

	// Sign deploy.
	deploy = client.signDeploy(deploy, keys);

	// Dispatch deploy to node.
	const deployHash = await client.putDeploy(deploy);

	return deployHash;
};

const contractSimpleGetter = async (
	nodeAddress: string,
	contractHash: string,
	key: string[]
) => {
	const stateRootHash = await utils.getStateRootHash(nodeAddress);
	const clValue = await utils.getContractData(
		nodeAddress,
		stateRootHash,
		contractHash,
		key
	);

	if (clValue && clValue.CLValue instanceof CLValue) {
		return clValue.CLValue!;
	} else {
		throw Error("Invalid stored value");
	}
};

export default AUCTIONClient;
