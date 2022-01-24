import { MyCollectionAndSavedWorksTestsQuery } from "__generated__/MyCollectionAndSavedWorksTestsQuery.graphql"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { StickyTabPage } from "lib/Components/StickyTabPage/StickyTabPage"
import { navigate } from "lib/navigation/navigate"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { extractText } from "lib/tests/extractText"
import { flushPromiseQueue } from "lib/tests/flushPromiseQueue"
import { mockEnvironmentPayload } from "lib/tests/mockEnvironmentPayload"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { LocalImage, storeLocalImages } from "lib/utils/LocalImageStore"
import renderWithLoadProgress from "lib/utils/renderWithLoadProgress"
import { Avatar } from "palette"
import React from "react"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { FavoriteArtworksQueryRenderer } from "../Favorites/FavoriteArtworks"
import { MyCollectionQueryRenderer } from "../MyCollection/MyCollection"
import {
  LOCAL_PROFILE_ICON_PATH_KEY,
  MyCollectionAndSavedWorksFragmentContainer,
} from "./MyCollectionAndSavedWorks"

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
    it("renders the right tabs", () => {
      const tree = getWrapper()
      expect(tree.root.findByType(StickyTabPage)).toBeDefined()
      expect(tree.root.findByType(MyCollectionQueryRenderer)).toBeDefined()
      expect(tree.root.findByType(FavoriteArtworksQueryRenderer)).toBeDefined()
    })

    // Header tests
    it("Header Settings onPress navigates to MyProfileSettings", () => {
      const tree = getWrapper()
      tree.root.findByType(FancyModalHeader).props.onRightButtonPress()
      expect(navigate).toHaveBeenCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith("/my-profile/settings")
    })

    describe("With Bio and Icon Feature flags off", () => {
      it("Header shows the right text", async () => {
        const wrapper = getWrapper({
          Me: () => ({
            name: "My Name",
            createdAt: new Date().toISOString(),
            bio: "My Bio",
            icon: {
              url: "https://someurll.jpg",
            },
          }),
        })

        const text = extractText(wrapper.root)
        const year = new Date().getFullYear()
        expect(extractText(text)).toContain("My Name")
        expect(extractText(text)).toContain(`Member since ${year}`)
        expect(extractText(text)).not.toContain("My Bio")
      })

      it("does not render Icon", async () => {
        const localImage: LocalImage = {
          path: "some/my/profile/path",
          width: 10,
          height: 10,
        }
        await act(async () => {
          await storeLocalImages([localImage], LOCAL_PROFILE_ICON_PATH_KEY)
        })

        const wrapper = getWrapper({
          Me: () => ({
            name: "My Name",
            createdAt: new Date().toISOString(),
            bio: "My Bio",
            icon: {
              url: "https://someurll.jpg",
            },
          }),
        })
        // No avatar
        expect(wrapper.root.findAllByType(Avatar)).toEqual([])
      })
    })

    describe("With Bio and Icon Feature flags ON", () => {
      it("Header shows the right text", () => {
        const wrapper = getWrapper({
          Me: () => ({
            name: "My Name",
            createdAt: new Date().toISOString(),
            bio: "My Bio",
            icon: {
              url: "https://someurll.jpg",
            },
          }),
        })

        const text = extractText(wrapper.root)
        const year = new Date().getFullYear()
        expect(extractText(text)).toContain("My Name")
        expect(extractText(text)).toContain(`Member since ${year}`)
        expect(extractText(text)).toContain("My Bio")
      })

      it("Renders Icon", async () => {
        const localImage: LocalImage = {
          path: "some/my/profile/path",
          width: 10,
          height: 10,
        }
        await act(async () => {
          await storeLocalImages([localImage], LOCAL_PROFILE_ICON_PATH_KEY)
        })

        const wrapper = getWrapper({
          Me: () => ({
            name: "My Name",
            createdAt: new Date().toISOString(),
            bio: "My Bio",
            icon: {
              url: "https://someurll.jpg",
            },
          }),
        })

        await flushPromiseQueue()
        expect(wrapper.root.findAllByType(Avatar)).toBeDefined()
        // expect only one avatar
        expect(wrapper.root.findAllByType(Avatar).length).toEqual(1)
      })
    })

    describe("With Collector Profile feature flag OFF", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCollectorProfile: false })
      })

      it("should not render Collector Profile info", async () => {
        const wrapper = getWrapper({
          Me: () => ({
            name: "Princess",
            createdAt: new Date("12/12/12").toISOString(),
            bio: "Richest Collector! 💰",
            location: {
              display: "Atlantis",
            },
            profession: "Guardian of the Galaxy",
            otherRelevantPosition: "Marvel Universe",
          }),
        })

        const text = extractText(wrapper.root)

        expect(text).toContain("Princess")
        expect(text).toContain("Member since 2012")
        expect(text).toContain("Richest Collector! 💰")
        expect(text).not.toContain("Guardian of the Galaxy")
        expect(text).not.toContain("Atlantis")
        expect(text).not.toContain("Marvel Universe")
      })
    })

    describe("With Collector Profile feature flag ON", () => {
      beforeEach(() => {
        __globalStoreTestUtils__?.injectFeatureFlags({ AREnableCollectorProfile: true })
      })

      it("should render Collector Profile info", async () => {
        const wrapper = getWrapper({
          Me: () => ({
            name: "Princess",
            createdAt: new Date("12/12/12").toISOString(),
            bio: "Richest Collector! 💰",
            location: {
              display: "Atlantis",
            },
            profession: "Guardian of the Galaxy",
            otherRelevantPosition: "Marvel Universe",
          }),
        })

        const text = extractText(wrapper.root)

        expect(text).toContain("Guardian of the Galaxy")
        expect(text).toContain("Atlantis")
        expect(text).toContain("Marvel Universe")
      })
    })
  })
})
