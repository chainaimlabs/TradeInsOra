import { TaxPayerVerifier } from './TaxPayerVerifier';
import { Field, Mina, PrivateKey, PublicKey, AccountUpdate } from 'o1js';

/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

let proofsEnabled = false;

describe('TaxPayerVerifier', () => {
  let deployerAccount: PublicKey,
    deployerKey: PrivateKey,
    senderAccount: PublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: TaxPayerVerifier;

  beforeAll(async () => {
    if (proofsEnabled) await TaxPayerVerifier.compile();
  });

  beforeEach(() => {
    const Local = Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    ({ privateKey: deployerKey, publicKey: deployerAccount } =
      Local.testAccounts[0]);
    ({ privateKey: senderKey, publicKey: senderAccount } =
      Local.testAccounts[1]);
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new TaxPayerVerifier(zkAppAddress);
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      zkApp.deploy();
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  it('generates and deploys the `TaxPayerVerifier` smart contract', async () => {
    await localDeploy();
    const num = zkApp.ageBusinessOwner.get();
    expect(num).toEqual(Field(18));
  });

  it('correctly updates the num state on the `TaxPayerVerifier` smart contract', async () => {
    await localDeploy();

    // update transaction
    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.verifycheck(Field(21));
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    const updatedNum = zkApp.ageBusinessOwner.get();
    expect(updatedNum).toEqual(Field(18));
  });

  it('the age of the business owner is too low to update the num state on the `TaxPayerVerifier` smart contract', async () => {
    await localDeploy();
    try{
    // update transaction
    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.verifycheck(Field(16));
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
  }catch{
    console.log('age to low ,hence not permitted')
  }
    const updatedNum = zkApp.ageBusinessOwner.get();
    expect(updatedNum).toEqual(Field(18));
  });
});
