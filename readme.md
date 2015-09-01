# Universal Reduce

Reduce over anything vaguely collection like. Objects, Arrays, Maps, Sets,
Generators, iterables of any kind. Supports early reduction.

Works in *very* old JS environments, and does its best to get the same results.

```javascript
var universalReduce = require('universal-reduce')
```

## API

### universalReduce(anything, fn[, initial])

Works the same as Array.prototype.reduce, except that it can be used
on anything.

`fn(accumulator, value, key) -> accumulator`. fn is called for each item in
anything, receiving the previous result of calling fn, the value of the item,
and a reasonable key value. The first call is seeded with initial if provided,
otherwise we skip the first call, and seed the second call with the 'value'
that would have been passed to the first call.

For non-Map iterables 'key' is the string representation of the integer index
based on the order it has been iterated to. This gives the most consistent
results, Arrays and arguments objects behave the same if they are being
iterated as objects or iterables.

When iterating over an Object, only looks at own properties.

### universalReduce.reduced(value)

When you've arrived at the final value of your reduction, you can short circuit
to avoid iterating over items you don't need to. Very important if you are
searching through a large, or even potentially infinite list for example.
From inside the reducer, `return universalReduce.reduced(value)` at any time
to cut the reduction short, and return value as the final result.

