import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { InfoModalType } from "lib/Scenes/MyCollection/State/MyCollectionNavigationModel"
import { __appStoreTestUtils__, AppStore } from "lib/store/AppStore"
import { extractText } from "lib/tests/extractText"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { InfoModal } from "../InfoModal"

describe("InfoModal", () => {
  it("renders correct modals", () => {
    const modals = [
      ["artistMarket", "Artist Market Insights"],
      ["auctionResults", "Auction Data"],
      ["demandIndex", "Demand Index"],
      ["priceEstimate", "Estimated Price Range"],
    ]

    modals.forEach(([infoModalType, title]) => {
      __appStoreTestUtils__?.injectState({
        myCollection: { navigation: { sessionState: { infoModalType: infoModalType as InfoModalType } } },
      })
      const wrapper = renderWithWrappers(<InfoModal show />)
      const text = extractText(wrapper.root)
      expect(text).toContain(title)
    })
  })

  it("closes the info modal when back button is pressed", (done) => {
    __appStoreTestUtils__?.injectState({
      myCollection: { navigation: { sessionState: { infoModalType: "artistMarket" as InfoModalType } } },
    })
    const spy = jest.fn()
    AppStore.actions.myCollection.navigation.showInfoModal = spy as any
    const wrapper = renderWithWrappers(<InfoModal show />)
    wrapper.root.findByType(FancyModalHeader).props.onLeftButtonPress()

    // Stagger the hide in UI
    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith(null)
      done()
    }, 400)
  })
})
