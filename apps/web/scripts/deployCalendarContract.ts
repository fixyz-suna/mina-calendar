import {
  Field,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Mina,
  PrivateKey,
  AccountUpdate,
  UInt64
} from 'o1js';

class CalendarContract extends SmartContract {
  @state(Field) numFreeTimes = State<Field>();

  async deploy(args: DeployArgs): Promise<void> { 
    await super.deploy(args);

  }

  @method async initState(numFreeTimes: Field): Promise<void> {
    this.numFreeTimes.set(numFreeTimes);
  }

  @method async updateFreeTimes(newNumFreeTimes: Field): Promise<void> {
    const currentNumFreeTimes = this.numFreeTimes.get();

    this.numFreeTimes.requireEquals(currentNumFreeTimes);
    this.numFreeTimes.set(newNumFreeTimes);
  }
}

const deploy = async () => {
  const Network = Mina.Network(
    'https://api.minascan.io/node/devnet/v1/graphql'
  );
  Mina.setActiveInstance(Network);

  const fee = 1e8;

  const deployerPrivateKey = PrivateKey.fromBase58("xxxxx");
  const deployerPublicKey = deployerPrivateKey.toPublicKey();

  const contract = PrivateKey.randomKeypair();
  const calendarContract = new CalendarContract(contract.publicKey);

  console.log("Deploying Calendar contract.");

  await CalendarContract.compile();

  const deployTx = await Mina.transaction({
    sender: deployerPublicKey,
    fee: UInt64.from(fee),
  }, async () => {
    AccountUpdate.fundNewAccount(deployerPublicKey);
    await calendarContract.deploy({});
  });

  await deployTx.prove();
  deployTx.sign([deployerPrivateKey, contract.privateKey]);
  const deployTxResult = await deployTx.send();

  console.log("Waiting for transaction to be included...");
  const txStatus = await deployTxResult.wait();

  console.log("Deploy tx result:", txStatus.toPretty());

  if (txStatus.status === "included" || txStatus.status === "success") {
    console.log(`Contract deployed successfully. Contract address: ${contract.publicKey.toBase58()}`);
  } else {
    console.error("Failed to deploy contract.");
    if ('failureReason' in txStatus) {
      console.error("Failure reason:", txStatus.failureReason);
    }
  }
};

deploy().catch((error) => {
  console.error("Deployment failed:", error);
  process.exit(1);
});
