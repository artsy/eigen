import Foundation

protocol AuctionOrderable {
    var bids: Int { get }
    var artistSortableID: String { get }
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

    enum LayoutType {
        case Grid, List
    }
}

extension AuctionOrderingSwitchValue {
    var layoutType: LayoutType {
        switch self {
        case LotNumber: return .Grid
        default: return .List
        }
    }

    static func fromIntWithViewModel(value: Int, saleViewModel: SaleViewModel) -> AuctionOrderingSwitchValue {
        guard value < allSwitchValuesWithViewModel(saleViewModel).count else { return .LotNumber } // Lot number is a safe default
        return allSwitchValuesWithViewModel(saleViewModel)[value]
    }

    static func allSwitchValuesWithViewModel(saleViewModel: SaleViewModel) -> [AuctionOrderingSwitchValue] {
        switch saleViewModel.saleAvailability {
        case .Closed:
            return [LotNumber, ArtistAlphabetical]
        default:
            return [LotNumber, ArtistAlphabetical, LeastBids, MostBids, HighestCurrentBid, LowestCurrentBid]
        }
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
    return lhs.artistSortableID.caseInsensitiveCompare(rhs.artistSortableID) == .OrderedAscending
}
