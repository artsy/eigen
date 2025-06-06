import { screen } from "@testing-library/react-native"
import { MyCollectionPreviewTestQuery } from "__generated__/MyCollectionPreviewTestQuery.graphql"
import { MyCollectionPreview } from "app/Scenes/MyProfile/Components/UserAccountHeader/MyCollectionPreview"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("MyCollectionPreview", () => {
  const { renderWithRelay } = setupTestWrapper<MyCollectionPreviewTestQuery>({
    Component: ({ me }) => {
      if (!me) {
        return null
      }
      return <MyCollectionPreview me={me} />
    },
    query: graphql`
      query MyCollectionPreviewTestQuery @relay_test_operation {
        me {
          ...MyCollectionPreview_me
        }
      }
    `,
  })

  it("renders empty state when no artworks", () => {
    renderWithRelay({
      Me: () => ({
        myCollectionConnection: {
          edges: [],
        },
      }),
    })
    expect(screen.getByTestId("my-collection-banner-empty-state")).toBeTruthy()
  })

  it("renders correctly", () => {
    renderWithRelay({
      Me: () => myCollectionPreviewMock,
    })

    // 1 artwork with image
    expect(screen.queryAllByTestId("artwork-preview-image")).toHaveLength(1)

    // 1 artwork without image (has internalID but no image object)
    expect(screen.queryAllByTestId("artwork-without-image")).toHaveLength(1)

    // 2 placeholders (empty objects)
    expect(screen.queryAllByTestId("artwork-preview-placeholder")).toHaveLength(2)
  })
})

const myCollectionPreviewMock = {
  myCollectionConnection: {
    edges: [
      {
        node: {
          internalID: "artwork-id-0",
          image: {
            resized: {
              url: "https://example.com/image.jpg",
            },
            imageURL: "https://example.com/image.jpg",
            blurhash: "blurhash",
          },
        },
      },
      {
        node: {
          internalID: "artwork-id-1",
          image: {
            resized: null,
            imageURL: null,
            blurhash: null,
          },
        },
      },
    ],
  },
}
