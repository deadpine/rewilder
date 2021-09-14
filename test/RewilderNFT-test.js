const { ethers, upgrades } = require("hardhat");
const { expect } = require("chai");


describe("RewilderNFT", function () {
  beforeEach(async function () {
    const RewilderNFT = await ethers.getContractFactory("RewilderNFT");
    const [deployer, alice, bob] = await ethers.getSigners();
    this.deployer = deployer;
    this.alice = alice;
    this.bob = bob;
    this.token = await upgrades.deployProxy(RewilderNFT, { kind: "uups" });
  });
  
  describe("ERC721", function () {
    it("has correct symbol", async function () {
      expect(await this.token.symbol()).to.equal("WILD");
    });
    it("sets the right owner", async function () {
      expect(await this.token.owner()).to.equal(this.deployer.address);
    });
    describe("minting", function () {
      it("owner can mint to themselves", async function () {
        await this.token.safeMint(this.deployer.address);
        expect(await this.token.balanceOf(this.deployer.address)).to.equal(1);
        await this.token.safeMint(this.deployer.address);
        expect(await this.token.balanceOf(this.deployer.address)).to.equal(2);
      });
      it("owner can mint to others", async function () {
        expect(await this.token.balanceOf(this.alice.address)).to.equal(0);
        expect(await this.token.balanceOf(this.bob.address)).to.equal(0);
        await this.token.safeMint(this.alice.address);
        await this.token.safeMint(this.bob.address);
        expect(await this.token.balanceOf(this.alice.address)).to.equal(1);
        expect(await this.token.balanceOf(this.bob.address)).to.equal(1);
      });
      it("others can't mint", async function () {
        await expect(this.token.connect(this.alice).safeMint(this.alice.address))
            .to.be.revertedWith('Ownable: caller is not the owner');
      });
    });
    
  });


  describe("upgrades", function () {
    it("upgrades to v2 implementation and preserves address", async function () {
      const MockRewilderNFTv2 = await ethers.getContractFactory(
        "MockRewilderNFTv2"
      );
      const upgradedNFT = await upgrades.upgradeProxy(
        this.token.address,
        MockRewilderNFTv2
      );
      expect(upgradedNFT.address).to.equal(this.token.address);
    });

    // in this test we allow minting by anyone with the upgrade
    it("upgrades to v2 implementation that changes something", async function () {

      const MockRewilderNFTv2 = await ethers.getContractFactory(
        "MockRewilderNFTv2"
      );

      // before upgrade, revert on mint by anyone but owner
      await expect(this.token.connect(this.alice).safeMint(this.alice.address))
            .to.be.revertedWith('Ownable: caller is not the owner');
      const upgradedNFT = await upgrades.upgradeProxy(
        this.token.address,
        MockRewilderNFTv2
      );
      // no revert after upgrade
      await this.token.connect(this.alice).safeMint(this.alice.address);
        
    });
  });
});
