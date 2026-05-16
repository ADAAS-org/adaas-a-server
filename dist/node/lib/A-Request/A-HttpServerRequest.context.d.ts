import { IncomingMessage, ServerResponse } from 'http';
import { A_OperationContext, A_Operation_Storage } from '@adaas/a-utils/a-operation';

declare class A_HttpServerRequestContext<_DataType extends any = any> extends A_OperationContext<'http-server-request', {
    request: IncomingMessage;
    response: ServerResponse;
}, {
    buffers: Buffer[];
    data: _DataType;
    files: Record<string, any[]>;
}, {
    buffers: Buffer[];
    data: _DataType;
    files: Record<string, any[]>;
    params: {
        request: IncomingMessage;
        response: ServerResponse;
    };
} & A_Operation_Storage> {
    protected _id: string;
    protected _startTime: [number, number];
    protected _endTime?: [number, number];
    protected _ready?: Promise<void>;
    protected get _request(): IncomingMessage;
    protected get _response(): ServerResponse;
    protected _customResponse: any;
    constructor(request: IncomingMessage, response: ServerResponse);
    get id(): string;
    get buffers(): Buffer[];
    get contentType(): string | undefined;
    get data(): _DataType;
    set data(value: _DataType);
    get length(): number;
    get processingTime(): number;
    startProcessing(): void;
    stopProcessing(): void;
}

export { A_HttpServerRequestContext };
