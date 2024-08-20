import { Field, Poseidon, PublicKey, AccountUpdate } from 'o1js';

export interface TimeRange {
  start: Date;
  end: Date;
}

export function generateProof(freeTimes: TimeRange[]) {
  const hash = Poseidon.hash(
    freeTimes.map(time => {
      if (time.start instanceof Date && time.end instanceof Date) {
        return Field(time.start.getTime() + time.end.getTime());
      } else {
        throw new Error("Invalid time range provided. start and end should be Date objects.");
      }
    })
  );

  const proof = {};  // ZkProgram を使用して証明を生成

  return { hash, proof };
}

export async function updateContract(hash: Field) {
  const contractAddress = PublicKey.fromBase58("B62qqtxQdPa9MrDsHHRdgNsecRE2SCYBA4YkCEZ7NQ29KrpAsfPtKBW");

  const txn = await Mina.transaction(() => {
    const update = AccountUpdate.create(contractAddress);
    update.update({ field: 'numFreeTimes', value: hash });
    update.requireSignature();
  });

  await txn.prove();
  await txn.sign().send();
}