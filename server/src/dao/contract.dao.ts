import { getManager, getConnection } from "typeorm";
import Contract from '../model/contract.model';
import UserDao from "./user.dao";
import { isArray } from "lodash";

export default class ContractDao {
    constructor(){

    }

    public static async createContract(contract: Contract): Promise<Contract> {
        const newContract = getManager().create(Contract, contract);
        await getManager().save(newContract);
        return newContract;
    }

    public static async getContract(codContract: number): Promise<Contract | undefined> {
        const contractRepo = getConnection().getRepository(Contract);
        const contract = await contractRepo.findOne(codContract);
        return contract;
    }

    public static async removeContract(contractToRemove: Contract): Promise<Contract | undefined> {
        const contractRepo = getConnection().getRepository(Contract);
        return await contractRepo.remove(contractToRemove);
    }

    public static async updateContract(contractToUpdate: Contract): Promise<Contract | undefined> {
        const contractRepo = getConnection().getRepository(Contract);
        return await contractRepo.save(contractToUpdate);
    }

    public static async getContractsByUser(codUser: number): Promise<Contract[]> {
        const user = await UserDao.getUser(codUser);
        if(user === undefined || isArray(user)){
            throw new Error(`Error getting user...`);
        }
        const contractRepo = getConnection().getRepository(Contract);
        return await contractRepo.find({ where: [
            { contractor: user },
            { worker: user }
        ], relations: ['contractor', 'worker'] });
    }
}