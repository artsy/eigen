import { renderWithWrappersTL } from "lib/tests/renderWithWrappers"
import React from "react"
import "react-native"

import { UploadPhotos } from "./UploadPhotos"

it("renders without throwing an error", () => {
  renderWithWrappersTL(<UploadPhotos handlePress={() => console.log("do nothing")} />)
})

// add more tests!
