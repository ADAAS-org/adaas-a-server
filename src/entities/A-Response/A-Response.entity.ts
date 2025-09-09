import {
    A_Context,
    A_Entity,
    A_Logger,
    A_Scope,
} from "@adaas/a-concept";
import {
    IncomingHttpHeaders,
    ServerResponse
} from "http";
import {
    A_SERVER_TYPES__ResponseConstructor,
    A_SERVER_TYPES__ResponseEvent,
    A_SERVER_TYPES__ResponseSerialized,
    A_SERVER_TYPES__SendResponseObject
} from "./A-Response.entity.types";
import {
    A_Error,
    A_ServerError,
    ASEID
} from "@adaas/a-utils";



export class A_Response<
    _ResponseType = any
> extends A_Entity<
    A_SERVER_TYPES__ResponseConstructor,
    A_SERVER_TYPES__ResponseSerialized
> {
    /**
     * Duration of the request in milliseconds
     */
    duration: number = 0;

    private res!: ServerResponse;
    private data: Map<string, _ResponseType> = new Map();
    error?: A_ServerError;


    fromNew(newEntity: A_SERVER_TYPES__ResponseConstructor): void {
        this.res = newEntity.response;

        this.aseid = new ASEID({
            namespace: A_Context.root.name,
            scope: newEntity.scope || 'default',
            entity: 'a-response',
            id: newEntity.id
        });
    }

    get headersSent(): boolean {
        return this.res.headersSent;
    }

    get original() {
        return this.res;
    }

    get statusCode(): number {
        return this.res.statusCode;
    }

     async init(): Promise<void> {
        const startTime = process.hrtime();

        this.res.on('finish', async () => {
            const elapsedTime = process.hrtime(startTime);
            const elapsedMilliseconds = elapsedTime[0] * 1000 + elapsedTime[1] / 1e6;

            this.duration = elapsedMilliseconds;
            await this.call(A_SERVER_TYPES__ResponseEvent.Finish);
        });

        this.res.on('close', async () => {
            await this.call(A_SERVER_TYPES__ResponseEvent.Close)
        });

    }



    public failed(error: A_ServerError | A_Error | Error | unknown): void {
        switch (true) {
            case error instanceof A_ServerError:
                this.error = error;

                break;

            case error instanceof A_Error:
                this.error = new A_ServerError(error);

                break;

            default:
                this.error = new A_ServerError(error)

                break;
        }

        return this.status(this.error.serverCode).json(this.error);
    }

    // Send a plain text or JSON response
    public send(
        data: string | object = this.toResponse()
    ): void {
        const logger = A_Context.scope(this).resolve(A_Logger);
        if (this.headersSent) {
            logger.warning('Response headers already sent, cannot send response again.');
            return;
        }

        try {


            switch (true) {
                case !!data && typeof data === 'object':
                    return this.json(data);

                case !!data && typeof data === 'string':
                    this.res.setHeader('Content-Type', 'text/plain');
                    this.res.writeHead(this.statusCode);
                    this.res.end(data);

                    return;

                default:
                    this.res.writeHead(this.statusCode);
                    this.res.end(data);

                    return;
            }
        } catch (error) {
            logger.warning('Response send error:', error);
        }
    }

    destroy(error: Error | unknown, scope?: A_Scope): Promise<any> {
        this.res.end();
        return super.destroy(scope);
    }

    // Explicit JSON response
    public json(
        data: object = this.toResponse()
    ): void {
        const logger = A_Context.scope(this).resolve(A_Logger);

        if (this.headersSent) {
            logger.warning('Response headers already sent, cannot send response again.');
            return;
        }
        this.res.setHeader('Content-Type', 'application/json');
        this.res.writeHead(this.statusCode);
        this.res.end(JSON.stringify(data));
    }

    // Set HTTP status code
    public status(code: number): this {
        this.res.statusCode = code;
        return this;
    }

    writeHead(statusCode: number, headers?: Record<string, string> | IncomingHttpHeaders | any) {
        this.res.writeHead(statusCode, headers);
    }


    setHeader(key: string, value: string) {
        this.res.setHeader(key, value);
    }

    getHeader(key: string): string | number | string[] | undefined {
        return this.res.getHeader(key) as string | number | string[] | undefined;
    }


    add(key: string, data: _ResponseType) {
        this.data.set(key, data);
    }


    toResponse(): A_SERVER_TYPES__SendResponseObject<_ResponseType> {
        return Array.from(this.data.entries()).reduce((acc, [key, value]) => {
            if (value instanceof A_Entity)
                acc[key] = value.toJSON();
            else

                acc[key] = value;
            return acc;
        }, {});
    }
}