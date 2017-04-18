import Foundation
import Interstellar

protocol AuctionNetworkModelType {
    func fetch() -> Observable<Result<SaleViewModel>>
    func fetchBidders() -> Observable<Result<[Bidder]>>
    func fetchLotStanding() -> Observable<Result<[LotStanding]>>

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
    lazy var lotStandingsNetworkModel: AuctionLotStandingsNetworkModel = AuctionLotStandingsNetworkModel()

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

        return combine(
                fetchBidders(),
                lotStandingsNetworkModel.fetch(saleID),
                saleNetworkModel.fetchSale(saleID),
                saleArtworksNetworkModel.fetchSaleArtworks(saleID)
            ).flatMap { [weak self] (bidders, lotStandings, sale, saleArtworks) -> Observable<Result<SaleViewModel>> in
                guard let `self` = self else { return Observable() }

                var retrievedLotStandings = [LotStanding]()
                if case .success(let lotStandings) = lotStandings {
                    // Note: we're discarding any error in lotStandings because our UI doesn't expose errors.
                    retrievedLotStandings = lotStandings
                }


                switch bidders {
                case .success(let bidders):
                    return Observable(self.createViewModel(bidders: bidders, lotStandings: retrievedLotStandings, sale: sale, saleArtworks: saleArtworks))
                case .error(let error):
                    return Observable(.error(error))
                }
            }.next { saleViewModel in
                // Store the SaleViewModel
                self.saleViewModel = saleViewModel
            }
    }

    func fetchLotStanding() -> Observable<Result<[LotStanding]>> {
        return lotStandingsNetworkModel.fetch(saleID)
    }

    func createViewModel(bidders: [Bidder], lotStandings: [LotStanding], sale: Result<Sale>, saleArtworks: Result<[SaleArtwork]>) -> Result<SaleViewModel> {
        // We need to extract them from their respective Result containers. If either failed, we pass along that failure.
        switch (sale, saleArtworks) {
        case (.success(let sale), .success(let saleArtworks)):
            saleArtworks.forEach { $0.auction = sale }
            return .success(SaleViewModel(sale: sale, saleArtworks: saleArtworks, bidders: bidders, lotStandings: lotStandings))

        case (.error(let error), .error):
            return .error(error) // Need to pick one error, might as well go with the first.

        case (.error(let error), .success):
            return .error(error)

        case (.success, .error(let error)):
            return .error(error)
        }
    }
}

// Interstellar's merge() runs in sequence, this combine() runs in parallel. It's ugly but it works.
func combine<A, B, C, D>(
    _ a: Observable<Result<A>>,
    _ b: Observable<Result<B>>,
    _ c: Observable<Result<C>>,
    _ d: Observable<Result<D>>
    ) -> Observable<(Result<A>, Result<B>, Result<C>, Result<D>)> {
    var aResult: Result<A>?
    var bResult: Result<B>?
    var cResult: Result<C>?
    var dResult: Result<D>?

    let observable = Observable<(Result<A>, Result<B>, Result<C>, Result<D>)>()
    let notifyIfComplete: () -> Void = {
        if let aResult = aResult, let bResult = bResult, let cResult = cResult, let dResult = dResult {
            observable.update(aResult, bResult, cResult, dResult)
        }
    }

    a.subscribe { result in
        aResult = result
        notifyIfComplete()
    }
    b.subscribe { result in
        bResult = result
        notifyIfComplete()
    }
    c.subscribe { result in
        cResult = result
        notifyIfComplete()
    }
    d.subscribe { result in
        dResult = result
        notifyIfComplete()
    }

    return observable
}
