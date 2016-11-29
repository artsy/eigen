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

    func sortSaleArtworks<T: AuctionOrderable>(_ saleArtworks: [T]) -> [T] {
        switch self {
        case .LotNumber:
            return saleArtworks
        case .ArtistAlphabetical:
            return saleArtworks.sorted(by: alphabeticalSort)
        case .LeastBids:
            return saleArtworks.sorted(by: leastBidsSort)
        case .MostBids:
            return saleArtworks.sorted(by: mostBidsSort)
        case .HighestCurrentBid:
            return saleArtworks.sorted(by: highestCurrentBidSort)
        case .LowestCurrentBid:
            return saleArtworks.sorted(by: lowestCurrentBidSort)
        }
    }

    enum LayoutType {
        case grid, list
    }
}

extension AuctionOrderingSwitchValue {
    var layoutType: LayoutType {
        switch self {
        case .LotNumber: return .grid
        default: return .list
        }
    }

    static func fromIntWithViewModel(_ value: Int, saleViewModel: SaleViewModel) -> AuctionOrderingSwitchValue {
        guard value < allSwitchValuesWithViewModel(saleViewModel).count else { return .LotNumber } // Lot number is a safe default
        return allSwitchValuesWithViewModel(saleViewModel)[value]
    }

    static func allSwitchValuesWithViewModel(_ saleViewModel: SaleViewModel) -> [AuctionOrderingSwitchValue] {
        switch saleViewModel.saleAvailability {
        case .closed:
            return [LotNumber, ArtistAlphabetical]
        default:
            return [LotNumber, ArtistAlphabetical, LeastBids, MostBids, HighestCurrentBid, LowestCurrentBid]
        }
    }
}

func leastBidsSort(_ lhs: AuctionOrderable, _ rhs: AuctionOrderable) -> Bool {
    return lhs.bids < rhs.bids
}

func mostBidsSort(_ lhs: AuctionOrderable, _ rhs: AuctionOrderable) -> Bool {
    return !leastBidsSort(lhs, rhs)
}

func lowestCurrentBidSort(_ lhs: AuctionOrderable, _ rhs: AuctionOrderable) -> Bool {
    return lhs.currentBid < rhs.currentBid
}

func highestCurrentBidSort(_ lhs: AuctionOrderable, _ rhs: AuctionOrderable) -> Bool {
    return !lowestCurrentBidSort(lhs, rhs)
}

func alphabeticalSort(_ lhs: AuctionOrderable, _ rhs: AuctionOrderable) -> Bool {
    return lhs.artistSortableID.caseInsensitiveCompare(rhs.artistSortableID) == .orderedAscending
}
