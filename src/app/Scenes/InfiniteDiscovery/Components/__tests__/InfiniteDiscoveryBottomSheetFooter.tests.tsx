import { InfiniteDiscoveryBottomSheetFooter } from "app/Scenes/InfiniteDiscovery/Components/InfiniteDiscoveryBottomSheetFooter"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("InfiniteDiscoveryBottomSheetFooter", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: ({ artwork, me }: any) => {
      // @ts-expect-error TODO: fix shared value prop
      return <InfiniteDiscoveryBottomSheetFooter artwork={artwork} me={me} />
    },
    query: graphql`
      query InfiniteDiscoveryBottomSheetFooterTestQuery @relay_test_operation {
        artwork(id: "artwork-id") {
          ...InfiniteDiscoveryBottomSheetFooter_artwork
        }
        me {
          ...InfiniteDiscoveryBottomSheetFooter_me
        }
      }
    `,
  })

  it.skip("renders", async () => {
    renderWithRelay()
  })
})
