/// Given a closure T -> Void, returns a function that takes a T and invokes the closure. 
/// Useful for performing operations with curried functions. 
/// Ex: [a, b, c,].forEach(apply(self.function)) will call self.function with a, b, then c as parameters.
func apply<T>(closure: T -> Void)(instance: T) {
    closure(instance)
}

/// Given a closure T -> Void -> Void, returns a function that takes a T and invokes the resulting closure.
/// Useful for performing operations with curried functions.
/// Ex: [a, b, c,].forEach(apply(Class.function)) will call the class function with a, b, then c as instances, ie: function(a)(), function(b)(), function(c)().
func apply<T>(closure: T -> Void -> Void)(instance: T) {
    closure(instance)()
}
