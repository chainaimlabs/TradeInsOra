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
export class TaxPayerVerifier extends SmartContract {
  @state(Field) ageBusinessOwner= State<Field>();
  @state(Field) taxPayerVerification= State<Field>();

  init() {
    super.init();
    this.ageBusinessOwner.set(Field(18));
    this.taxPayerVerification.set(Field(0));
  }

  @method verifycheck(AgeBusinessOwner:Field) {
    const currentage = this.ageBusinessOwner.getAndRequireEquals();
  
    const taxPayerVerificationAllowed= Provable.if(AgeBusinessOwner.greaterThanOrEqual(currentage),Field(1),Field(0));
    this.taxPayerVerification.set(taxPayerVerificationAllowed);

  }
}
