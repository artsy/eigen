import Interstellar

extension Observable {
    func merge<U>(merge: Observable<U>) -> Observable<(T,U)> {
        let signal = Observable<(T,U)>()
        self.subscribe { a in
            if let b = merge.peek() {
                signal.update((a,b))
            }
        }
        merge.subscribe { b in
            if let a = self.peek() {
                signal.update((a,b))
            }
        }

        return signal
    }
}