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

extension Array where Element: Equatable {
    // Loops through the receiver and returns the subarray of the receiver, starting from the first occurence of a difference in the two arrays.
    func subarrayFromFirstDifference(other: [Element]) -> [Element] {
        var i = 0
        repeat {
            i += 1
        } while i < self.count && i < other.count && self[i] != other[i]

        return Array(self[i..<count])
    }
}
