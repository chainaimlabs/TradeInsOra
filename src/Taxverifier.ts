import { Field, SmartContract, state, State, method, Provable } from 'o1js';

/**
 * Basic Example
 * See https://docs.minaprotocol.com/zkapps for more info.
 *
 * The Add contract initializes the state variable 'num' to be a Field(1) value by default when deployed.
 * When the 'update' method is called, the Add contract adds Field(2) to its 'num' contract state.
 *
 * This file is safe to delete and replace with your own contract.
 */
export class Taxverifier extends SmartContract {
  @state(Field) age= State<Field>();
  @state(Field) taxpayer= State<Field>();

  init() {
    super.init();
    this.age.set(Field(18));
    this.taxpayer.set(Field(0));
  }

  @method verifycheck(Agepeople:Field) {
    const currentage = this.age.getAndRequireEquals();
   
    
    //Agepeople.assertGreaterThanOrEqual(currentage);
    const taxallowed= Provable.if(Agepeople.greaterThanOrEqual(currentage),Field(1),Field(0));
    this.taxpayer.set(taxallowed);


  }
}
