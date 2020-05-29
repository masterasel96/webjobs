import { IContractRequest, IContractUpdateRequest } from "../interface/request.interface";
import User from "../model/user.model";
import UserDao from "../dao/user.dao";
import { isArray } from "lodash";
import Contract from "../model/contract.model";
import ContractDao from "../dao/contract.dao";

export default class ContractService {
    constructor(){

    }

    public static async createContract(contractData: IContractRequest): Promise<Contract> {
        const contractor: User | undefined | User[] = await UserDao.getUser(contractData.codContractor);
        const worker: User | undefined | User[] = await UserDao.getUser(contractData.codWorker);
        if (contractor === undefined || isArray(contractor) || worker === undefined || isArray(worker)) {
            throw new Error(`Error getting user...`);
        }
        return await ContractDao.createContract(new Contract(worker, contractor));
    }

    public static async updateContract(contractData: IContractUpdateRequest ): Promise<Contract> {
        const oldContract: Contract | undefined = await ContractDao.getContract(contractData.codContract);
        if(oldContract === undefined){
            throw new Error(`This contract doesn´t exists...`);
        }
        const contractAttr = Contract.describe();
        Object.keys(contractData.newValues).forEach(val => {
            if (!contractAttr.includes(val)) {
                throw new Error(`Error in update values...`);
            }
        });

        if (Object.keys(contractData.newValues).includes('startDate')) {
            (contractData.newValues as unknown as { startDate: Date }).startDate = new Date(contractData.newValues.startDate as string);
        }
        if (Object.keys(contractData.newValues).includes('endDate')) {
            (contractData.newValues as unknown as { endDate: Date }).endDate = new Date(contractData.newValues.endDate as string);
        }
        const newContract = {
            ...oldContract,
            ...contractData.newValues
        }
        const updateContract = await ContractDao.updateContract(newContract as Contract);
        if(updateContract === undefined){
            throw new Error(`Error updating contract..`);
        }
        return updateContract;
    }

    public static async getContractsByUser(codUser: number): Promise<Contract[]> { 
        return await ContractDao.getContractsByUser(codUser);
    }

}