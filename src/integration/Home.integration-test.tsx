import { HomeQueryRenderer } from "lib/Scenes/Home/Home"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import React from "react"
import { create } from "react-test-renderer"

jest.unmock("react-relay")

const waitUntil = (pred: () => boolean) =>
  new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (pred()) {
        clearInterval(interval)
        resolve()
      }
    }, 500)
  })

describe(HomeQueryRenderer, () => {
  it("renders", async () => {
    __globalStoreTestUtils__?.injectState({
      auth: {
        userID: process.env.EIGEN_INTEGRATION_TEST_USER_ID,
        userAccessToken: process.env.EIGEN_INTEGRATION_TEST_USER_ACCESS_TOKEN,
      },
    })
    const tree = create(
      <GlobalStoreProvider>
        <HomeQueryRenderer></HomeQueryRenderer>
      </GlobalStoreProvider>
    )
    await waitUntil(() => {
      console.log("Text", extractText(tree.root))
      return extractText(tree.root).includes("Recommended works for you")
    })
  })
})
