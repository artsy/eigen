import Foundation
import Keys
import Aerodramus

class ArtsyEcho: Aerodramus {

    convenience override init() {
        let keys = ArtsyKeys()
        let url = URL(string: "https://echo-api-production.herokuapp.com/")! // swiftlint:disable:this force_unwrapping
        self.init(serverURL: url, accountID: 1, apiKey: keys.artsyEchoProductionToken(), localFilename: "Echo")
    }

}
