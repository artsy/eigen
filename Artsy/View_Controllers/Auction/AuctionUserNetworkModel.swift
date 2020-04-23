import Foundation
import Interstellar

protocol AuctionUserNetworkModelType {
    func fetchCurrentUser() -> Observable<Result<User>>
}

/// Network model responsible for fetching the current user from the API.
class AuctionUserNetworkModel: AuctionUserNetworkModelType {

    var user: User?

    func fetchCurrentUser() -> Observable<Result<User>> {
        let observable = Observable<Result<User>>()

        ArtsyAPI.getMe({ [weak self] user in
                self?.user = user
                observable.update(.success(user))
            },
            failure: { error in
                observable.update(.error(error as Error))
            })

        return observable
    }
}
