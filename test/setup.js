const web3 = require('web3');

const setupTest = deployments.createFixture(
  async (
    { deployments, getNamedAccounts, getUnnamedAccounts, ethers },
    options,
  ) => {
    const { deployer } = await getNamedAccounts();
    const accounts = await getUnnamedAccounts();

    await deployments.fixture();

    await deployments.deploy('ERC721Collection', {
      from: deployer,
      args: [
        'Test Collection',
        'TC',
        web3.utils.toWei('0.08'), // Price of each NFT if purchased directly on the smart contract
        10000, // Max Total Mint
        2, // Pre-sale mint per address
        10, // Max mint per transaction
        100, // Max allowed gas fee in gwei (0 = disabled)
        'ipfs://contract-metadata-test-uri',
        'ipfs://placeholder-metadata-uri',
        deployer, // Rarible royalty beneficiary
        '0x0000000000000000000000000000000000000000',
      ],
      log: true,
      estimateGasExtra: 1000000,
    });

    return {
      deployer: {
        signer: await ethers.getSigner(deployer),
        testCollection: await ethers.getContract('ERC721Collection', deployer),
      },
      userA: {
        signer: await ethers.getSigner(accounts[0]),
        testCollection: await ethers.getContract(
          'ERC721Collection',
          accounts[0],
        ),
      },
      userB: {
        signer: await ethers.getSigner(accounts[1]),
        testCollection: await ethers.getContract(
          'ERC721Collection',
          accounts[1],
        ),
      },
    };
  },
);

module.exports = {
  setupTest,
};
