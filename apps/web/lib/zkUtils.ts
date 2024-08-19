import { Field, Poseidon, Mina, PrivateKey, PublicKey, AccountUpdate, UInt64, CircuitValue, prop, isReady, Circuit } from 'o1js';

export interface TimeRange {
  start: Date;
  end: Date;
}

class TimeRangeCircuit extends CircuitValue {
  @prop start: Field;
  @prop end: Field;

  constructor(start: Field, end: Field) {
    super();
    this.start = start;
    this.end = end;
  }

  static fromTimeRange(timeRange: TimeRange): TimeRangeCircuit {
    return new TimeRangeCircuit(
      Field(timeRange.start.getTime()),
      Field(timeRange.end.getTime())
    );
  }
}

export function generateProof(freeTimes: TimeRange[]) {

  const timeCircuits = freeTimes.map(time => TimeRangeCircuit.fromTimeRange(time));
  
  const hash = Poseidon.hash(
    timeCircuits.map(time => Poseidon.hash([time.start, time.end]))
  );

  const proof = Circuit.prove(() => {
    timeCircuits.forEach(time => {
      time.start.assertLt(time.end);
    });
  }, hash);

  return { hash, proof };
}

export async function updateContract(hash: Field) {
  await isReady;
  
  const contractAddress = PublicKey.fromBase58("B62qqtxQdPa9MrDsHHRdgNsecRE2SCYBA4YkCEZ7NQ29KrpAsfPtKBW");

  const txn = await Mina.transaction(() => {
    const update = AccountUpdate.create(contractAddress);
    update.update({ field: 'numFreeTimes', value: hash });
    update.requireSignature();
  });

  await txn.prove();
  await txn.sign().send();
}