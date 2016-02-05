import Foundation
import Interstellar

protocol AuctionRegistrationStatusNetworkModelType {
    func fetchRegistrationStatus(saleID: String, callback: Result<ArtsyAPISaleRegistrationStatus> -> Void)
    var registrationStatus: ArtsyAPISaleRegistrationStatus? { get }
}

/// Network model responsible for fetching the registration status from the API.
class AuctionRegistrationStatusNetworkModel: AuctionRegistrationStatusNetworkModelType {

    private(set) var registrationStatus: ArtsyAPISaleRegistrationStatus?

    func fetchRegistrationStatus(saleID: String, callback: Result<ArtsyAPISaleRegistrationStatus> -> Void) {

        // Based on the saleID signal, fetch the sale registration status.
        ArtsyAPI.getCurrentUserRegistrationStatusForSale(saleID,
            success: { registrationStatus in
                self.registrationStatus = registrationStatus
                callback(.Success(registrationStatus))
            }, failure: passOnFailure(callback))
    }
}
