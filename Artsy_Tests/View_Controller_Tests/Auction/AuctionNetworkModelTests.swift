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
        var registrationStatusNetworkModel: Test_AuctionRegistrationStatusNetworkModel!

        beforeEach {
            saleNetworkModel = Test_AuctionSaleNetworkModel(result: .Success(sale))
            saleArtworksNetworkModel = Test_AuctionSaleArtworksNetworkModel(result: Result.Success(saleArtworks))
            registrationStatusNetworkModel = Test_AuctionRegistrationStatusNetworkModel(result: .Success(.NotLoggedIn))

            subject = AuctionNetworkModel(saleID: saleID)
            subject.saleNetworkModel = saleNetworkModel
            subject.saleArtworksNetworkModel = saleArtworksNetworkModel
            subject.registrationStatusNetworkModel = registrationStatusNetworkModel
        }

        it("initializes correctly") {
            expect(subject.saleID) == saleID
        }

        describe("registrationStatus") {
            it("works when not logged in") {
                registrationStatusNetworkModel.registrationStatus = .NotLoggedIn
                expect(subject.registrationStatus) == .NotLoggedIn
            }

            it("works when registered") {
                registrationStatusNetworkModel.registrationStatus = .Registered
                expect(subject.registrationStatus) == .Registered
            }

            it("works when not registered") {
                registrationStatusNetworkModel.registrationStatus = .NotRegistered
                expect(subject.registrationStatus) == .NotRegistered
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

                expect(registrationStatusNetworkModel.called) == true
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

    func fetchSale(saleID: String) -> Observable<Result<Sale>> {
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

    func fetchSaleArtworks(saleID: String) -> Observable<Result<[SaleArtwork]>> {
        called = true
        return Observable(result)
    }
}

class Test_AuctionRegistrationStatusNetworkModel: AuctionRegistrationStatusNetworkModelType {
    var registrationStatus: ArtsyAPISaleRegistrationStatus?
    let result: Result<ArtsyAPISaleRegistrationStatus>
    var called = false

    init(result: Result<ArtsyAPISaleRegistrationStatus>) {
        self.result = result
    }

    func fetchRegistrationStatus(saleID: String) -> Observable<Result<ArtsyAPISaleRegistrationStatus>> {
        called = true
        return Observable(result)
    }
}
