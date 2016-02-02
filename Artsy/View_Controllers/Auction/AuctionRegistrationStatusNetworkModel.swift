import Foundation
import Interstellar

/// Network model responsible for fetching the registration status from the API.
class AuctionRegistrationStatusNetworkModel {

    var registrationStatus: ArtsyAPISaleRegistrationStatus?


    func fetchRegistrationStatus(saleID: String, callback: Result<ArtsyAPISaleRegistrationStatus> -> Void) {

        // Based on the saleID signal, fetch the sale registration status.
        ArtsyAPI.getCurrentUserRegistrationStatusForSale(saleID,
            success: { registrationStatus in
                callback(.Success(registrationStatus))
            }, failure: passOnFailure(callback))
    }
}
