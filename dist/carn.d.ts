declare class Carn {
    id: number;
    newline: string;
    indent: string;
    separator: string;
    dI: number;
    s: any[];
    constructor();
    start(): void;
    add(str: any): void;
    sep(): void;
    depth(descend: number): void;
    src(): string;
    inject(text: string, name: string, marker: string[]): string;
}
export { Carn };
