import { navigate } from "app/navigation/navigate"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Text } from "palette"
import React from "react"
import { OpenInquiryModalButton } from "./OpenInquiryModalButton"

jest.unmock("react-relay")

describe("OpenInquiryModalButtonQueryRenderer", () => {
  describe("Artsy guarantee message ad link", () => {
    it("display the correct message", () => {
      const tree = renderWithWrappers(
        <OpenInquiryModalButton artworkID="fancy-art" conversationID="123" />
      )

      expect(extractText(tree.root)).toContain(
        "Always complete purchases with our secure checkout in order to be covered by The Artsy Guarantee"
      )
      expect(tree.root.findAllByType(OpenInquiryModalButton)).toHaveLength(1)
    })

    it("navigates to the buyer guarantee page when tapped", () => {
      const tree = renderWithWrappers(
        <OpenInquiryModalButton artworkID="fancy-art" conversationID="123" />
      )

      tree.root.findAllByType(Text)[1].props.onPress()

      expect(navigate).toHaveBeenCalledWith("/buyer-guarantee")
    })
  })
})
