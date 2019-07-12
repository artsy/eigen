import Foundation
import Interstellar
// FIXME: comparison operators with optionals were removed from the Swift Standard Libary.
// Consider refactoring the code to use the non-optional operators.
fileprivate func < <T : Comparable>(lhs: T?, rhs: T?) -> Bool {
  switch (lhs, rhs) {
  case let (l?, r?):
    return l < r
  case (nil, _?):
    return true
  default:
    return false
  }
}

// FIXME: comparison operators with optionals were removed from the Swift Standard Libary.
// Consider refactoring the code to use the non-optional operators.
fileprivate func > <T : Comparable>(lhs: T?, rhs: T?) -> Bool {
  switch (lhs, rhs) {
  case let (l?, r?):
    return l > r
  default:
    return rhs < lhs
  }
}

enum LiveAuctionBiddingProgressState {
    case userRegistrationRequired
    case userRegistrationPending
    case userRegistrationClosed
    case biddable(askingPrice: UInt64, currencySymbol: String)
    case biddingInProgress
    case bidNotYetAccepted(askingPrice: UInt64, currencySymbol: String)
    case bidAcknowledged
    case bidBecameMaxBidder
    case bidOutbid
    case bidNetworkFail
    case bidFailed(reason: String)
    case lotWaitingToOpen
    case lotSold
}

func == (lhs: LiveAuctionBiddingProgressState, rhs: LiveAuctionBiddingProgressState) -> Bool {
    switch (lhs, rhs) {
    case (.userRegistrationRequired, .userRegistrationRequired): return true
    case (.userRegistrationPending, .userRegistrationPending): return true
    case (.userRegistrationClosed, .userRegistrationClosed): return true
    case (.biddable(let lhsState), .biddable(let rhsState)) where lhsState.askingPrice == rhsState.askingPrice && lhsState.currencySymbol == rhsState.currencySymbol: return true
    case (.biddingInProgress, .biddingInProgress): return true
    case (.bidBecameMaxBidder, .bidBecameMaxBidder): return true
    case (.bidNotYetAccepted(let lhsState), .bidNotYetAccepted(let rhsState)) where lhsState.askingPrice == rhsState.askingPrice && lhsState.currencySymbol == rhsState.currencySymbol: return true
    case (.bidAcknowledged, .bidAcknowledged): return true
    case (.bidNetworkFail, .bidNetworkFail): return true
    case (.lotWaitingToOpen, .lotWaitingToOpen): return true
    case (.lotSold, .lotSold): return true
    case (.bidOutbid, .bidOutbid): return true

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
    fileprivate var bidIncrements: [UInt64] = []

    init(lotVM: LiveAuctionLotViewModelType, salesPerson: LiveAuctionsSalesPersonType) {
        self.lotViewModel = lotVM
        self.salesPerson = salesPerson

        super.init()

        currentBid = self.currentAskingPrice
        bidIncrements = [currentBid]

        let threshold = 5 * max(lotVM.askingPrice, (lotVM.highEstimateOrEstimateCents ?? 0))
        var i = 0
        repeat {
            let nextBid = salesPerson.bidIncrements.minimumNextBidCentsIncrement(bidIncrements[i])
            bidIncrements.append(nextBid)
            i += 1

        } while bidIncrements[i] < threshold
    }

    var availableIncrements: Int {
        return bidIncrements.count
    }

    func bidIncrementValueAtIndex(_ index: Int) -> UInt64 {
        return bidIncrements[index]
    }

    func bidIncrementStringAtIndex(_ index: Int) -> String {
        let value = bidIncrements[index]
        return value.convertToDollarString(lotViewModel.currencySymbol)
    }

    var currentAskingPrice: UInt64 {
        // Should not return 0, this is just to satisfy the compiler.
        return lotViewModel.askingPriceSignal.peek() ?? 0
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

    func nextBidCents(_ bid: UInt64) -> UInt64 {
        return bidIncrements.first { $0 > bid } ?? bid
    }

    func previousBidCents(_ bid: UInt64) -> UInt64 {
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
    return lhs.from.uint64Value < rhs.from.uint64Value
}

public func ==<T: BidIncrementStrategyType>(lhs: T, rhs: T) -> Bool {
    return lhs.from.uint64Value == rhs.from.uint64Value
}

extension Array where Element: BidIncrementStrategyType {
    func minimumNextBidCentsIncrement(_ bid: UInt64) -> UInt64 {
        let matchingIncrement = self.reduce(nil, { (memo, e) -> Element? in
            // We want to find the first increment whose from exceed bid, and return memo (the increment before it).
            if e.from.uint64Value > bid {
                return memo
            } else {
                // If we haven't surpassed the bid yet, return the next "previous value"
                return e
            }
        }) ?? last // If we exhausted the list, use the last, largest element.

        return bid + (matchingIncrement?.amount.uint64Value ?? bid) // Default to satisfy compiler, or an empty strategy from the API (unlikely)
    }
}
