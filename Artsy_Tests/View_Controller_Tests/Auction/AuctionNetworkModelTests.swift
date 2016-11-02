import Quick
import Nimble
import Nimble_Snapshots
import Foundation
import Interstellar
@testable
import Artsy

class AuctionNetworkModelSpec: QuickSpec {
    override func spec() {
        let saleID = "the-🎉-sale"
        let sale = try! Sale(dictionary: ["name": "The 🎉 Sale"], error: Void())
        let saleArtworks = [SaleArtwork()] as [SaleArtwork]

        var subject: AuctionNetworkModel!
        var saleNetworkModel: Test_AuctionSaleNetworkModel!
        var saleArtworksNetworkModel: Test_AuctionSaleArtworksNetworkModel!
        var bidderNetworkModel: Test_AuctionBiddersNetworkModel!

        beforeEach {
            saleNetworkModel = Test_AuctionSaleNetworkModel(result: .success(sale))
            saleArtworksNetworkModel = Test_AuctionSaleArtworksNetworkModel(result: Result.success(saleArtworks))
            bidderNetworkModel = Test_AuctionBiddersNetworkModel(result: .success([]))

            subject = AuctionNetworkModel(saleID: saleID)
            subject.saleNetworkModel = saleNetworkModel
            subject.saleArtworksNetworkModel = saleArtworksNetworkModel
            subject.bidderNetworkModel = bidderNetworkModel
        }

        it("initializes correctly") {
            expect(subject.saleID) == saleID
        }

        describe("registrationStatus") {
            it("works when bidders fetch errors") {
                bidderNetworkModel.result = .error(TestError.testing)
                expect(subject.bidders).to( beEmpty() )
            }

            it("works when bidders fetch returns bidders") {
                let bidder = Bidder()!
                bidderNetworkModel.result = .success([bidder])
                expect(subject.bidders).to( haveCount(1) )
            }

        }

        // TODO: Remove async
        // These would periodically just fail

        pending("network fetching") {
            pending("fetches") {
                waitUntil { done in
                    subject.fetch().next { _ in
                        done()
                    }
                }
            }

            it("fetches a sale view model") {
                var saleViewModel: SaleViewModel!

                waitUntil { done in
                    subject.fetch().next {
                        saleViewModel = $0
                        done()
                    }
                }

                expect(saleViewModel.numberOfLots) == saleArtworks.count
                expect(saleViewModel.displayName) == sale.name
            }

            it("caches fetched sale view model") {
                var saleViewModel: SaleViewModel!

                waitUntil { done in
                    subject.fetch().next {
                        saleViewModel = $0
                        done()
                    }
                }

                expect(subject.saleViewModel) === saleViewModel
            }

            it("fetches registration status") {
                waitUntil { done in
                    subject.fetch().next { _ in
                        done()
                    }
                }

                expect(bidderNetworkModel.called) == true
            }

            it("fetches the sale") {
                waitUntil { done in
                    subject.fetch().next { _ in
                        done()
                    }
                }

                expect(saleNetworkModel.called) == true
            }

            it("fetches the sale artworks") {
                waitUntil { done in
                    subject.fetch().next { _ in
                        done()
                    }
                }

                expect(saleArtworksNetworkModel.called) == true
            }
        }
    }
}

class Test_AuctionSaleNetworkModel: AuctionSaleNetworkModelType {
    let result: Result<Sale>
    var called = false

    init(result: Result<Sale>) {
        self.result = result
    }

    func fetchSale(_ saleID: String) -> Observable<Result<Sale>> {
        called = true
        return Observable(result)
    }
}

class Test_AuctionSaleArtworksNetworkModel: AuctionSaleArtworksNetworkModelType {
    let result: Result<[SaleArtwork]>
    var called = false

    init(result: Result<[SaleArtwork]>) {
        self.result = result
    }

    func fetchSaleArtworks(_ saleID: String) -> Observable<Result<[SaleArtwork]>> {
        called = true
        return Observable(result)
    }
}

enum TestError: Error {
    case testing
}

class Test_AuctionBiddersNetworkModel: AuctionBiddersNetworkModelType {
    var result: Result<[Bidder]>
    var called = false

    var bidders: [Bidder] {
        return result.value ?? []
    }

    init(result: Result<[Bidder]>) {
        self.result = result
    }

    func fetchBiddersForSale(_ saleID: String) -> Observable<Result<[Bidder]>> {
        called = true
        return Observable(result)
    }
}
