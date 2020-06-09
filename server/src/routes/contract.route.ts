import { Router, Request, Response } from 'express';
import { isEmpty } from 'lodash';
import ContractService from '../services/contract.service';
import { IContractRequest, IContractUpdateRequest } from '../interface/request.interface';
import { IContractUpdate } from '../interface/update.interface';
import { ContractStatus } from '../interface/db.interface';
import Guard from '../core/guard.core';

export default class contractRoute {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    public config(): void {
        this.router.post('/getByUser', this.getContractsByUser);
        this.router.post('/create', this.createContract);
        this.router.post('/update', this.updateContract.bind(this));
    }

    private async createContract(req: Request, res: Response) {
        try {
            if(!Guard.bauth(req, res)){
                return;
            };
            const contractData = req.body as IContractRequest;
            console.log(contractData);
            if (isEmpty(contractData.codWorker) || isEmpty(contractData.codContractor)) {
                throw new Error(`Datos insuficientes...`);
            }
            const newContract = await ContractService.createContract(contractData);
            res.status(200).json({
                code: 200,
                data: { newContract },
                status: true
            });
        } catch (error) {
            const err: Error = error;
            res.status(400).json({
                code: 400,
                data: { error: err.message },
                status: false
            });
        }
    }

    private async getContractsByUser(req: Request, res: Response) {
        try {
            if(!Guard.bauth(req, res)){
                return;
            };
            const codUser = req.body.codUser;
            if (isEmpty(codUser)) {
                throw new Error(`Datos insuficientes...`);
            }
            const contracts = await ContractService.getContractsByUser(codUser);
            res.status(200).json({
                code: 200,
                data: { contracts },
                status: true
            });
        } catch (error) {
            const err: Error = error;
            res.status(400).json({
                code: 400,
                data: { error: err.message },
                status: false
            });
        }
    }

    private async updateContract(req: Request, res: Response) {
        try {
            if(!Guard.bauth(req, res)){
                return;
            };
            const newValues = req.body as IContractUpdateRequest;
            if (isEmpty(newValues.codContract) || isEmpty(newValues.newValues)) {
                throw new Error(`Datos insuficientes...`);
            }
            this.validateUpdateContract(newValues.newValues);
            const updateContract = await ContractService.updateContract(newValues);
            res.status(200).json({
                code: 200,
                data: { updateContract },
                status: true
            });
        } catch (error) {
            const err: Error = error;
            res.status(400).json({
                code: 400,
                data: { error: err.message },
                status: false
            });
        }
    }

    private validateUpdateContract(values: IContractUpdate) {
        if (values.status !== undefined && !Object.values(ContractStatus).includes(values.status)) {
            throw new Error(`Valor del status incorrecto...`);
        }
        if ((values.contractorAssessment !== undefined && values.contractorAssessment.length < 15) ||
            (values.workerAssessment !== undefined && values.workerAssessment.length < 15)) {
            throw new Error(`Valoracion incorrecta, minimo 15 caracteres...`);
        }
        if ((values.contractorPunctuation !== undefined && (values.contractorPunctuation < 0 || values.contractorPunctuation > 5)) ||
            (values.workerPunctuation !== undefined && (values.workerPunctuation < 0 || values.workerPunctuation > 5))) {
            throw new Error(`Puntuacion incorrecta, maximo 5 puntos...`);
        }
    }
}