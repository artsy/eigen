import { screen } from "@testing-library/react-native"
import { StickyTabPage } from "app/Components/StickyTabPage/StickyTabPage"
import { FavoriteArtworksQueryRenderer } from "app/Scenes/Favorites/FavoriteArtworks"
import { MyCollectionQueryRenderer } from "app/Scenes/MyCollection/MyCollection"
import { MyCollectionTabsStoreProvider } from "app/Scenes/MyCollection/State/MyCollectionTabsStore"
import { MyProfileHeaderMyCollectionAndSavedWorks } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("../LoggedInUserInfo")
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
  const TestRenderer = () => (
    <MyCollectionTabsStoreProvider>
      <MyProfileHeaderMyCollectionAndSavedWorks />
    </MyCollectionTabsStoreProvider>
  )

  const getWrapper = () => {
    const tree = renderWithWrappers(<TestRenderer />)
    return tree
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders the right tabs", () => {
    getWrapper()

    expect(screen.UNSAFE_queryByType(StickyTabPage)).toBeDefined()
    expect(screen.UNSAFE_queryByType(MyCollectionQueryRenderer)).toBeDefined()
    expect(screen.UNSAFE_queryByType(FavoriteArtworksQueryRenderer)).toBeDefined()
  })
})
