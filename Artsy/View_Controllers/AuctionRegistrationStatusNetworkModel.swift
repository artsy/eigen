import Foundation
import Interstellar

/// Network model responsible for fetching the registration status from the API.
class AuctionRegistrationStatusNetworkModel {

    let saleID: String
    var registrationStatus: ArtsyAPISaleRegistrationStatus?

    init(saleID: String) {
        self.saleID = saleID
    }

    func fetchRegistrationStatus() -> Signal<ArtsyAPISaleRegistrationStatus> {
        let signal = Signal(saleID)

        // Based on the saleID signal, fetch the sale registration status.
        return signal
            .flatMap(fetchSaleRegistrationStatus)
            .next { registrationStatus in
                self.registrationStatus = registrationStatus
            }
    }
}

private func fetchSaleRegistrationStatus(saleID: String, callback: Result<ArtsyAPISaleRegistrationStatus> -> Void) {
    ArtsyAPI.getCurrentUserRegistrationStatusForSale(saleID,
        success: { registrationStatus in
            callback(.Success(registrationStatus))
        }, failure: passOnFailure(callback))
}