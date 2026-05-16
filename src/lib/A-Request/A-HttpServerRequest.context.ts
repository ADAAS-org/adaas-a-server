import { A_Context, A_Fragment, A_IdentityHelper } from "@adaas/a-concept";
import { IncomingMessage, request, ServerResponse } from "http";
import { A_Operation_Storage, A_OperationContext } from "@adaas/a-utils/a-operation";


export class A_HttpServerRequestContext<
    _DataType extends any = any,
> extends A_OperationContext<
    'http-server-request',
    {
        request: IncomingMessage,
        response: ServerResponse
    },
    {
        buffers: Buffer[]
        data: _DataType
        files: Record<string, any[]>
    },
    {
        buffers: Buffer[]
        data: _DataType
        files: Record<string, any[]>
        params: {
            request: IncomingMessage,
            response: ServerResponse
        }
    } & A_Operation_Storage
> {

    protected _id!: string;

    protected _startTime!: [number, number];
    protected _endTime?: [number, number];
    protected _ready?: Promise<void>;

    protected get _request(): IncomingMessage {
        return super.params.request;
    }

    protected get _response(): ServerResponse {
        return super.params.response;
    }

    protected _customResponse: any;


    constructor(
        request: IncomingMessage,
        response: ServerResponse
    ) {
        super('http-server-request', { request, response });


        this._id = A_IdentityHelper.generateTimeId();
    }

    get id(): string {
        return `[${this._request.method}]${this._request.url}-${this._id}`;
    }

    get buffers(): Buffer[] {
        if (!this._meta.has('buffers')) {
            this._meta.set('buffers', []);
        }
        return this._meta.get('buffers')!;
    }

    get contentType(): string | undefined {
        return this._request.headers['content-type'] || undefined;
    }


    get data(): _DataType {
        return this._meta.get('data')!;
    }

    set data(value: _DataType) {
        this._meta.set('data', value);
    }

    get length(): number {
        return this.buffers.reduce((acc, buf) => acc + buf.length, 0);
    }

    get processingTime(): number {
        let endTime = this._endTime;
        if (!endTime) {
            endTime = process.hrtime();
        }

        const [seconds, nanoseconds] = process.hrtime(this._startTime);
        return seconds * 1000 + nanoseconds / 1000000;
    }


    startProcessing() {
        this._startTime = process.hrtime();
    }

    stopProcessing() {
        this._endTime = process.hrtime();
    }
}