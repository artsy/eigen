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

    private let model: LiveAuctionLot
    var events = [LiveAuctionEventViewModel]()

    init(lot: LiveAuctionLot) {
        self.model = lot
    }

    func lotStateWithViewModel(viewModel: LiveAuctionViewModel) -> LotState {
        guard let distance = viewModel.distanceFromCurrentLot(model) else {
            return .ClosedLot
        }
        if distance == 0 { return .LiveLot }
        if distance < 0 { return .ClosedLot }
        return .UpcomingLot(distanceFromLive: distance)
    }

    var urlForThumbnail: NSURL {
        return model.urlForThumbnail()
    }

    var urlForProfile: NSURL {
        return model.urlForThumbnail()
    }

    var imageProfileSize: CGSize {
        return model.imageProfileSize()
    }

    var lotName: String {
        return model.artworkTitle
    }

    var lotArtist: String {
        return model.artistName
    }

    var lotIndex: Int {
        return model.position
    }

    var liveAuctionLotID: String {
        return model.liveAuctionLotID
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
        return SaleArtwork.estimateStringForLowEstimate(model.lowEstimateCents, highEstimateCents: model.highEstimateCents, currencySymbol: model.currencySymbol, currency: model.currency)
    }

    func updateReserveStatus(reserveStatusString: String) {
        model.updateReserveStatusWithString(reserveStatusString)
        // TODO: Update any signal?
    }

    func updateOnlineAskingPrice(askingPrice: Int) {
        model.updateOnlineAskingPrice(askingPrice)
    }
}

