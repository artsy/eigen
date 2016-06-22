import Interstellar

extension Observable {
    /// Note: It is the caller's responsibility to ensure the return value is strongly referenced.
    @warn_unused_result
    func merge<U>(merge: Observable<U>) -> Observable<(T, U)> {
        let signal = Observable<(T, U)>()
        self.subscribe { [weak signal] a in
            if let b = merge.peek() {
                signal?.update((a, b))
            }
        }
        merge.subscribe { [weak signal] b in
            if let a = self.peek() {
                signal?.update((a, b))
            }
        }

        return signal
    }
}
