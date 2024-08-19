import { Mina, PrivateKey, Field, AccountUpdate } from 'o1js';
import { CalendarContract } from '../lib/CalendarContract';

const deploy = async () => {
  const localChain = await Mina.LocalBlockchain({
    proofsEnabled: false,
    enforceTransactionLimits: false,
  });
  Mina.setActiveInstance(localChain);

  const fee = 1e8;

  const [deployer, owner] = localChain.testAccounts;
  const contract = PrivateKey.randomKeypair();
  const calendarContract = new CalendarContract(contract.publicKey);

  console.log("Deploying Calendar contract.");

  const deployTx = await Mina.transaction({
    sender: deployer,
    fee,
  }, async () => {
    AccountUpdate.fundNewAccount(deployer, 3);
    calendarContract.deploy({});
  });

  await deployTx.prove();
  deployTx.sign([deployer.key, contract.privateKey]);
  const deployTxResult = await deployTx.send().then((v) => v.wait());
  console.log("Deploy tx result:", deployTxResult.toPretty());
};

deploy().catch(console.error);
