import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { OldMyCollectionArtworkInsightsFragmentContainer } from "./Components/ArtworkInsights/OldMyCollectionArtworkInsights"
import { MyCollectionArtworkHeaderFragmentContainer } from "./Components/MyCollectionArtworkHeader"
import { MyCollectionArtworkMetaFragmentContainer } from "./Components/MyCollectionArtworkMeta"
import { MyCollectionWhySell } from "./Components/MyCollectionWhySell"
import { tests } from "./OldMyCollectionArtwork"

jest.mock("./Components/MyCollectionArtworkHeader", () => ({
  MyCollectionArtworkHeaderFragmentContainer: () => null,
}))

jest.mock("./Components/MyCollectionArtworkMeta", () => ({
  MyCollectionArtworkMetaFragmentContainer: () => null,
}))

jest.mock("./Components/ArtworkInsights/OldMyCollectionArtworkInsights", () => ({
  OldMyCollectionArtworkInsightsFragmentContainer: () => null,
}))

jest.mock("./Components/MyCollectionWhySell", () => ({
  MyCollectionWhySell: () => null,
}))

describe("MyCollectionArtworkDetail", () => {
  const getWrapper = (props?: any) => {
    return renderWithWrappers(<tests.MyCollectionArtwork {...props} />)
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("artwork detail behavior", () => {
    it("renders correct components", () => {
      const artworkProps = { artwork: { internalID: "someInternalId" } }
      const wrapper = getWrapper(artworkProps)
      expect(wrapper.root.findByType(MyCollectionArtworkHeaderFragmentContainer)).toBeDefined()
      expect(wrapper.root.findByType(MyCollectionArtworkMetaFragmentContainer)).toBeDefined()
      expect(wrapper.root.findByType(OldMyCollectionArtworkInsightsFragmentContainer)).toBeDefined()
      expect(wrapper.root.findByType(MyCollectionWhySell)).toBeDefined()
    })
  })
})
