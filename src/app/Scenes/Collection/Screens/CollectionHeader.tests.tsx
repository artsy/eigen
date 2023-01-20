import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { CollectionFixture } from "../Components/__fixtures__/CollectionFixture"
import { CollectionHeader } from "./CollectionHeader"

jest.unmock("react-relay")

describe("collection header", () => {
  let props: any
  beforeEach(() => {
    props = {
      collection: { ...CollectionFixture },
    }
  })

  it("passes the collection header image url to collection header", () => {
    const { UNSAFE_queryByType, UNSAFE_getByType } = renderWithWrappers(
      <CollectionHeader {...props} />
    )

    expect(UNSAFE_queryByType(OpaqueImageView)).toBeTruthy()
    expect(UNSAFE_getByType(OpaqueImageView)).toHaveProp(
      "imageURL",
      "http://imageuploadedbymarketingteam.jpg"
    )
  })

  it("passes the collection header title to collection header", () => {
    const { queryByText } = renderWithWrappers(<CollectionHeader {...props} />)

    expect(queryByText("Street Art Now")).toBeTruthy()
  })

  it("passes the url of the most marketable artwork in the collection to the collection header when there is no headerImage value present", () => {
    props.collection.headerImage = null
    const { UNSAFE_queryByType, UNSAFE_getByType } = renderWithWrappers(
      <CollectionHeader {...props} />
    )

    expect(UNSAFE_queryByType(OpaqueImageView)).toBeTruthy()
    expect(UNSAFE_getByType(OpaqueImageView)).toHaveProp(
      "imageURL",
      "https://defaultmostmarketableartworkincollectionimage.jpg"
    )
  })

  it("does not render the Read More component when there is no description", () => {
    props.collection.descriptionMarkdown = null
    const { queryByLabelText } = renderWithWrappers(<CollectionHeader {...props} />)

    expect(queryByLabelText("Read more")).toBeNull()
  })

  it("passes the collection header description to collection header", () => {
    const { queryByText, queryByLabelText } = renderWithWrappers(<CollectionHeader {...props} />)

    const strArr = [
      /A beach towel by/,
      /Yayoi Kusama/,
      /, a classic print by/,
      /Alexander Calder/,
      /, or a piggy bank by/,
      /Yoshitomo Nara/,
    ]

    expect(queryByLabelText("Read more")).toBeTruthy()
    strArr.forEach((str) => {
      expect(queryByText(str)).toBeTruthy()
    })
  })
})
