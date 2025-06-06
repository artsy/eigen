import { fireEvent } from "@testing-library/react-native"
import { EditionSelectBoxFragmentContainer } from "app/Scenes/Inbox/Components/Conversations/EditionSelectBox"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("EditionSelectBox", () => {
  let selected: boolean
  const onPress = jest.fn()

  const { renderWithRelay } = setupTestWrapper({
    Component: ({ artwork }: any) => (
      <EditionSelectBoxFragmentContainer
        editionSet={artwork.editionSets[0]}
        selected={selected}
        onPress={onPress}
      />
    ),
    query: graphql`
      query EditionSelectBoxTestQuery {
        artwork(id: "test-id") {
          internalID
          editionSets {
            ...EditionSelectBox_editionSet
          }
        }
      }
    `,
  })

  beforeEach(() => {
    selected = false
    onPress.mockReset()
  })

  it("renders edition set with isOfferable", () => {
    const { getByText } = renderWithRelay({
      Artwork: () => ({
        slug: "test-artwork",
        editionSets: [
          {
            internalID: "test-id",
            isOfferableFromInquiry: false,
            isOfferable: true,
            isAcquireable: false,
            dimensions: {
              in: "in x in x in",
              cm: "cm x cm x cm",
            },
            listPrice: {
              __typename: "Money",
              display: "$100.00",
            },
          },
        ],
      }),
    })

    expect(getByText("in x in x in")).toBeTruthy()
    expect(getByText("cm x cm x cm")).toBeTruthy()
    expect(getByText("$100.00")).toBeTruthy()

    fireEvent.press(getByText("in x in x in"))
    expect(onPress).toHaveBeenCalledWith("test-id", true)
  })

  it("renders edition set with isOfferableFromInquiry", () => {
    const { getByText } = renderWithRelay({
      Artwork: () => ({
        slug: "test-artwork",
        editionSets: [
          {
            internalID: "test-id",
            isOfferableFromInquiry: true,
            isOfferable: false,
            isAcquireable: false,
            dimensions: {
              in: "in x in x in",
              cm: "cm x cm x cm",
            },
            listPrice: {
              __typename: "Money",
              display: "$100.00",
            },
          },
        ],
      }),
    })

    expect(getByText("in x in x in")).toBeTruthy()
    expect(getByText("cm x cm x cm")).toBeTruthy()
    expect(getByText("$100.00")).toBeTruthy()

    fireEvent.press(getByText("in x in x in"))
    expect(onPress).toHaveBeenCalledWith("test-id", true)
  })

  it("renders edition set with isAcquireable and the feature flag", () => {
    const { getByText } = renderWithRelay({
      Artwork: () => ({
        slug: "test-artwork",
        editionSets: [
          {
            internalID: "test-id",
            isOfferableFromInquiry: false,
            isOfferable: false,
            isAcquireable: true,
            dimensions: {
              in: "in x in x in",
              cm: "cm x cm x cm",
            },
            listPrice: {
              __typename: "Money",
              display: "$100.00",
            },
          },
        ],
      }),
    })
    expect(getByText("$100.00")).toBeTruthy()

    fireEvent.press(getByText("in x in x in"))
    expect(onPress).toHaveBeenCalledWith("test-id", true)
  })

  it("renders unavailable edition set", () => {
    const { getByText } = renderWithRelay({
      Artwork: () => ({
        slug: "test-artwork",
        editionSets: [
          {
            internalID: "test-id",
            isOfferableFromInquiry: false,
            isOfferable: false,
            isAcquireable: false,
            dimensions: {
              in: "in x in x in",
              cm: "cm x cm x cm",
            },
            listPrice: {
              __typename: "Money",
              display: "$100.00",
            },
          },
        ],
      }),
    })

    expect(getByText("in x in x in")).toBeTruthy()
    expect(getByText("cm x cm x cm")).toBeTruthy()
    expect(getByText("Unavailable")).toBeTruthy()
    expect(() => getByText("$100.00")).toThrow()

    fireEvent.press(getByText("in x in x in"))
    expect(onPress).toHaveBeenCalledWith("test-id", false)
  })
})
