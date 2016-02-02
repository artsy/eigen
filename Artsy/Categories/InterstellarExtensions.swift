import Foundation
import Interstellar

/// Convenience function for invoking callback with the given error.
func passOnFailure<T>(callback: Result<T> -> Void) -> (NSError!) -> Void {
    return { error in
        callback(.Error(error))
    }
}
