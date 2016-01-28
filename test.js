var reduce = require('./index.js')
var test = require('tape')

test('reduce', function (t) {

  // sum some things, no initial value.
  sum([1,2,3])
  sum(new Map([['0', 1], ['1', 2], ['2', 3]]))
  sum(new Set([1, 2, 3]))
  sum({'0': 1, '1': 2, '2': 3})
  var complex = new ComplexObject()
  sum(complex)

  // generators get exausted between the tests
  t.same(reduce(foo(), function (acc, val) {
    return acc + val
  }, 0), 6, 'sum generator')

  t.same(reduce(foo(), function (acc, val, key) {
    if (key === '2') return reduce.reduced(acc)
    return acc + val
  }, 0), 3, 'early reduced generator')
  
  ;(function () {
    sum(arguments)
  }(1,2,3))

  t.end()

  function sum (stuff) {
    t.same(reduce(stuff, function (acc, val) {
      return acc + val
    }, 0), 6, 'sum ' + stuff.constructor.name)

    t.same(reduce(stuff, function (acc, val, key) {
      if (key === '2') return reduce.reduced(acc)
      return acc + val
    }, 0), 3, 'early reduced ' + stuff.constructor.name)

  }
})

function* foo () {
  var count = 0
  while (count++ < 3) {
    yield count
  }
}

function ComplexObject () {
  this[0] = 3
  this[2] = 0
  this[Symbol('foo')] = 3
  Object.defineProperty(this, Symbol('baz'), {
    value: 1000,
    enumerable: false
  })
  Object.defineProperty(this, 'baz', {
    value: 1000,
    enumerable: false
  })
}
ComplexObject.prototype[Symbol('bar')] = 100
ComplexObject.prototype.bar = 100

