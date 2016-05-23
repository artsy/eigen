@testable import Artsy

extension ARUserManager {

    /// Supports a block like logged in closure
    class func asLoggedInUser(closure: () -> ()) {
        self.stubAndLoginWithUsername()
        closure();
        self.clearUserData()
    }
}
