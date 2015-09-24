var has = Object.prototype.hasOwnProperty
var toString = Object.prototype.toString
var hasSymbol = typeof Symbol === 'function'

reduce.reduced = Reduced

module.exports = reduce

function reduce (stuff, fn, acc) {
  if (!stuff) return acc
  if (hasSymbol && toString.call(stuff) === '[object Map]') {
    return reduceMap(stuff, fn, acc)
  }
  if (hasSymbol && Symbol.iterator && stuff[Symbol.iterator]) {
    return reduceIt(stuff[Symbol.iterator](), fn, acc)
  }
  return reduceObj(stuff, fn, acc)
}

function reduceObj (obj, fn, acc) {
  var first = true
  var next = acc
  for (var i in obj) {
    if (has.call(obj, i)) {
     if (first) {
       first = false
       if (typeof next === 'undefined') {
         next = obj[i]
         continue
       }
     }
     next = fn(next, obj[i], i)
     if (next instanceof Reduced) return next.val
    }
  }
  return next
}

function reduceIt (it, fn, acc) {
  var inserted = 0
  var step = null
  var next = acc
  var first = true
  while (true) {
    step = it.next()
    if (step.done) break;
    if (first) {
      first = false
      if (typeof next === 'undefined') {
        inserted++
        next = step.value
        continue
      }
    }
    next = fn(next, step.value, '' + inserted++)
    if (next instanceof Reduced) return next.val
  }
  return next
}

function reduceMap (map, fn, acc) {
  var step = null
  var next = acc
  var first = true
  var it = map[Symbol.iterator]()
  while (true) {
    step = it.next()
    if (step.done) break;
    if (first) {
      first = false
      if (typeof next === 'undefined') {
        next = step.value[1]
        continue
      }
    }
    next = fn(next, step.value[1], step.value[0])
    if (next instanceof Reduced) return next.val
  }
  return next
}

function Reduced (val) {
  if (!(this instanceof Reduced)) return new Reduced(val)
  this.val = val
}
