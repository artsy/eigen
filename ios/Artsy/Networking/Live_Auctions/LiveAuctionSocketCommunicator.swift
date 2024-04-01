import Foundation
import Interstellar
import Starscream

protocol LiveAuctionSocketCommunicatorType {
    var updatedAuctionState: Observable<AnyObject> { get }
    var lotUpdateBroadcasts: Observable<AnyObject> { get }
    var currentLotUpdate: Observable<AnyObject> { get }
    var postEventResponses: Observable<AnyObject> { get }
    var socketConnectionSignal: Observable<Bool> { get }
    var operatorConnectedSignal: Observable<AnyObject> { get }
    var saleOnHoldSignal: Observable<AnyObject> { get }

    func bidOnLot(_ lotID: String, amountCents: UInt64, bidderCredentials: BiddingCredentials, bidUUID: String)
    func leaveMaxBidOnLot(_ lotID: String, amountCents: UInt64, bidderCredentials: BiddingCredentials, bidUUID: String)
}

class LiveAuctionSocketCommunicator: NSObject, LiveAuctionSocketCommunicatorType {
    typealias SocketCreator = (_ host: String, _ saleID: String) -> WebSocketType
    fileprivate let socket: WebSocketType
    fileprivate let causalitySaleID: String
    fileprivate var timer: Timer? // Heartbeat to keep socket connection alive.

    let updatedAuctionState = Observable<AnyObject>()
    let lotUpdateBroadcasts = Observable<AnyObject>()
    let currentLotUpdate = Observable<AnyObject>()
    let postEventResponses = Observable<AnyObject>()
    let socketConnectionSignal = Observable<Bool>()
    let operatorConnectedSignal = Observable<AnyObject>()
    let saleOnHoldSignal = Observable<AnyObject>()

    let jwt: JWT

    convenience init(host: String, causalitySaleID: String, jwt: JWT) {
        self.init(host: host, causalitySaleID: causalitySaleID, jwt: jwt, socketCreator: LiveAuctionSocketCommunicator.defaultSocketCreator())
    }

    init(host: String, causalitySaleID: String, jwt: JWT, socketCreator: SocketCreator) {

        socket = socketCreator(host, causalitySaleID)
        self.causalitySaleID = causalitySaleID
        self.jwt = jwt

        super.init()

        setupSocket()
    }

    deinit {
        socket.disconnect(closeCode: CloseCode.normal.rawValue)
        timer?.invalidate()
        timer = nil
    }

    class func defaultSocketCreator() -> SocketCreator {
        return { host, saleID in
            let url = URL(string: "\(host)/socket?saleId=\(saleID)")
            let urlRequest = URLRequest(url: url!) // swiftlint:disable:this force_unwrapping
            let websocket = WebSocket(request: urlRequest)
            return websocket
        }
    }
}

private typealias SocketSetup = LiveAuctionSocketCommunicator
private extension SocketSetup {

    // Small class for breaking the reference cycle between the communicator and the timer.
    class TimerCaller {
        let callback: () -> Void
        init (callback: @escaping () -> Void) { self.callback = callback }
        @objc func invoke() { callback() }
    }

    /// Connects to, then authenticates against, the socket. Listens for sale events once authenticated.
    func setupSocket() {
        // Only allowed because we invalidate the timer in deinit
        let caller = TimerCaller { [unowned self] in
            self.pingSocket()
        }
        timer = Timer.scheduledTimer(timeInterval: 1, target: caller, selector: #selector(TimerCaller.invoke), userInfo: nil, repeats: true)
        socket.onEvent = { [unowned self] event in
            switch event {
            case .connected:
                self.socketConnected()
            case .disconnected(let error, _):
                self.socketDisconnected(error)
            case .text(let text):
                self.receivedText(text)
            case .error(let error):
                if let error {
                    print("Error occurred in socket connection \(error.localizedDescription)")
                } else {
                    print("Unknown error occurred in socket connection")
                }
            default:
                // TODO: Handle more cases?
                print("Unhandled socket event!")
            }
        }
        socket.connect()
    }

    func socketConnected() -> Void {
        print("Socket connected")
        socket.write(string: "{\"type\":\"Authorize\",\"jwt\":\"\(jwt.string)\"}", completion: nil)
        socketConnectionSignal.update(true)
        return Void()
    }

    func socketDisconnected(_ errorString: String) {
        print("Socket disconnected: \(errorString)")
        socketConnectionSignal.update(false)

        // Give it half a second to re-connect
        ar_dispatch_after(0.5) { [weak self] in
            self?.socket.connect()
        }
    }

    func pingSocket() -> Void {
        socket.write(string: "2", completion: nil)
    }

    func receivedText(_ text: String) {
        guard let
            data = text.data(using: String.Encoding.utf8),
            let _json = try? JSONSerialization.jsonObject(with: data, options: []),
            let json = _json as? [String: AnyObject] else {
            // TODO: Handle error
            return
        }

        let socketEventType = (json["type"] as? String) ?? "(No Event Specified)"
        print("Received socket event type: \(socketEventType).")


        switch socketEventType {

        case "InitialFullSaleState":
            updatedAuctionState.update(json as AnyObject)

        case "LotUpdateBroadcast":
            lotUpdateBroadcasts.update(json as AnyObject)

        case "OperationFailedEvent": break
            // TODO: Handle op failure

        case "OperatorConnectedBroadcast":
            operatorConnectedSignal.update(json as AnyObject)

        case "CommandSuccessful", "CommandFailed", "PostEventResponse":
            postEventResponses.update(json as AnyObject)

        case "SaleLotChangeBroadcast":
            currentLotUpdate.update(json as AnyObject)

        case "SaleNotFound": break
            // TODO: Handle this (?)

        case "PostEventFailedUnauthorized": fallthrough
        case "ConnectionUnauthorized": break
            // TODO: handle auth error.
        case "SaleOnHold":
            saleOnHoldSignal.update(json as AnyObject)
        default:
            print("Received unknown socket event type. Payload: \(json)")

        }
    }
}


private typealias PublicFunctions = LiveAuctionSocketCommunicator
extension PublicFunctions {
    func bidOnLot(_ lotID: String, amountCents: UInt64, bidderCredentials: BiddingCredentials, bidUUID: String) {
        guard let bidderID = bidderCredentials.bidderID, let paddleNumber = bidderCredentials.paddleNumber, let userID = bidderCredentials.userID else { return }
        writeJSON([
            "key": bidUUID,
            "type": "PostEvent",
            "event": [
                "type": "FirstPriceBidPlaced",
                "lotId": lotID,
                "amountCents": NSNumber(value: amountCents as UInt64),
                "bidder": [ "type": "ArtsyBidder", "bidderId": bidderID, "paddleNumber": paddleNumber, "userId": userID],
                "clientMetadata": clientMetadata()
            ]
        ] as NSDictionary)
    }

    func leaveMaxBidOnLot(_ lotID: String, amountCents: UInt64, bidderCredentials: BiddingCredentials, bidUUID: String) {
        guard let bidderID = bidderCredentials.bidderID, let paddleNumber = bidderCredentials.paddleNumber, let userID = bidderCredentials.userID else { return }

        writeJSON([
            "key": bidUUID,
            "type": "PostEvent",
            "event": [
                "type": "SecondPriceBidPlaced",
                "lotId": lotID,
                "amountCents": NSNumber(value: amountCents as UInt64),
                "bidder": [ "type": "ArtsyBidder", "bidderId": bidderID, "paddleNumber": paddleNumber, "userId": userID],
                "clientMetadata": clientMetadata()
            ]
        ] as NSDictionary)
    }

    func writeJSON(_ json: NSObject) {
        do {
            print(try json.stringify())
            socket.write(string: try json.stringify(), completion: nil)
        } catch {
            print("Error creating JSON string of socket event")
            return print(error)
        }
    }

    func clientMetadata() -> [String: String] {
        return ["User-Agent": ARRouter.userAgent()]
    }
}
