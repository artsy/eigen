import Interstellar
@testable
import Artsy

func stub_auctionSale() -> LiveSale {
    let stateFetcher = Stubbed_StaticDataFetcher()
    return stateFetcher.fetchStaticData().peek()!.sale
}

func stub_auctionSalesPerson(_ auctionViewModel: LiveAuctionViewModelType? = nil, creds: BiddingCredentials = BiddingCredentials(bidders: [qualifiedBidder], paddleNumber: "123456", userID: "abcd")) -> Stub_LiveAuctionsSalesPerson {
    let sale = stub_auctionSale()

    let auctionViewModelCreator: LiveAuctionsSalesPerson.AuctionViewModelCreator
    if let auctionViewModel = auctionViewModel {
        auctionViewModelCreator = { _,_,_  in return auctionViewModel }
    } else {
        auctionViewModelCreator = LiveAuctionsSalesPerson.defaultAuctionViewModelCreator()
    }
    return Stub_LiveAuctionsSalesPerson(sale: sale, jwt: StubbedCredentials.registered.jwt, biddingCredentials: creds, stateManagerCreator: LiveAuctionsSalesPerson.stubbedStateManagerCreator(), auctionViewModelCreator: auctionViewModelCreator)
}


class Stub_LiveAuctionsSalesPerson: LiveAuctionsSalesPerson {
    // This has an initial value, so we're "connected" right away.
    var _initialStateLoadedSignal = Observable<Void>(Void())
    override var initialStateLoadedSignal: Observable<Void> {
        return _initialStateLoadedSignal
    }

    var currentLotValue: UInt64 = 1234

    var askingPriceValueString: String = "$Value"
    override func askingPriceString(_ lot: LiveAuctionLotViewModelType) -> String {
        return askingPriceValueString
    }
}

enum StubbedCredentials {
    case registered, notRegistered, notLoggedIn
}

extension StubbedCredentials {
    var jwt: JWT {
        switch self {
        case .registered:
            let loggedInRegistered = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhdWN0aW9ucyIsInJvbGUiOiJiaWRkZXIiLCJ1c2VySWQiOiI0ZWM5MmNjYjU2YWU4ODAwMDEwMDAzOGUiLCJzYWxlSWQiOiI1NzU1YjA3YzVmOWY4ZjVjYjYwMDAwMDIiLCJiaWRkZXJJZCI6Ijk0MDIxNiIsImlhdCI6MTQ2NTI0MzkxMzIxMX0.K3XuQ8n60Y5Co5YTxeY2VgqDhM3M_OIoUhGqrLlKbDw"
            return JWT(jwtString: loggedInRegistered)!

        case .notRegistered:
            let loggedInNotRegistered = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhdWN0aW9ucyIsInJvbGUiOiJvYnNlcnZlciIsInVzZXJJZCI6IjRlYzkyY2NiNTZhZTg4MDAwMTAwMDM4ZSIsInNhbGVJZCI6IjU3MWE1MmJmMjc1YjI0NTM0ZTAwMmRhNiIsImJpZGRlcklkIjpudWxsLCJpYXQiOjE0NjUyMzIzNTM1MzF9.EUBTm_QOIrEAZ_ulO2BrcZlmhUA28RLixiNvmdoLt74"
            return JWT(jwtString: loggedInNotRegistered)!

        case .notLoggedIn:
            let notLoggedIn = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhdWN0aW9ucyIsInJvbGUiOiJvYnNlcnZlciIsInVzZXJJZCI6bnVsbCwic2FsZUlkIjoiNTRjN2U4ZmE3MjYxNjkyYjVhY2QwNjAwIiwiYmlkZGVySWQiOm51bGwsImlhdCI6MTQ2NTI0NTQzOTAzN30.-UMb7YN3KUXYJPhTiHK2wv667bz4Lxj9cDMD6H9GcAw"
            return JWT(jwtString: notLoggedIn)!
        }
    }
}
