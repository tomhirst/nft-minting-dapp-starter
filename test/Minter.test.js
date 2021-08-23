const { assert, expect } = require('chai')
const chai = require('chai')
const BN = require('bn.js')
chai.use(require('chai-as-promised')).should()
chai.use(require('chai-bn')(BN))

describe("Minter", function() {
  describe('deployment', async function() {
    it('deploys successfully', async function() {
      const Minter = await ethers.getContractFactory("Minter")
      const minter = await Minter.deploy()
      const contract = await minter.deployed()
      const address = contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
  })

  // @TODO: Split these up
  describe('minting', async function() {
    it('mints tokens as expected', async function() {
      const Minter = await ethers.getContractFactory("Minter")
      const minter = await Minter.deploy()
      const contract = await minter.deployed()
      // Request to mint 5 tokens and send 0.15 ETH (5 * 0.03).
      const result = await contract.mint(5, { value: ethers.utils.parseEther("0.15")})
      const totalSupply = await contract.totalSupply()
      // Success: 5 tokens should be minted.
      assert.equal(totalSupply, 5)
      // Failure: Can't mint 0 tokens with 0 ETH (0 * 0.03).
      await contract.mint(0, { value: ethers.utils.parseEther("0")}).should.be.rejected
      // Failure: Can't mint 1 token with 0 ETH (not enough Ether sent).
      await contract.mint(0, { value: ethers.utils.parseEther("0")}).should.be.rejected
      // Failure: Can't mint more than 10 tokens in one go.
      await contract.mint(11, { value: ethers.utils.parseEther("0.33")}).should.be.rejected
      await contract.mint(111, { value: ethers.utils.parseEther("3.33")}).should.be.rejected
      // Failure: Can't mint more than 10 tokens in one go, or more than the max supply.
      await contract.mint(1111, { value: ethers.utils.parseEther("33.33")}).should.be.rejected
    })
  })

  describe('fetching', async function() {
    it('fetches data as expected', async function() {
      const Minter = await ethers.getContractFactory("Minter")
      const minter = await Minter.deploy()
      const contract = await minter.deployed()
      // Request totalSupply from contract.
      const totalSupply = await contract.totalSupply()
      expect(new BN(totalSupply.toString())).to.be.a.bignumber.that.is.at.most('10000')
    })
  })
})

