import { MyCollectionAndSavedWorksTestsQuery } from "__generated__/MyCollectionAndSavedWorksTestsQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { navigate } from "lib/navigation/navigate"
import { extractText } from "lib/tests/extractText"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { ReactTestRenderer } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { FavoriteArtworksQueryRenderer } from "../Favorites/FavoriteArtworks"
import { MyCollectionQueryRenderer } from "../MyCollection/MyCollection"
import { MyCollectionAndSavedWorksFragmentContainer } from "./MyCollectionAndSavedWorks"

jest.mock("./LoggedInUserInfo")
jest.unmock("react-relay")

describe("MyCollectionAndSavedWorks", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyCollectionAndSavedWorksTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyCollectionAndSavedWorksTestsQuery @relay_test_operation {
          me @optionalField {
            ...MyCollectionAndSavedWorks_me
          }
        }
      `}
      render={renderWithLoadProgress(MyCollectionAndSavedWorksFragmentContainer)}
      variables={{}}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    mockEnvironmentPayload(mockEnvironment, mockResolvers)
    return tree
  }

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("Components of MyCollectionAndSavedWorks ", () => {
    let tree: ReactTestRenderer
    beforeEach(() => {
      tree = getWrapper()
    })

    it("renders the right tabs", () => {
      expect(tree.root.findByType(StickyTabPage)).toBeDefined()
      expect(tree.root.findByType(MyCollectionQueryRenderer)).toBeDefined()
      expect(tree.root.findByType(FavoriteArtworksQueryRenderer)).toBeDefined()
    })

    // Header tests
    it("Header Settings onPress navigates to MyProfileSettings", () => {
      tree.root.findByType(FancyModalHeader).props.onRightButtonPress()
      expect(navigate).toHaveBeenCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith("/my-profile/settings")
    })

    it("Header shows the right text", () => {
      const wrapper = getWrapper({
        Me: () => ({
          name: "My Name",
          createdAt: new Date().toISOString(),
          bio: "My Bio",
        }),
      })

      const text = extractText(wrapper.root)
      expect(extractText(text)).toContain("My Name")
      expect(extractText(text)).toContain(`Member since 2021`)
      expect(extractText(text)).toContain("My Bio")
    })
  })
})
