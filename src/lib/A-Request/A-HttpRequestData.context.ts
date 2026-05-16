import { A_ExecutionContext } from "@adaas/a-utils/a-execution";



export class A_HttpRequestData extends A_ExecutionContext<{
    data: Buffer;
}> {


    constructor(data: Buffer) {
        super(
            'a-http-request-data'
        );
        this._meta.set('data', data);
    }

    get length(): number {
        return this.data?.length || 0;
    }

    get data(): Buffer {
        return this._meta.get('data')!;
    }


    toString(encoding: BufferEncoding = 'utf-8'): string {
        return this.data.toString(encoding);
    }

}
