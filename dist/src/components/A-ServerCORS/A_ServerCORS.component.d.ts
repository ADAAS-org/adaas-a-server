import { A_Component } from '@adaas/a-concept';
import { A_Request } from '../../entities/A-Request/A-Request.entity';
import { A_Response } from '../../entities/A-Response/A-Response.entity';
import { A_Config } from '@adaas/a-utils';
export declare class A_ServerCORS extends A_Component {
    private config;
    init(config: A_Config<['ORIGIN', 'METHODS', 'HEADERS', 'CREDENTIALS', 'MAX_AGE']>): Promise<void>;
    apply(aReq: A_Request, aRes: A_Response): void;
}
