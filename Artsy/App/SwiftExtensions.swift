/// Given a closure T -> Void, returns a function that takes a T and invokes the closure. 
/// Useful for performing operations with curried functions. 
/// Ex: [a, b, c,].forEach(apply(self.function)) will call self.function with a, b, then c as parameters.
/// See also: ^ operator.
func apply<T>(closure: T -> Void)(instance: T) {
    closure(instance)
}

prefix operator ^ { }
prefix func ^<T>(closure: T -> Void)(instance: T) {
    return apply(closure)(instance: instance)
}
