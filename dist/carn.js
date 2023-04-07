"use strict";
/* Copyright (c) 2023 Richard Rodger, MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carn = void 0;
class Carn {
    constructor() {
        this.newline = '\n';
        this.indent = '  ';
        this.separator = ',';
        this.dI = 0;
        this.id = (1e6 * Math.random()) | 0;
        this.s = [];
    }
    start() {
        this.s = [];
    }
    add(str) {
        if ('string' !== typeof str) {
            return;
        }
        this.s.push(str);
    }
    sep() {
        this.s.push(new Sep(this.separator));
    }
    depth(descend) {
        if ('number' !== typeof descend) {
            return;
        }
        this.dI += descend;
        this.s.push(new Depth(this.dI, this.indent));
    }
    src() {
        let indent = '';
        for (let sI = 0; sI < this.s.length; sI++) {
            let pI = sI;
            if (this.s[pI] instanceof Depth) {
                indent = this.s[pI].toString();
                this.s[pI] = '';
                continue;
            }
            if (this.s[pI + 1] instanceof Sep) {
                if (!(this.s[pI + 2] instanceof Depth)) {
                    this.s[pI] += this.s[pI + 1].toString();
                }
                this.s[pI + 1] = '';
                sI++;
            }
            this.s[pI] = indent + this.s[pI] + this.newline;
        }
        let str = this.s.join('') + this.newline;
        return str;
    }
}
exports.Carn = Carn;
//
class Depth {
    constructor(depth, indent) {
        this.depth = depth;
        this.indent = indent;
    }
    toString() {
        return this.indent.repeat(this.depth);
    }
}
class Sep {
    constructor(separator) {
        this.separator = separator;
    }
    toString() {
        return this.separator;
    }
}
//# sourceMappingURL=carn.js.map