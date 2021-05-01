import cryptomacyContract from './cryptomacyContract';
import web3 from './web3';

export default {
  // refresh(): Promise<SimpleGameAreaObject[]> {
  //   return this.cryptomacyContract.getPastEvents("CryptomatMovesToPosition", { fromBlock: 0, toBlock: "latest" })
  //     .then((events) => {
  //       console.log('Cryptomat move', events);

  //       this.cryptomats = [];

  //       for(let event of events) {
  //         let existingCryptomat = this.cryptomats.find(x => x.cryptomatId === Number(event.returnValues.cryptomatId));

  //         if(!existingCryptomat) {
  //           this.cryptomats.push({
  //             cryptomatId: Number(event.returnValues.cryptomatId),
  //             x: Number(event.returnValues.positionX),
  //             y: Number(event.returnValues.positionY)
  //           });
  //         } else {
  //           existingCryptomat.x = Number(event.returnValues.positionX);
  //           existingCryptomat.y = Number(event.returnValues.positionY);
  //         }
  //       }

  //       let objects = this.cryptomats.map(c => {
  //         return new SimpleGameAreaObject({
  //           cryptomatId: c.cryptomatId,
  //           decoratorClassName: 'agent',
  //           style: {
  //             gridRow: `${c.y + 1} / span 1`,
  //             gridColumn: `${c.x + 1} / span 1`
  //           },
  //           x: c.x,
  //           y: c.y
  //         });
  //       });

  //       return objects;
  //     });
  // },
  createCryptomatAtPosition(userAccount: string, name: string, x: string, y: string) {
    return cryptomacyContract.methods.createCryptomatAtPosition(name, x, y)
      .send({ from: userAccount })
      .on("receipt", (receipt) => {
        console.log('receipt', receipt);
      })
      .on("error", (error) => {
        console.log('error', error);
      });
  },
  moveCryptomat(userAccount: string, cryptomatId: string, x: string, y: string) {
    return cryptomacyContract.methods.moveCryptomat(cryptomatId, x, y)
    .send({ from: userAccount })
    .on("receipt", (receipt) => {
      console.log('receipt', receipt);
    })
    .on("error", (error) => {
      console.log('error', error);
    });
  }
};