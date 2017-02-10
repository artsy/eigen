import Foundation
import Interstellar

protocol AuctionLotStandingsNetworkModelType {
    func fetch(_ saleID: String) -> Observable<Result<[LotStanding]>>

    var lotStandings: [LotStanding] { get }
}

class AuctionLotStandingsNetworkModel: AuctionLotStandingsNetworkModelType {

    fileprivate(set) var lotStandings: [LotStanding] = []

    func fetch(_ saleID: String) -> Observable<Result<[LotStanding]>> {
        let observable = Observable<Result<[LotStanding]>>()

        ArtsyAPI.getCurrentUserLotStandings(
            forSale: saleID,
            success: { [weak self] lotStandings in
                self?.lotStandings = lotStandings
                observable.update(.success(lotStandings))
            }, failure: { error in
                observable.update(.error(error))
        })

        return observable
    }
}
