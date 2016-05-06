import Foundation
import Interstellar
import Starscream

protocol SocketType: class {
    var onText: ((String) -> Void)? { get set }
    var onConnect: ((Void) -> Void)? { get set }
    var onDisconnect: ((NSError?) -> Void)? { get set }

    func writeString(str: String)
    func writePing()

    func connect()
    func disconnect()
}

protocol LiveAuctionSocketCommunicatorType {
    var updatedAuctionState: Observable<AnyObject> { get }
    var lotUpdateBroadcasts: Observable<AnyObject> { get }
    var currentLotUpdate: Observable<AnyObject> { get }

    func bidOnLot(lotID: String)
    func leaveMaxBidOnLot(lotID: String)
}

class LiveAuctionSocketCommunicator: NSObject, LiveAuctionSocketCommunicatorType {
    typealias SocketCreator = (host: String, saleID: String) -> SocketType
    private let socket: SocketType
    private let causalitySaleID: String
    private var timer: NSTimer? // Heartbeat to keep socket connection alive.

    let updatedAuctionState = Observable<AnyObject>()
    let lotUpdateBroadcasts = Observable<AnyObject>()
    let currentLotUpdate = Observable<AnyObject>()

    let jwt: JWT

    convenience init(host: String, causalitySaleID: String, jwt: JWT) {
        self.init(host: host, causalitySaleID: causalitySaleID, jwt: jwt, socketCreator: LiveAuctionSocketCommunicator.defaultSocketCreator())
    }

    init(host: String, causalitySaleID: String, jwt: JWT, socketCreator: SocketCreator) {

        socket = socketCreator(host: host, saleID: causalitySaleID)
        self.causalitySaleID = causalitySaleID
        self.jwt = jwt

        super.init()

        setupSocket()
    }

    deinit {
        socket.disconnect()
        timer?.invalidate()
        timer = nil
    }

    class func defaultSocketCreator() -> SocketCreator {
        return { host, saleID in
            let url = NSURL(string: "\(host)/socket?saleId=\(saleID)")
            return WebSocket(url: url!)
        }
    }
}

private typealias SocketSetup = LiveAuctionSocketCommunicator
private extension SocketSetup {

    // Small class for breaking the reference cycle between the communicator and the timer.
    class TimerCaller {
        let callback: () -> Void
        init (callback: () -> Void) { self.callback = callback }
        @objc func invoke() { callback() }
    }

    /// Connects to, then authenticates against, the socket. Listens for sale events once authenticated.
    func setupSocket() {
        let caller = TimerCaller(callback: applyUnowned(self, LiveAuctionSocketCommunicator.pingSocket)) // Only allowed because we invalidate the timer in deinit
        self.timer = NSTimer.scheduledTimerWithTimeInterval(1, target: caller, selector: #selector(TimerCaller.invoke), userInfo: nil, repeats: true)
        socket.onText = applyUnowned(self, LiveAuctionSocketCommunicator.receivedText)
        socket.onConnect = applyUnowned(self, LiveAuctionSocketCommunicator.socketConnected)
        socket.onDisconnect = applyUnowned(self, LiveAuctionSocketCommunicator.socketDisconnected)
        socket.connect()
    }

    func socketConnected() {
        socket.writeString("{\"type\":\"Authorize\",\"jwt\":\"\(jwt)\"}")
    }

    func socketDisconnected(error: NSError?) {
        print ("Socket disconnected: \(error)")
        // TODO: Handle error condition?
        socket.connect()
    }

    func pingSocket() {
        socket.writePing()
    }

    func receivedText(text: String) {
        guard let data = text.dataUsingEncoding(NSUTF8StringEncoding),
              let _json = try? NSJSONSerialization.JSONObjectWithData(data, options: []),
              let json = _json as? [String: AnyObject] else {
            // TODO: Handle error
            return
        }

        let socketEventType = (json["type"] as? String) ?? "(No Event Specified)"
        print("Received socket event type: \(socketEventType).")


        switch socketEventType {

        case "InitialFullSaleState":
            updatedAuctionState.update(json)

        case "LotUpdateBroadcast":
            lotUpdateBroadcasts.update(json)

        case "OperationFailedEvent": break;
            // TODO: Handle op failure

        case "PostEventResponse": break;
            // TODO: Handle event response (?)

        case "SaleLotChangeBroadcast":
            currentLotUpdate.update(json)

        case "SaleNotFound": break;
            // TODO: Handle this (?)

        case "ConnectionUnauthorized": break;
            // TODO: handle auth error.

        default:
            print("Received unknown socket event type. Payload: \(json)")

        }
    }
}


private typealias PublicFunctions = LiveAuctionSocketCommunicator
extension PublicFunctions {
    func bidOnLot(lotID: String) {
        // TODO: implement
    }

    func leaveMaxBidOnLot(lotID: String) {
        // TODO: implement
    }
}
