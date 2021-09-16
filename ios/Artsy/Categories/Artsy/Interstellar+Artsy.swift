import Interstellar

extension Observable {
    func peek() -> T? {
        return self.value
    }
}
