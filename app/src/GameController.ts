import {AbiItem} from 'web3-utils';
import Web3 from "web3"
import { abi } from './contracts/Cryptomacy.json';
import web3 from 'web3';

const cryptomacyContractAddress = process.env.REACT_APP_CRYPTOMACY_CONTRACT_ADDRESS;

export class GameController {
  web3: any;
  cryptomacyContract: any;
  cryptomats: any = [];

  init() {
    this.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:9545/ws'));
    this.cryptomacyContract = new this.web3.eth.Contract(abi as unknown as AbiItem, cryptomacyContractAddress);
  }

  listen(setObjects) {
    this.cryptomacyContract.events.NewCryptomat()
      .on("data", (event) => {
        this.refresh().then(setObjects);
      }).on("error", console.error);
      
    this.cryptomacyContract.events.CryptomatMovesToPosition()
      .on("data", (event) => {
        this.refresh().then(setObjects);
      }).on("error", console.error);
  }

  refresh(): Promise<SimpleGameAreaObject[]> {
    return this.cryptomacyContract.getPastEvents("CryptomatMovesToPosition", { fromBlock: 0, toBlock: "latest" })
      .then((events) => {
        console.log('Cryptomat move', events);

        this.cryptomats = [];

        for(let event of events) {
          let existingCryptomat = this.cryptomats.find(x => x.cryptomatId === Number(event.returnValues.cryptomatId));

          if(!existingCryptomat) {
            this.cryptomats.push({
              cryptomatId: Number(event.returnValues.cryptomatId),
              x: Number(event.returnValues.positionX),
              y: Number(event.returnValues.positionY)
            });
          } else {
            existingCryptomat.x = Number(event.returnValues.positionX);
            existingCryptomat.y = Number(event.returnValues.positionY);
          }
        }

        let objects = this.cryptomats.map(c => {
          return new SimpleGameAreaObject({
            cryptomatId: c.cryptomatId,
            decoratorClassName: 'agent',
            style: {
              gridRow: `${c.y + 1} / span 1`,
              gridColumn: `${c.x + 1} / span 1`
            },
            x: c.x,
            y: c.y
          });
        });

        return objects;
      });
  }

  loadAccount() {
    return new Promise((resolve, reject) => {
      this.web3.eth.getAccounts((error, accounts) => {
        console.log('Account address', accounts[0]);

        resolve(accounts[0]);
      });
    });
  }

  createCryptomatAtPosition(userAccount, name, x, y) {
    this.cryptomacyContract.methods.createCryptomatAtPosition(name, x, y)
    .send({ from: userAccount, gas: 900000 })
    .on("receipt", (receipt) => {
      console.log('receipt', receipt);
    })
    .on("error", (error) => {
      console.log('error', error);
    });
  }

  moveCryptomat(userAccount, cryptomatId, x, y) {
    this.cryptomacyContract.methods.moveCryptomat(cryptomatId, x, y)
    .send({ from: userAccount, gas: 900000 })
    .on("receipt", (receipt) => {
      console.log('receipt', receipt);
    })
    .on("error", (error) => {
      console.log('error', error);
    });
  }
}

class SimpleGameAreaObject {
  constructor(params: Partial<SimpleGameAreaObject>) {
    Object.assign(this, params);
  }

  cryptomatId: number;
  decoratorClassName: string;
  style: any;
  x: number;
  y: number;
  isSelected: boolean = false;

  get className(): string {
    if(this.isSelected) {
      return `${this.decoratorClassName}`;
    } else {
      return this.decoratorClassName;
    }
  }

  get containerClassName(): string {
    if(this.isSelected) {
      return `floor selected`;
    } else {
      return 'floor';
    }
  }
}