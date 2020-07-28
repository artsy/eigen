import React from "react"
import * as renderer from "react-test-renderer"

import { MyProfilePushNotifications } from "../MyProfilePushNotifications"

it("renders without throwing an error", () => {
  renderer.create(<MyProfilePushNotifications />)
})
