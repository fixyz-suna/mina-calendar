// apps/web/lib/zkUtils.ts
import { Field, Poseidon, Mina } from 'o1js';
import { CalendarContract } from './CalendarContract';

export interface TimeRange {
  start: Date;
  end: Date;
}

export function generateProof(freeTimes: TimeRange[]) {
  const hash = Poseidon.hash(
    freeTimes.map(time => Field(time.start.getTime() + time.end.getTime()))
  );

  // 注意: この部分は実際のZkProgram実装に置き換える必要があります
  const proof = { /* ZkProgram を使用して証明を生成 */ };

  return { hash, proof };
}

export async function updateContract(contract: CalendarContract, proof: any, hash: Field) {
  const txn = await Mina.transaction(() => {
    contract.updateFreeTimes(hash);
  });
  await txn.prove();
  await txn.sign().send();
}