import SocketIOClientSwift

extension SocketIOClient: SocketType {
    func on(event: SocketEvent, callback: [AnyObject] -> Void) -> NSUUID {
        return on(event.rawValue) { (data, _) in
            callback(data)
        }
    }

    func emit(event: SocketEvent, _ items: AnyObject...) {
        emit(event.rawValue, withItems: items)
    }
}
