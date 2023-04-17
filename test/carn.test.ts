/* Copyright (c) 2023 Richard Rodger, MIT License */

import { Carn } from '..'

describe('carn', () => {
  test('happy', () => {
    const c0 = new Carn()
    expect(0 < c0.id).toEqual(true)

    c0.start()
    c0.add('{')
    c0.depth(1)
    c0.add('a:1')
    c0.sep()
    c0.add('b:2')
    c0.sep()
    c0.depth(-1)
    c0.add('}')

    // console.log(c0.s)

    let src = c0.src()
    // console.log('SRC')
    // console.log(src)

    expect(src).toEqual(`{
  a:1,
  b:2
}
`)
  })


  test('optsdesc', () => {
    const optsdesc = {
      foo: {
        type: 'string',
        short: 'Set the foo value',
      },
      bar: {
        type: 'number',
        short: 'Set the bar counter',
      },
    }

    const c0 = new Carn()

    c0.start()
    c0.add('# Options')
    Object.entries(optsdesc).forEach((entry) => {
      let name = entry[0]
      let { type, short } = entry[1]
      c0.add(`* ${name}: ${type} - ${short}`)
    })

    let src = c0.src()
    console.log('OPTS')
    console.log(src)
  })


  test('basic-error', () => {
    const c0 = new Carn()

    // c0.add('BAD')

    expect(() => c0.add('BAD')).toThrow('Carn')

    const ctx = c0.start()
    c0.depth(-1, false)

    // console.log(ctx)
    expect(ctx.errs.length).toEqual(1)
    expect(ctx.errs[0].code).toEqual('invalid_depth')
  })

})
