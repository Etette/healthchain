const { ethers } = require("ethers");
const {abi, bytecode} = require('../artifacts/contracts/hospitalRecord.sol/HealthRecords.json');
require('dotenv').config();


async function main() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log('getting contract factory...........')
    const HealthRecords = new ethers.ContractFactory(abi, bytecode, wallet);

    // Deploy the contract
    console.log('deploying contract...........')
    const healthRecords = await HealthRecords.deploy();

    //   Wait for the contract to be mined
    console.log('awaiting receipt............')
    console.log(`Deployment details : ${healthRecords.deploymentTransaction()}`)
    await healthRecords.waitForDeployment();


    console.log("Contract deployed to address:", healthRecords.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
