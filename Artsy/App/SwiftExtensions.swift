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

    /// Returns the subarray formed from the first differing index to the end of
    /// the receiver. If the receiver and parameter share no common element,
    /// the receiver is returned.
    func subarrayFromFirstDifference(other: [Element]) -> [Element] {
        guard let firstDifferentIndex = indexOfFirstDifferentElement(other) else {
            return self
        }

        return Array(self[firstDifferentIndex..<count])
    }

    /// Loops through the receiver and parameter and returns the first index where
    /// the two have differing elements. Returns nil iff either of the arrays is
    /// entirely looped over with no differing elements found.
    func indexOfFirstDifferentElement(other: [Element]) -> Index? {
        var index = 0

        while index < self.count && index < other.count {
            if self[index] == other[index] {
                return index
            }
            index += 1
        }

        return nil
    }
}
