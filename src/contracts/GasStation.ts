import BN from "bn.js";
import { EventLog, TransactionReceipt } from "web3x-es/formatters";
import { Contract, ContractOptions, TxCall, TxSend, EventSubscriptionFactory } from "web3x-es/contract";
import { Eth } from "web3x-es/eth";
import abi from "./GasStationAbi";
export type RelayedEvent = {
    sig: string;
    signer: string;
    destination: string;
    data: string;
    remaining: string;
    _hash: string;
};
export interface RelayedEventLog extends EventLog<RelayedEvent, "Relayed"> {
}
interface GasStationEvents {
    Relayed: EventSubscriptionFactory<RelayedEventLog>;
}
interface GasStationEventLogs {
    Relayed: RelayedEventLog;
}
interface GasStationTxEventLogs {
    Relayed: RelayedEventLog[];
}
export interface GasStationTransactionReceipt extends TransactionReceipt<GasStationTxEventLogs> {
}
interface GasStationMethods {
    nonce(a0: string): TxCall<string>;
    subscribe(signer: string, plan: number | string | BN): TxSend<GasStationTransactionReceipt>;
    plan(signer: string): TxCall<string>;
    relay(sig: string, signer: string, destination: string, value: number | string | BN, data: string): TxSend<GasStationTransactionReceipt>;
    getHash(signer: string, destination: string, value: number | string | BN, data: string): TxCall<string>;
}
export interface GasStationDefinition {
    methods: GasStationMethods;
    events: GasStationEvents;
    eventLogs: GasStationEventLogs;
}
export class GasStation extends Contract<GasStationDefinition> {
    constructor(eth: Eth, address?: string, options?: ContractOptions) {
        super(eth, abi, address, options);
    }
}
export var GasStationAbi = abi;
