/* Copyright (c) 2023 Richard Rodger, MIT License */

class Carn {
  id: number
  newline = '\n'
  indent = '  '
  separator = ','
  dI = 0
  s: any[]

  constructor() {
    this.id = (1e6 * Math.random()) | 0
    this.s = []
  }

  start() {
    this.s = []
  }

  add(str: any) {
    if ('string' !== typeof str) {
      return
    }

    this.s.push(str)
  }

  sep() {
    this.s.push(new Sep(this.separator))
  }

  depth(descend: number) {
    if ('number' !== typeof descend) {
      return
    }

    this.dI += descend
    this.s.push(new Depth(this.dI, this.indent))
  }

  src() {
    let indent = ''
    for (let sI = 0; sI < this.s.length; sI++) {
      let pI = sI

      if (this.s[pI] instanceof Depth) {
        indent = this.s[pI].toString()
        this.s[pI] = ''
        continue
      }

      if (this.s[pI + 1] instanceof Sep) {
        if (!(this.s[pI + 2] instanceof Depth)) {
          this.s[pI] += this.s[pI + 1].toString()
        }
        this.s[pI + 1] = ''
        sI++
      }

      this.s[pI] = indent + this.s[pI] + this.newline
    }

    let str = this.s.join('') + this.newline
    return str
  }

  inject(text: string, name: string, marker: string[]) {
    let src = this.src()
    src = src.startsWith('\n') ? src : '\n' + src
    src = src.endsWith('\n') ? src : src + '\n'

    let mo = marker[0]
    let mc = marker[1]

    // TODO: jsonic escre
    const re = new RegExp(
      mo + 'START:' + name + mc + '.*?' + mo + 'END:' + name + mc,
      's'
    )
    let out = text.replace(
      re,
      mo + 'START:' + name + mc + src + mo + 'END:' + name + mc
    )
    return out
  }
}

//

class Depth {
  indent: string
  depth: number
  constructor(depth: number, indent: string) {
    this.depth = depth
    this.indent = indent
  }
  toString() {
    return this.indent.repeat(this.depth)
  }
}

class Sep {
  separator: string
  constructor(separator: string) {
    this.separator = separator
  }
  toString() {
    return this.separator
  }
}

export { Carn }
