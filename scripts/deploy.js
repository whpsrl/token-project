const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying Freepple Token (FRP)...\n");

  // Ottieni l'account che fa il deploy
  const [deployer] = await hre.ethers.getSigners();
  console.log("📍 Deploying with account:", deployer.address);
  
  // Mostra il balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy del contratto
  console.log("⏳ Deploying contract...");
  const FreeppleToken = await hre.ethers.getContractFactory("FreeppleToken");
  const token = await FreeppleToken.deploy();
  
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();

  console.log("\n✅ Freepple Token deployed successfully!");
  console.log("📄 Contract address:", tokenAddress);
  console.log("🔗 View on BaseScan: https://basescan.org/address/" + tokenAddress);
  
  // Verifica supply
  const totalSupply = await token.totalSupply();
  console.log("\n📊 Token Info:");
  console.log("   Name:", await token.name());
  console.log("   Symbol:", await token.symbol());
  console.log("   Total Supply:", hre.ethers.formatEther(totalSupply), "FRP");
  console.log("   Decimals:", await token.decimals());

  console.log("\n🎉 Done! Your 1 billion FRP tokens are now in your wallet!");
  console.log("\n📝 Next steps:");
  console.log("   1. Add FRP to MetaMask/Trust Wallet using the contract address");
  console.log("   2. Verify the contract on BaseScan (optional but recommended)");
  console.log("   3. Share your token with the world!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });




