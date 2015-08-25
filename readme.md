# Universal Reduce

Reduce over anything vaguely collection like. Objects, Arrays, Maps, Sets,
Generators, etc. Supports early reduction.

Does its best to work in old JS environments, and get the same results.

```javascript
var universalReduce = require('universal-reduce')
```

## API

### universalReduce(anything, fn[, initial])

Works the same as Array.prototype.reduce, except that it can be used
on anything.

`return universalReduce.reduced(value)` at any time to cut the 
reduction short, and return value as the final result.

`fn(accumulator, value, key) -> accumulator`. fn is called for each item in
anything, receiving the previous result of calling fn, the value of the item,
and a reasonable key value. The first call is seeded with initial if provided,
otherwise we skip the first call, and seed the second call with the 'value'
that would have been passed to the first call.

For non-Map iterables 'key' is the string representation of the integer index
based on the order it has been iterated to. This is so Arrays and arguments
objects behave the same in all environments.

Only iterates over own properties of objects.

