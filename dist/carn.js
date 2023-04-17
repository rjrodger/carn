"use strict";
/* Copyright (c) 2023 Richard Rodger, MIT License */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carn = void 0;
class CarnContext {
    constructor(id) {
        this.start = -1;
        this.finish = -1;
        this.errs = [];
        // Before start, always bail.
        this.bail = true;
        this.id = id;
        this.run = -1;
    }
    error(code, details, ...rest) {
        let err = new CarnError(this.id, this.run, code, details, ...rest);
        this.errs.push(err);
        if (this.bail) {
            throw err;
        }
        return err;
    }
    throw(code, details, ...rest) {
        throw this.error(code, details, ...rest);
    }
    init(run) {
        this.run = run;
        this.start = Date.now();
        // Once started, collect errors (except for not-active)
        this.bail = false;
    }
    check() {
        return this.active() || this.throw('not_active');
    }
    active() {
        return 0 < this.start && this.finish < 0;
    }
    finished() {
        return 0 < this.finish;
    }
}
class CarnError extends Error {
    constructor(cid, crun, code, details, ...rest) {
        rest = 'string' === typeof details ? [details, ...rest] :
            rest && 'string' === typeof rest[0] ? rest :
                [CarnError.Code[code] || code, ...rest];
        rest[0] += ` [id=${cid},run=${crun}]` +
            (details ?
                ' {' + Object.keys(details).map(k => k + ':' + details[k]) + '}' : '');
        super(...rest);
        this.code = code;
        this.cid = cid;
        this.crun = crun;
    }
}
CarnError.Code = {
    not_active: 'Carn instance is not active (call Carn.start())',
    already_started: 'Carn instance is already started',
    invalid_depth: 'Invalid depth (<0)'
};
class Carn {
    constructor() {
        this.newline = '\n';
        this.indent = '  ';
        this.separator = ',';
        this.dI = 0;
        this.id = (1e6 * Math.random()) | 0;
        this.run = -1;
        this.s = [];
        this.ctx = new CarnContext(this.id);
    }
    // Can be started multiple times, but must be in new or finished state.
    start() {
        if (-1 == this.ctx.start || this.ctx.finished()) {
            this.s = [];
            this.run = (1e6 * Math.random()) | 0;
            this.ctx = new CarnContext(this.id);
            this.ctx.init(this.run);
        }
        else {
            this.ctx.error('already_started');
        }
        return this.ctx;
    }
    add(str) {
        this.ctx.check();
        if ('string' !== typeof str) {
            return;
        }
        this.s.push(str);
    }
    sep() {
        this.ctx.check();
        this.s.push(new Sep(this.separator));
    }
    depth(move, relative) {
        this.ctx.check();
        if ('number' === typeof move) {
            relative = null == relative ? true : !!relative;
            let dI = relative ? this.dI + move : move;
            if (dI < 0) {
                this.ctx.error('invalid_depth', {
                    move,
                    relative,
                    depth: dI,
                });
            }
            this.dI = dI;
            this.s.push(new Depth(this.dI, this.indent));
        }
        return this.dI;
    }
    finish() {
        this.ctx.check();
        this.ctx.finish = Date.now();
        return this.ctx;
    }
    // TODO: remove spurious newline at end
    src() {
        // src() can be called before finish
        if (this.ctx.start < 0) {
            this.ctx.throw('not_active');
        }
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
        let str = this.s.join('');
        return str;
    }
    inject(text, name, marker) {
        let src = this.src();
        src = src.startsWith('\n') ? src : '\n' + src;
        src = src.endsWith('\n') ? src : src + '\n';
        let mo = marker[0];
        let mc = marker[1];
        // TODO: jsonic escre
        const re = new RegExp(mo + 'START:' + name + mc + '.*?' + mo + 'END:' + name + mc, 's');
        let out = text.replace(re, mo + 'START:' + name + mc + src + mo + 'END:' + name + mc);
        return out;
    }
}
exports.Carn = Carn;
//
class Depth {
    constructor(depth, indent) {
        this.depth = depth < 0 ? 0 : depth;
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