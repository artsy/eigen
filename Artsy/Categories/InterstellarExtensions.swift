import Foundation
import Interstellar

/// Convenience function for invoking callback with the given error.
func passOnFailure<T>(callback: Result<T> -> Void) -> (NSError!) -> Void {
    return { error in
        callback(.Error(error))
    }
}

extension Signal {
    /// Injects a signal into the receiver, but ignores the injected signals values.
    /// Useful for injecting side-effects into a signal chain.
    func inject<OtherType>(signal: Signal<OtherType>) -> Signal<T> {
        return self.flatMap { (originalElement, callback) in
            return signal.map { _ in
                return originalElement
            }
        }
    }
}
