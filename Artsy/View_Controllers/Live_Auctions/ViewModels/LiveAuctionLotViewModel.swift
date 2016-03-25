import Foundation

// Represents a single lot view

/*

TODO: this needs to vend _signals_ instead of raw values, for the following attributes:
- Reserve status
- Events (need a way to start/end updates for table view)
- Next bid amount
*/

class LiveAuctionLotViewModel : NSObject {

    enum LotState {
        case ClosedLot
        case LiveLot
        case UpcomingLot(distanceFromLive: Int)
    }

    private let lot: LiveAuctionLot
    var events = [LiveAuctionEventViewModel]()

    init(lot: LiveAuctionLot) {
        self.lot = lot
    }

    func lotStateWithViewModel(viewModel: LiveAuctionViewModel) -> LotState {
        guard let distance = viewModel.distanceFromCurrentLot(lot) else {
            return .ClosedLot
        }
        if distance == 0 { return .LiveLot }
        if distance < 0 { return .ClosedLot }
        return .UpcomingLot(distanceFromLive: distance)
    }

    var urlForThumbnail: NSURL {
        return lot.urlForThumbnail()
    }

    var urlForProfile: NSURL {
        return lot.urlForThumbnail()
    }

    var imageProfileSize: CGSize {
        return lot.imageProfileSize()
    }

    var lotName: String {
        return lot.artworkTitle
    }

    var lotArtist: String {
        return lot.artistName
    }

    var lotIndex: Int {
        return lot.position
    }

    // maybe depecated by currentLotviewModel?
    var currentLotValue: String {
        return "$10,000"
    }

    func bidButtonTitleWithViewModel(viewModel: LiveAuctionViewModel) ->  String {
        switch lotStateWithViewModel(viewModel) {
        case .ClosedLot:   return "BIDDING CLOSED"
        case .LiveLot:  return "BID 20,000"
        case .UpcomingLot(_):  return "LEAVE MAX BID"
        }
    }

    var estimateString: String {
        return SaleArtwork.estimateStringForLowEstimate(lot.lowEstimateCents, highEstimateCents: lot.highEstimateCents, currencySymbol: lot.currencySymbol, currency: lot.currency)
    }
}

