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
