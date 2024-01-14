const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game3', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game3');
    const game = await Game.deploy();

    // Get signers
    const signer1 = ethers.provider.getSigner(0);
    const signer2 = ethers.provider.getSigner(1);
    const signer3 = ethers.provider.getSigner(2);

    return { game, signer1, signer2, signer3 };
  }

  it('should be a winner', async function () {
    const { game, signer1, signer2, signer3 } = await loadFixture(deployContractAndSetVariables);

    // Update balances for each signer
    await game.connect(signer1).buy({ value: ethers.utils.parseEther('2') });
    await game.connect(signer2).buy({ value: ethers.utils.parseEther('3') });
    await game.connect(signer3).buy({ value: ethers.utils.parseEther('1') });

    // Get addresses for each signer
    const addr1 = await signer1.getAddress();
    const addr2 = await signer2.getAddress();
    const addr3 = await signer3.getAddress();

    // Call win with the required addresses
    await game.win(addr1, addr2, addr3);

    // Assert the game is won
    assert(await game.isWon(), 'You did not win the game');
  });
});
