import { A_ExecutionContext } from '@adaas/a-utils/a-execution';

declare class A_HttpRequestData extends A_ExecutionContext<{
    data: Buffer;
}> {
    constructor(data: Buffer);
    get length(): number;
    get data(): Buffer;
    toString(encoding?: BufferEncoding): string;
}

export { A_HttpRequestData };
