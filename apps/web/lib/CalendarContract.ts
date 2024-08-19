import {
    Field,
    SmartContract,
    State,
    method,
    DeployArgs,
    Permissions,
    PublicKey,
  } from 'o1js';
  
  export class CalendarContract extends SmartContract {
    numFreeTimes: State<Field>;
  
    constructor(address: PublicKey) {
      super(address);
      this.numFreeTimes = State.init(Field(0)); // 初期値を設定
    }
  
    deploy(args: DeployArgs) {
      super.deploy(args);
      this.setPermissions({
        ...Permissions.default(),
        editState: Permissions.proofOrSignature(),
      });
    }
  
    @method initState(numFreeTimes: Field) {
      this.numFreeTimes.set(numFreeTimes);
    }
  
    @method updateFreeTimes(newNumFreeTimes: Field) {
      const currentNumFreeTimes = this.numFreeTimes.get();
      this.numFreeTimes.assertEquals(currentNumFreeTimes);
      this.numFreeTimes.set(newNumFreeTimes);
    }
  }
  