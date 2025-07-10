import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';

function generateWallet() {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);

  console.log("\n--- NEW WALLET GENERATED ---");
  console.log("Private Key: ", privateKey);
  console.log("Address: ", account.address);
  console.log("----------------------------");
  console.log("\nIMPORTANT: Save this private key securely. Do NOT share it.");
  console.log("Update your .env.local file with this new private key.");
}

generateWallet();

