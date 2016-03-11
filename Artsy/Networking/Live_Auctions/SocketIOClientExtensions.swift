import SocketIOClientSwift

extension SocketIOClient {
    func on(event: SocketEvent, callback: NormalCallback) -> NSUUID {
        return on(event.rawValue, callback: callback)
    }

    func emit(event: SocketEvent, _ items: AnyObject...) {
        emit(event.rawValue, withItems: items)
    }
}