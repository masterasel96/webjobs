import { getManager, getConnection } from "typeorm";
import Contract from '../model/contract.model';

export default class ContractDao {
    constructor(){

    }

    public async createContract(contract: Contract): Promise<Contract> {
        const newContract = getManager().create(Contract, contract);
        await getManager().save(newContract);
        return newContract;
    }

    public async getContract(codContract: number): Promise<Contract | undefined> {
        const contractRepo = getConnection().getRepository(Contract);
        const contract = await contractRepo.findOne(codContract);
        return contract;
    }

    public async removeContract(contractToRemove: Contract): Promise<Contract | undefined> {
        const contractRepo = getConnection().getRepository(Contract);
        return await contractRepo.remove(contractToRemove);
    }

    public async updateContract(contractToUpdate: Contract): Promise<Contract | undefined> {
        const contractRepo = getConnection().getRepository(Contract);
        return await contractRepo.save(contractToUpdate);
    }
}