import {
    Field,
    SmartContract,
    state,
    State,
    method,
    DeployArgs,
    Permissions,
    PublicKey,
  } from 'o1js';
  
  export class CalendarContract extends SmartContract {
    @state(Field) numFreeTimes = State<Field>();
  
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
      currentNumFreeTimes.assertEquals(this.numFreeTimes.get());
      this.numFreeTimes.set(newNumFreeTimes);
    }
  }
  