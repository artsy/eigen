import Foundation
import Interstellar

enum LiveAuctionBiddingProgressState {
    case UserRegistrationRequired
    case UserRegistrationPending
    case UserRegistrationClosed
    case Biddable(askingPrice: UInt64, currencySymbol: String)
    case BiddingInProgress
    case BidAcknowledged
    case BidBecameMaxBidder
    case BidOutbid
    case BidNetworkFail
    case LotWaitingToOpen
    case LotSold
}

func == (lhs: LiveAuctionBiddingProgressState, rhs: LiveAuctionBiddingProgressState) -> Bool {
    switch (lhs, rhs) {
    case (.UserRegistrationRequired, .UserRegistrationRequired): return true
    case (.UserRegistrationPending, .UserRegistrationPending): return true
    case (.UserRegistrationClosed, .UserRegistrationClosed): return true
    case (.Biddable(let lhsState), .Biddable(let rhsState)) where lhsState.askingPrice == rhsState.askingPrice && lhsState.currencySymbol == rhsState.currencySymbol: return true
    case (.BiddingInProgress, .BiddingInProgress): return true
    case (.BidBecameMaxBidder, .BidBecameMaxBidder): return true
    case (.BidAcknowledged, .BidAcknowledged): return true
    case (.BidNetworkFail, .BidNetworkFail): return true
    case (.LotWaitingToOpen, .LotWaitingToOpen): return true
    case (.LotSold, .LotSold): return true
    case (.BidOutbid, .BidOutbid): return true

    default: return false
    }
}

class LiveAuctionBidViewModel: NSObject {
    let lotViewModel: LiveAuctionLotViewModelType
    let salesPerson: LiveAuctionsSalesPersonType

    // This mutates as someone increments/decrements, first set in the initializer.
    var currentBid: UInt64 = 0

    // For a stepper UI, a better data structure would be a doubly-linked list.
    // But we're switching to a UI that will be best with an array: https://github.com/artsy/eigen/issues/1579
    private var bidIncrements: [UInt64] = []

    init(lotVM: LiveAuctionLotViewModelType, salesPerson: LiveAuctionsSalesPersonType) {
        self.lotViewModel = lotVM
        self.salesPerson = salesPerson

        super.init()

        let askingPrice = lotViewModel.askingPriceSignal.peek() ?? UInt64(0)
        currentBid = salesPerson.bidIncrements.minimumNextBidCentsIncrement(askingPrice)

        bidIncrements = [currentBid]

        var i = 0
        repeat {
            let nextBid = salesPerson.bidIncrements.minimumNextBidCentsIncrement(bidIncrements[i])
            bidIncrements += [nextBid]
            i += 1
        } while bidIncrements[i] < (3 * max(lotVM.askingPrice, lotVM.highEstimateCents))
    }

    var currentLotValue: UInt64 {
        return salesPerson.currentLotValue(lotViewModel)
    }

    var currentLotValueString: String {
        return salesPerson.currentLotValueString(lotViewModel)
    }

    var currentBidDollars: String {
        return currentBid.convertToDollarString(lotViewModel.currencySymbol)
    }

    var nextBidIncrementDollars: String {
        let bidIncrementCents = nextBidCents(currentBid) - currentBid
        return bidIncrementCents.convertToDollarString(lotViewModel.currencySymbol)
    }

    var currentBidsAndReserve: String {
        let bids = lotViewModel.numberOfBids
        let bidString = bids == 1 ? "\(bids) bid" : "\(bids) bids"
        return "(\(bidString) \(lotViewModel.reserveStatusString))"
    }

    var canMakeLowerBids: Bool {
        return currentBid > bidIncrements.first
    }

    func nextBidCents(bid: UInt64) -> UInt64 {
        return bidIncrements.first { $0 > bid } ?? bid
    }

    func previousBidCents(bid: UInt64) -> UInt64 {
        return bidIncrements.last { $0 < bid } ?? bid
    }
}

// Bridges BiddingIncrementStrategy ObjC class to a protocol.
public protocol BidIncrementStrategyType: Comparable {
    var from: NSNumber! { get }
    var amount: NSNumber! { get }
}

extension BidIncrementStrategy: BidIncrementStrategyType { }

public func < <T: BidIncrementStrategyType>(lhs: T, rhs: T) -> Bool {
    return lhs.from.unsignedLongLongValue < rhs.from.unsignedLongLongValue
}

public func ==<T: BidIncrementStrategyType>(lhs: T, rhs: T) -> Bool {
    return lhs.from.unsignedLongLongValue == rhs.from.unsignedLongLongValue
}

extension Array where Element: BidIncrementStrategyType {
    func minimumNextBidCentsIncrement(bid: UInt64) -> UInt64 {
        let matchingIncrement = self.reduce(nil, combine: { (memo, e) -> Element? in
            // We want to find the first increment whose from exceed bid, and return memo (the increment before it).
            if e.from.unsignedLongLongValue > bid {
                return memo
            } else {
                // If we haven't surpassed the bid yet, return the next "previous value"
                return e
            }
        }) ?? last // If we exhausted the list, use the last, largest element.

        return bid + (matchingIncrement?.amount.unsignedLongLongValue ?? bid) // Default to satisfy compiler, or an empty strategy from the API (unlikely)
    }
}
