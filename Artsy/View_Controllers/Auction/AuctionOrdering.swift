import Foundation

protocol AuctionOrderable {
    var bids: Int { get }
    var artistName: String { get }
    var currentBid: Int { get }
}

enum AuctionOrderingSwitchValue: String {
    case LotNumber = "Grid"
    case ArtistAlphabetical = "Artist A–Z"
    case MostBids = "Most Bids"
    case LeastBids = "Least Bids"
    case HighestCurrentBid = "Highest Bid"
    case LowestCurrentBid = "Lowest Bid"

    func sortSaleArtworks<T: AuctionOrderable>(saleArtworks: [T]) -> [T] {
        switch self {
        case LotNumber:
            return saleArtworks
        case .ArtistAlphabetical:
            return saleArtworks.sort(alphabeticalSort)
        case LeastBids:
            return saleArtworks.sort(leastBidsSort)
        case MostBids:
            return saleArtworks.sort(mostBidsSort)
        case HighestCurrentBid:
            return saleArtworks.sort(highestCurrentBidSort)
        case LowestCurrentBid:
            return saleArtworks.sort(lowestCurrentBidSort)
        }
    }

    static func fromInt(value: Int) -> AuctionOrderingSwitchValue {
        guard value < allSwitchValues().count else { return .LotNumber } // Lot number is a safe default
        return allSwitchValues()[value]
    }

    static func allSwitchValues() -> [AuctionOrderingSwitchValue] {
        return [LotNumber, ArtistAlphabetical, LeastBids, MostBids, HighestCurrentBid, LowestCurrentBid]
    }
}

func leastBidsSort(lhs: AuctionOrderable, _ rhs: AuctionOrderable) -> Bool {
    return lhs.bids < rhs.bids
}

func mostBidsSort(lhs: AuctionOrderable, _ rhs: AuctionOrderable) -> Bool {
    return !leastBidsSort(lhs, rhs)
}

func lowestCurrentBidSort(lhs: AuctionOrderable, _ rhs: AuctionOrderable) -> Bool {
    return lhs.currentBid < rhs.currentBid
}

func highestCurrentBidSort(lhs: AuctionOrderable, _ rhs: AuctionOrderable) -> Bool {
    return !lowestCurrentBidSort(lhs, rhs)
}

func alphabeticalSort(lhs: AuctionOrderable, _ rhs: AuctionOrderable) -> Bool {
    return lhs.artistName.caseInsensitiveCompare(rhs.artistName) == .OrderedAscending
}
