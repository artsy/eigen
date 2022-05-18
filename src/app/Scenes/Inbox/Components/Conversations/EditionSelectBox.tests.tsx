import { fireEvent } from "@testing-library/react-native"
import { __globalStoreTestUtils__, GlobalStoreProvider } from "app/store/GlobalStore"
import { setupTestWrapperTL } from "app/tests/setupTestWrapper"
import { Theme } from "palette"
import React from "react"
import { graphql } from "relay-runtime"
import { EditionSelectBoxFragmentContainer } from "./EditionSelectBox"

jest.unmock("react-relay")

describe("EditionSelectBox", () => {
  let selected: boolean
  const onPress = jest.fn()

  const { renderWithRelay } = setupTestWrapperTL({
    Component: ({ artwork }: any) => (
      <Theme>
        <GlobalStoreProvider>
          <EditionSelectBoxFragmentContainer
            editionSet={artwork.editionSets[0]}
            selected={selected}
            onPress={onPress}
          />
        </GlobalStoreProvider>
      </Theme>
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

  it("renders edition set with isOfferableFromInquiry", () => {
    const { getByText } = renderWithRelay({
      Artwork: () => ({
        slug: "test-artwork",
        editionSets: [
          {
            internalID: "test-id",
            isOfferableFromInquiry: true,
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
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableConversationalBuyNow: true })
    const { getByText } = renderWithRelay({
      Artwork: () => ({
        slug: "test-artwork",
        editionSets: [
          {
            internalID: "test-id",
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

    expect(getByText("in x in x in")).toBeTruthy()
    expect(getByText("cm x cm x cm")).toBeTruthy()
    expect(getByText("Unavailable")).toBeTruthy()
    expect(() => getByText("$100.00")).toThrow()

    fireEvent.press(getByText("in x in x in"))
    expect(onPress).toHaveBeenCalledWith("test-id", false)
  })
})
