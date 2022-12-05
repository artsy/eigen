import { MyProfileHeaderMyCollectionAndSavedWorksTestsQuery } from "__generated__/MyProfileHeaderMyCollectionAndSavedWorksTestsQuery.graphql"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { navigate } from "app/navigation/navigate"
import { FavoriteArtworksQueryRenderer } from "app/Scenes/Favorites/FavoriteArtworks"
import { MyCollectionQueryRenderer } from "app/Scenes/MyCollection/MyCollection"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { LocalImage, storeLocalImages } from "app/utils/LocalImageStore"
import { Avatar } from "palette"
import { graphql, QueryRenderer } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import {
  LOCAL_PROFILE_ICON_PATH_KEY,
  MyProfileHeaderMyCollectionAndSavedWorksFragmentContainer,
} from "../MyProfileHeaderMyCollectionAndSavedWorks"

jest.mock("../LoggedInUserInfo")
jest.unmock("react-relay")
jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native")
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  }
})

describe("MyProfileHeaderMyCollectionAndSavedWorks", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<MyProfileHeaderMyCollectionAndSavedWorksTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query MyProfileHeaderMyCollectionAndSavedWorksTestsQuery @relay_test_operation {
          me @optionalField {
            ...MyProfileHeaderMyCollectionAndSavedWorks_me
          }
        }
      `}
      render={({ props, error }) => {
        if (props?.me) {
          return <MyProfileHeaderMyCollectionAndSavedWorksFragmentContainer me={props?.me} />
        } else if (error) {
          console.log(error)
        }
      }}
      variables={{}}
    />
  )

  const getWrapper = (mockResolvers = {}) => {
    const tree = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation(mockEnvironment, mockResolvers)
    return tree
  }

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("Components of MyProfileHeaderMyCollectionAndSavedWorks ", () => {
    it("renders the right tabs", () => {
      const { container } = getWrapper()
      expect(container.findByType(StickyTabPage)).toBeDefined()
      expect(container.findByType(MyCollectionQueryRenderer)).toBeDefined()
      expect(container.findByType(FavoriteArtworksQueryRenderer)).toBeDefined()
    })

    // Header tests
    it("Header Settings onPress navigates to my profile edit", () => {
      const { container } = getWrapper()
      const profileImage = container.findAllByProps({ testID: "profile-image" })
      expect(profileImage).toBeTruthy()
      profileImage[0].props.onPress()
      expect(navigate).toHaveBeenCalledTimes(1)
      expect(navigate).toHaveBeenCalledWith("/my-profile/edit")
    })

    it("Header shows the right text", async () => {
      const { findByText } = getWrapper({
        Me: () => ({
          name: "My Name",
          createdAt: new Date().toISOString(),
          bio: "My Bio",
          icon: {
            url: "https://someurll.jpg",
          },
        }),
      })

      const year = new Date().getFullYear()
      expect(await findByText("My Name")).toBeTruthy()
      expect(await findByText(`Member since ${year}`)).toBeTruthy()
      expect(await findByText("My Bio")).toBeTruthy()
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

      const { container } = getWrapper({
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
      expect(container.findAllByType(Avatar)).toBeDefined()
      // expect only one avatar
      expect(container.findAllByType(Avatar).length).toEqual(1)
    })

    it("renders Collector Profile info", async () => {
      const { findByText } = getWrapper({
        Me: () => ({
          name: "Princess",
          createdAt: new Date("12/12/12").toISOString(),
          bio: "Richest Collector! 💰",
          location: {
            display: "Atlantis",
          },
          profession: "Guardian of the Galaxy",
          otherRelevantPositions: "Marvel Universe",
        }),
      })

      expect(await findByText("Guardian of the Galaxy")).toBeTruthy()
      expect(await findByText("Atlantis")).toBeTruthy()
      expect(await findByText("Marvel Universe")).toBeTruthy()
    })
  })
})
