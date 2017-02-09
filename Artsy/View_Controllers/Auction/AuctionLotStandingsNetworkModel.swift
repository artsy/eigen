import Foundation
import Interstellar

protocol AuctionLotStandingsNetworkModelType {
    func fetch(_ saleID: String) -> Observable<Result<[SaleArtwork]>>

    var lotStandings: [SaleArtwork] { get }
}

class AuctionLotStandingsNetworkModel: AuctionLotStandingsNetworkModelType {

    fileprivate(set) var lotStandings: [SaleArtwork] = []

    func fetch(_ saleID: String) -> Observable<Result<[SaleArtwork]>> {
        let observable = Observable<Result<[SaleArtwork]>>()

        ArtsyAPI.getCurrentUserLotStandings(
            forSale: saleID,
            success: { [weak self] saleArtworks in
                self?.lotStandings = saleArtworks
                observable.update(.success(saleArtworks))
            }, failure: { error in
                observable.update(.error(error))
        })

        return observable
    }
}
