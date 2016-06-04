import Foundation
import Interstellar

protocol AuctionNetworkModelType {
    func fetch() -> Observable<Result<SaleViewModel>>
    func fetchRegistrationStatus() -> Observable<Result<ArtsyAPISaleRegistrationStatus>>

    var registrationStatus: ArtsyAPISaleRegistrationStatus? { get }
}

/// Network model for everything auction-related.
/// It delegates out to other network models and doesn't itself perform any networking.
class AuctionNetworkModel {

    let saleID: String
    var saleViewModel: SaleViewModel?

    // Each one of these network models performs their request to fetch exactly one thing, and then store it locally.
    lazy var saleNetworkModel: AuctionSaleNetworkModelType = AuctionSaleNetworkModel()
    lazy var saleArtworksNetworkModel: AuctionSaleArtworksNetworkModelType = AuctionSaleArtworksNetworkModel()
    lazy var registrationStatusNetworkModel: AuctionRegistrationStatusNetworkModelType = AuctionRegistrationStatusNetworkModel()

    init(saleID: String) {
        self.saleID = saleID
    }
}

extension AuctionNetworkModel: AuctionNetworkModelType {
    var registrationStatus: ArtsyAPISaleRegistrationStatus? {
        return self.registrationStatusNetworkModel.registrationStatus
    }

    func fetchRegistrationStatus() -> Observable<Result<ArtsyAPISaleRegistrationStatus>> {
        let signal = Observable(saleID)
        return signal.flatMap(registrationStatusNetworkModel.fetchRegistrationStatus)
    }

    func fetch() -> Observable<Result<SaleViewModel>> {
        let signal = Observable(saleID)

        let fetchSale = signal.flatMap(saleNetworkModel.fetchSale)
        let fetchSaleArtworks = signal.flatMap(saleArtworksNetworkModel.fetchSaleArtworks)

        let createViewModel = fetchSale.merge(fetchSaleArtworks)
            .map { tuple -> Result<SaleViewModel> in

                // Tuple has the Sale and [SaleArtwork] from previous network requests.
                // We need to extract them from their respective Result containers. If either failed, we pass along that failure.
                switch tuple {
                case (.Success(let sale), .Success(let saleArtworks)):
                    saleArtworks.forEach { $0.auction = sale }
                    return .Success(SaleViewModel(sale: sale, saleArtworks: saleArtworks))

                case (.Error(let error), .Error):
                    return .Error(error) // Need to pick one error, might as well go with the first.

                case (.Error(let error), .Success):
                    return .Error(error)

                case (.Success, .Error(let error)):
                    return .Error(error)
                }

            }
            .next { saleViewModel in
                // Store the SaleViewModel
                self.saleViewModel = saleViewModel
            }

        return fetchRegistrationStatus().flatMap { _ in
            // Note we discard the status, we don't care we just need it to be fetched first.
            return createViewModel
        }
    }
}
