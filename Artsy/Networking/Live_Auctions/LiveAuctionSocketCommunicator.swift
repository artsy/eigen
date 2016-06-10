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
    var postEventResponses: Observable<AnyObject> { get }
    var socketConnectionSignal: Observable<Bool> { get }
    var operatorConnectedSignal: Observable<AnyObject> { get }

    func bidOnLot(lotID: String, amountCents: UInt64, bidderCredentials: BiddingCredentials, bidUUID: String)
    func leaveMaxBidOnLot(lotID: String, amountCents: UInt64, bidderCredentials: BiddingCredentials, bidUUID: String)
}

class LiveAuctionSocketCommunicator: NSObject, LiveAuctionSocketCommunicatorType {
    typealias SocketCreator = (host: String, saleID: String) -> SocketType
    private let socket: SocketType
    private let causalitySaleID: String
    private var timer: NSTimer? // Heartbeat to keep socket connection alive.

    let updatedAuctionState = Observable<AnyObject>()
    let lotUpdateBroadcasts = Observable<AnyObject>()
    let currentLotUpdate = Observable<AnyObject>()
    let postEventResponses = Observable<AnyObject>()
    let socketConnectionSignal = Observable<Bool>()
    let operatorConnectedSignal = Observable<AnyObject>()

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
            let websocket = WebSocket(url: url!) // swiftlint:disable:this force_unwrapping
            websocket.origin = nil
            return websocket
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
        timer = NSTimer.scheduledTimerWithTimeInterval(1, target: caller, selector: #selector(TimerCaller.invoke), userInfo: nil, repeats: true)
        socket.onText = applyUnowned(self, LiveAuctionSocketCommunicator.receivedText)
        socket.onConnect = applyUnowned(self, LiveAuctionSocketCommunicator.socketConnected)
        socket.onDisconnect = applyUnowned(self, LiveAuctionSocketCommunicator.socketDisconnected)
        socket.connect()
    }

    func socketConnected() {
        print ("Socket connected")
        socket.writeString("{\"type\":\"Authorize\",\"jwt\":\"\(jwt.string)\"}")
        socketConnectionSignal.update(true)
    }

    func socketDisconnected(error: NSError?) {
        print ("Socket disconnected: \(error)")
        socketConnectionSignal.update(false)

        // Give it half a second to re-connect
        ar_dispatch_after(0.5) {
            self.socket.connect()
        }
    }

    func pingSocket() {
        socket.writePing()
    }

    func receivedText(text: String) {
        guard let
            data = text.dataUsingEncoding(NSUTF8StringEncoding),
            _json = try? NSJSONSerialization.JSONObjectWithData(data, options: []),
            json = _json as? [String: AnyObject] else {
            // TODO: Handle error
            return
        }

        let socketEventType = (json["type"] as? String) ?? "(No Event Specified)"
        print("Received socket event type: \(socketEventType).")


        switch socketEventType {

        case "InitialFullSaleState":
            updatedAuctionState.update(json)

        case "LotUpdateBroadcast":
            print("lot update:", json)
            lotUpdateBroadcasts.update(json)    

        case "OperationFailedEvent": break
            // TODO: Handle op failure

        case "OperatorConnectedBroadcast":
            operatorConnectedSignal.update(json)

        case "CommandSuccessful", "CommandFailed", "PostEventResponse":
            postEventResponses.update(json)

        case "SaleLotChangeBroadcast":
            currentLotUpdate.update(json)

        case "SaleNotFound": break
            // TODO: Handle this (?)

        case "PostEventFailedUnauthorized": fallthrough
        case "ConnectionUnauthorized": break
            // TODO: handle auth error.

        default:
            print("Received unknown socket event type. Payload: \(json)")

        }
    }
}


private typealias PublicFunctions = LiveAuctionSocketCommunicator
extension PublicFunctions {
    func bidOnLot(lotID: String, amountCents: UInt64, bidderCredentials: BiddingCredentials, bidUUID: String) {
        guard let bidderID = bidderCredentials.bidderID, paddleNumber = bidderCredentials.paddleNumber else { return }
        writeJSON([
            "key": bidUUID,
            "type": "PostEvent",
            "event": [
                "type": "FirstPriceBidPlaced",
                "lotId": lotID,
                "amountCents": NSNumber(unsignedLongLong: amountCents),
                "bidder": [ "type": "ArtsyBidder", "bidderId": bidderID, "paddleNumber": paddleNumber]
            ]
        ])
    }

    func leaveMaxBidOnLot(lotID: String, amountCents: UInt64, bidderCredentials: BiddingCredentials, bidUUID: String) {
        guard let bidderID = bidderCredentials.bidderID, paddleNumber = bidderCredentials.paddleNumber else { return }

        writeJSON([
            "key": bidUUID,
            "type": "PostEvent",
            "event": [
                "type": "SecondPriceBidPlaced",
                "lotId": lotID,
                "amountCents": NSNumber(unsignedLongLong: amountCents),
                "bidder": [ "type": "ArtsyBidder", "bidderId": bidderID, "paddleNumber": paddleNumber]
            ]
        ])
    }

    func writeJSON(json: NSObject) {
        do {
            print(try json.stringify())
            socket.writeString(try json.stringify())
        } catch {
            print("Error creating JSON string of socket event")
            return print(error)
        }
    }
}
