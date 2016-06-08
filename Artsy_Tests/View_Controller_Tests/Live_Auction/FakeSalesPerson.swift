import Interstellar
@testable
import Artsy

func stub_auctionSale() -> LiveSale {
    let stateFetcher = Stubbed_StaticDataFetcher()
    return stateFetcher.fetchStaticData().peekValue()!.sale
}

func stub_auctionSalesPerson(auctionViewModel: LiveAuctionViewModelType? = nil) -> LiveAuctionsSalesPersonType {
    let sale = stub_auctionSale()
    let auctionViewModelCreator: LiveAuctionsSalesPerson.AuctionViewModelCreator
    if let auctionViewModel = auctionViewModel {
        auctionViewModelCreator = { _ in return auctionViewModel }
    } else {
        auctionViewModelCreator = LiveAuctionsSalesPerson.defaultAuctionViewModelCreator()
    }
    return LiveAuctionsSalesPerson(sale: sale, jwt: ArtsyAPISaleRegistrationStatus.Registered.jwt , bidderID: "bidder-id", stateManagerCreator: LiveAuctionsSalesPerson.stubbedStateManagerCreator(), auctionViewModelCreator: auctionViewModelCreator)
}

extension ArtsyAPISaleRegistrationStatus {
    var jwt: JWT {
        switch self {   
        case .Registered:
            let loggedInRegistered = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhdWN0aW9ucyIsInJvbGUiOiJiaWRkZXIiLCJ1c2VySWQiOiI0ZWM5MmNjYjU2YWU4ODAwMDEwMDAzOGUiLCJzYWxlSWQiOiI1NzU1YjA3YzVmOWY4ZjVjYjYwMDAwMDIiLCJiaWRkZXJJZCI6Ijk0MDIxNiIsImlhdCI6MTQ2NTI0MzkxMzIxMX0.K3XuQ8n60Y5Co5YTxeY2VgqDhM3M_OIoUhGqrLlKbDw"
            return JWT(jwtString: loggedInRegistered)!

        case .NotRegistered:
            let loggedInNotRegistered = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhdWN0aW9ucyIsInJvbGUiOiJvYnNlcnZlciIsInVzZXJJZCI6IjRlYzkyY2NiNTZhZTg4MDAwMTAwMDM4ZSIsInNhbGVJZCI6IjU3MWE1MmJmMjc1YjI0NTM0ZTAwMmRhNiIsImJpZGRlcklkIjpudWxsLCJpYXQiOjE0NjUyMzIzNTM1MzF9.EUBTm_QOIrEAZ_ulO2BrcZlmhUA28RLixiNvmdoLt74"
            return JWT(jwtString: loggedInNotRegistered)!

        case .NotLoggedIn:
            let notLoggedIn = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhdWN0aW9ucyIsInJvbGUiOiJvYnNlcnZlciIsInVzZXJJZCI6bnVsbCwic2FsZUlkIjoiNTRjN2U4ZmE3MjYxNjkyYjVhY2QwNjAwIiwiYmlkZGVySWQiOm51bGwsImlhdCI6MTQ2NTI0NTQzOTAzN30.-UMb7YN3KUXYJPhTiHK2wv667bz4Lxj9cDMD6H9GcAw"
            return JWT(jwtString: notLoggedIn)!
        }
    }
}
