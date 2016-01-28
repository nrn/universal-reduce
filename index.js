var has = Object.prototype.hasOwnProperty
var toString = Object.prototype.toString
var enumerable = Object.prototype.propertyIsEnumerable
var hasSymbol = typeof Symbol === 'function'

reduce.reduced = Reduced
reduce.isReduced = isReduced
reduce.unwrap = unwrap

module.exports = reduce

function reduce (stuff, fn, acc) {
  if (!stuff) return acc
  if (toString.call(stuff) === '[object Map]') {
    return reduceMap(stuff, fn, acc)
  }
  if (hasSymbol && Symbol.iterator && stuff[Symbol.iterator]) {
    return reduceIt(stuff[Symbol.iterator](), fn, acc)
  }
  return reduceObj(stuff, fn, acc)
}

function reduceObj (obj, fn, acc) {
  var next = acc
  for (var i in obj) {
    if (has.call(obj, i)) {
      next = fn(next, obj[i], i)
      if (isReduced(next)) return next['@@transducer/value']
    }
  }
  if (typeof Object.getOwnPropertySymbols === 'function') {
    var symbols = Object.getOwnPropertySymbols(obj)
    var key
    for (var j = 0; j < symbols.length; j++) {
      key = symbols[j]
      if (enumerable.call(obj, key)) {
        next = fn(next, obj[key], key)
        if (isReduced(next)) return next['@@transducer/value']
      }
    }
  }
  return next
}

function reduceIt (it, fn, acc) {
  var inserted = 0
  var step = null
  var next = acc
  while (true) {
    step = it.next()
    if (step.done) break;
    next = fn(next, step.value, '' + inserted++)
    if (isReduced(next)) return next['@@transducer/value']
  }
  return next
}

function reduceMap (map, fn, acc) {
  var step = null
  var next = acc
  var it = map.entries()
  while (true) {
    step = it.next()
    if (step.done) break;
    next = fn(next, step.value[1], step.value[0])
    if (isReduced(next)) return next['@@transducer/value']
  }
  return next
}

function Reduced (val) {
  return {
    '@@transducer/reduced': true,
    '@@transducer/value': val
  }
}

function unwrap (val) {
  while (isReduced(val)) {
    val = val['@@transducer/value']
  }
  return val
}

function isReduced (val) {
  if (val == null) return false
  return val['@@transducer/reduced'] === true
}
