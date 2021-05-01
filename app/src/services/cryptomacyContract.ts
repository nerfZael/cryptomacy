import {AbiItem} from 'web3-utils';
import { abi } from '../contracts/Cryptomacy.json';

import web3 from "./web3";

const contractAddress = process.env.REACT_APP_CRYPTOMACY_CONTRACT_ADDRESS;

const cryptomacyContract = new web3.eth.Contract(abi as unknown as AbiItem, contractAddress);

export default cryptomacyContract;