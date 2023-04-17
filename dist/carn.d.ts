type ErrCode = keyof typeof CarnError.Code;
declare class CarnContext {
    errs: any[];
    bail: boolean;
    start: number;
    finish: number;
    id: number;
    run: number;
    constructor(id: number);
    error(code: ErrCode, details?: Record<string, any>, ...rest: any): CarnError;
    throw(code: ErrCode, details?: Record<string, any>, ...rest: any): void;
    init(run: number): void;
    check(): true | void;
    active(): boolean;
    finished(): boolean;
}
declare class CarnError extends Error {
    code: string;
    cid: number;
    crun: number;
    static Code: {
        not_active: string;
        already_started: string;
        invalid_depth: string;
    };
    constructor(cid: number, crun: number, code: ErrCode, details?: Record<string, any>, ...rest: any);
}
declare class Carn {
    id: number;
    run: number;
    newline: string;
    indent: string;
    separator: string;
    ctx: CarnContext;
    private dI;
    private s;
    constructor();
    start(): CarnContext;
    add(str: any): void;
    sep(): void;
    depth(move?: number, relative?: boolean): number;
    finish(): CarnContext;
    src(): string;
    inject(text: string, name: string, marker: string[]): string;
}
export { Carn };
