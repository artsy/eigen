import { fireEvent, screen } from "@testing-library/react-native"
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

  it("renders edition set with isOfferable", async () => {
    await renderWithRelay({
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

    expect(screen.getByText("in x in x in")).toBeTruthy()
    expect(screen.getByText("cm x cm x cm")).toBeTruthy()
    expect(screen.getByText("$100.00")).toBeTruthy()

    await fireEvent.press(screen.getByText("in x in x in"))
    expect(onPress).toHaveBeenCalledWith("test-id", true)
  })

  it("renders edition set with isOfferableFromInquiry", async () => {
    await renderWithRelay({
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

    expect(screen.getByText("in x in x in")).toBeTruthy()
    expect(screen.getByText("cm x cm x cm")).toBeTruthy()
    expect(screen.getByText("$100.00")).toBeTruthy()

    await fireEvent.press(screen.getByText("in x in x in"))
    expect(onPress).toHaveBeenCalledWith("test-id", true)
  })

  it("renders edition set with isAcquireable and the feature flag", async () => {
    await renderWithRelay({
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
    expect(screen.getByText("$100.00")).toBeTruthy()

    await fireEvent.press(screen.getByText("in x in x in"))
    expect(onPress).toHaveBeenCalledWith("test-id", true)
  })

  it("renders unavailable edition set", async () => {
    await renderWithRelay({
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

    expect(screen.getByText("in x in x in")).toBeTruthy()
    expect(screen.getByText("cm x cm x cm")).toBeTruthy()
    expect(screen.getByText("Unavailable")).toBeTruthy()
    expect(() => screen.getByText("$100.00")).toThrow()

    await fireEvent.press(screen.getByText("in x in x in"))
    expect(onPress).toHaveBeenCalledWith("test-id", false)
  })
})
