import Foundation
import Interstellar

protocol AuctionRegistrationStatusNetworkModelType {
    func fetchRegistrationStatus(saleID: String) -> Observable<Result<ArtsyAPISaleRegistrationStatus>>
    var registrationStatus: ArtsyAPISaleRegistrationStatus? { get }
}

/// Network model responsible for fetching the registration status from the API.
class AuctionRegistrationStatusNetworkModel: AuctionRegistrationStatusNetworkModelType {

    private(set) var registrationStatus: ArtsyAPISaleRegistrationStatus?

    func fetchRegistrationStatus(saleID: String) -> Observable<Result<ArtsyAPISaleRegistrationStatus>> {
        let observable = Observable<Result<ArtsyAPISaleRegistrationStatus>>()

        // Based on the saleID signal, fetch the sale registration status.
        ArtsyAPI.getCurrentUserRegistrationStatusForSale(saleID,
            success: { registrationStatus in
                self.registrationStatus = registrationStatus
                observable.update(.Success(registrationStatus))
            }, failure: { error in
                observable.update(.Error(error as ErrorType))
            })

        return observable
    }
}
