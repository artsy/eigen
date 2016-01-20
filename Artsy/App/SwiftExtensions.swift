/// Given a closure T -> Void, returns a function that takes a T and invokes the closure. 
/// Useful for performing operations with curried functions. 
/// Ex: [a, b, c,].forEach(apply(self.function)) will call self.function with a, b, then c as parameters.
func apply<T>(closure: T -> Void)(instance: T) {
    closure(instance)
}
