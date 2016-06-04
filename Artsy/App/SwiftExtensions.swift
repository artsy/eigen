/// Given a closure T -> Void, returns a function that takes a T and invokes the closure.
/// Useful for performing operations with curried functions.
/// Ex: [a, b, c,].forEach(apply(self.function)) will call self.function with a, b, then c as parameters.
func apply<T>(closure: T -> Void) -> (T -> Void) {
    return { instance in
        closure(instance)
    }
}

// Applies an instance method to the instance with an unowned reference.
func applyUnowned<Type: AnyObject, Parameters, ReturnValue>(instance: Type, _ function: (Type -> Parameters -> ReturnValue)) -> (Parameters -> ReturnValue) {
    return { [unowned instance] parameters -> ReturnValue in
        return function(instance)(parameters)
    }
}

// "Adds" two dictionaries of corresponding types. Duplicated keys result in rhs taking priority.
func +<K, V>(lhs: Dictionary<K, V>, rhs: Dictionary<K, V>) -> Dictionary<K, V> {
    // This is possible using reduce, but the imperative method is a lot more readable.
    var copy = lhs
    for (key, value) in rhs {
        copy[key] = value
    }
    return copy
}

extension CGFloat {
    mutating func capAtMax(max: CGFloat?, min: CGFloat?) {
        if let min = min {
            self = Swift.max(self, min)
        }
        if let max = max {
            self = Swift.min(self, max)
        }
    }
}
