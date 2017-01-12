import Foundation
import Interstellar

protocol AuctionNetworkModelType {
    func fetch() -> Observable<Result<SaleViewModel>>
    func fetchBidders() -> Observable<Result<[Bidder]>>

    var bidders: [Bidder] { get }
}

/// Network model for everything auction-related.
/// It delegates out to other network models and doesn't itself perform any networking.
class AuctionNetworkModel {

    let saleID: String
    var saleViewModel: SaleViewModel?

    // Each one of these network models performs their request to fetch exactly one thing, and then store it locally.
    lazy var saleNetworkModel: AuctionSaleNetworkModelType = AuctionSaleNetworkModel()
    lazy var saleArtworksNetworkModel: AuctionSaleArtworksNetworkModelType = AuctionSaleArtworksNetworkModel()
    lazy var bidderNetworkModel: AuctionBiddersNetworkModelType = AuctionBiddersNetworkModel()

    init(saleID: String) {
        self.saleID = saleID
    }
}

extension AuctionNetworkModel: AuctionNetworkModelType {
    var bidders: [Bidder] {
        return bidderNetworkModel.bidders
    }

    func fetchBidders() -> Observable<Result<[Bidder]>> {
        let signal = Observable(saleID)
        return signal.flatMap(bidderNetworkModel.fetchBiddersForSale)
    }

    func fetch() -> Observable<Result<SaleViewModel>> {

        return fetchBidders()
            .flatMap { [weak self] (bidders: Result<[Bidder]>) -> Observable<Result<SaleViewModel>> in
                guard let `self` = self else { return Observable() }

                switch bidders {
                case .success(let bidders):
                    return self.createViewModel(bidders)
                case .error(let error):
                    return Observable(.error(error))
                }
            }.next { saleViewModel in
                // Store the SaleViewModel
                self.saleViewModel = saleViewModel
            }
    }

    func createViewModel(_ bidders: [Bidder]) -> Observable<Result<SaleViewModel>> {
        let signal = Observable(saleID)

        let fetchSale = signal.flatMap(saleNetworkModel.fetchSale)
        let fetchSaleArtworks = signal.flatMap(saleArtworksNetworkModel.fetchSaleArtworks)

        return fetchSale.merge(fetchSaleArtworks)
            .map { tuple -> Result<SaleViewModel> in

                // Tuple has the Sale and [SaleArtwork] from previous network requests.
                // We need to extract them from their respective Result containers. If either failed, we pass along that failure.
                switch tuple {
                case (.success(let sale), .success(let saleArtworks)):
                    saleArtworks.forEach { $0.auction = sale }
                    return .success(SaleViewModel(sale: sale, saleArtworks: saleArtworks, bidders: bidders))

                case (.error(let error), .error):
                    return .error(error) // Need to pick one error, might as well go with the first.

                case (.error(let error), .success):
                    return .error(error)

                case (.success, .error(let error)):
                    return .error(error)
                }

        }
    }
}
