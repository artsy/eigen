/// Given a closure T -> Void, returns a function that takes a T and invokes the closure.
/// Useful for performing operations with curried functions.
/// Ex: [a, b, c,].forEach(apply(self.function)) will call self.function with a, b, then c as parameters.
func apply<T>(_ closure: @escaping (T) -> Void) -> ((T) -> Void) {
    return { instance in
        closure(instance)
    }
}

// Applies an instance method to the instance with an unowned reference.
func applyUnowned<Type: AnyObject, Parameters, ReturnValue>(_ instance: Type, _ function: @escaping ((Type) -> (Parameters) -> ReturnValue)) -> ((Parameters) -> ReturnValue) {
    return { [unowned instance] parameters -> ReturnValue in
        return function(instance)(parameters)
    }
}

// Applies an instance method to the instance with a weak reference. If the instance is nil, the function is not invoked.
func applyWeakly<Type: AnyObject, Parameters>(_ instance: Type, _ function: @escaping ((Type) -> (Parameters) -> Void)) -> ((Parameters) -> Void) {
    return { [weak instance] parameters in
        guard let instance = instance else { return }
        function(instance)(parameters)
    }
}

// TODO: Ash look at this!

// Applies an instance method to the instance with an unowned reference.
func applyUnownedNoParams<Type: AnyObject, Parameters, ReturnValue>(_ instance: Type, _ function: @escaping ((Type) -> (Parameters) -> ReturnValue)) -> ((Parameters) -> ReturnValue) {
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
    mutating func capAtMax(_ max: CGFloat?, min: CGFloat?) {
        if let min = min {
            self = Swift.max(self, min)
        }
        if let max = max {
            self = Swift.min(self, max)
        }
    }
}

extension Collection {
    var isNotEmpty: Bool {
        return isEmpty == false
    }
}

protocol Occupiable {
    var isEmpty: Bool { get }
    var isNotEmpty: Bool { get }
}

extension Occupiable {
    var isNotEmpty: Bool { return !isEmpty }
}

// Required for Xcode 8/9 compatibility. Can be dropped when we move to Swift 4.
extension String: Occupiable {
    var isNotEmpty: Bool {
        return !isEmpty
    }
}

extension Array {
    mutating func remove(matching closure: @escaping ((Element) -> Bool)) -> Element? {
        return enumerated().reduce(nil, { (memo, e) -> Element? in
            guard let memo = memo else {
                return (closure(e.element) ? self.remove(at: e.offset) : nil)
            }
            return memo
        })
    }

    func first(_ closure: ((Element) -> Bool)) -> Element? {
        return reduce(nil) { (memo, element) in
            return memo ?? (closure(element) ? element : nil)
        }
    }

    func last(_ closure: ((Element) -> Bool)) -> Element? {
        return reversed().first(closure)
    }
}
