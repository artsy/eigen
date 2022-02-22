import { CollapsibleArtworkDetailsTestsQuery } from "__generated__/CollapsibleArtworkDetailsTestsQuery.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { ArtworkDetailsRow } from "app/Scenes/Artwork/Components/ArtworkDetailsRow"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { Text } from "palette"
import React from "react"
import { TouchableOpacity } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { CollapsibleArtworkDetailsFragmentContainer } from "./CollapsibleArtworkDetails"

jest.unmock("react-relay")

describe("CollapsibleArtworkDetails", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => (
    <QueryRenderer<CollapsibleArtworkDetailsTestsQuery>
      environment={mockEnvironment}
      query={graphql`
        query CollapsibleArtworkDetailsTestsQuery @relay_test_operation {
          artwork(id: "some-slug") {
            ...CollapsibleArtworkDetails_artwork
          }
        }
      `}
      variables={{}}
      render={({ props }) => {
        if (props?.artwork) {
          return <CollapsibleArtworkDetailsFragmentContainer artwork={props.artwork} />
        }
        return null
      }}
    />
  )

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  const resolveData = (passedProps = {}) => {
    mockEnvironment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, passedProps)
    )
  }

  it("renders the data if available", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData()
    expect(wrapper.root.findAllByType(OpaqueImageView)).toHaveLength(1)
    // Show artwork details content
    wrapper.root.findByProps({ testID: "toggle-artwork-details-button" }).props.onPress()
    expect(wrapper.root.findAllByType(Text)).toHaveLength(24)
  })

  it("renders artist names", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData({
      Artwork: () => ({
        artistNames: "Vladimir Petrov, Kristina Kost",
      }),
    })
    expect(extractText(wrapper.root)).toContain("Vladimir Petrov, Kristina Kost")
  })

  it("expands component on press", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData()
    wrapper.root.findByType(TouchableOpacity).props.onPress()
    expect(wrapper.root.findAllByType(ArtworkDetailsRow)).toHaveLength(11)
  })

  it("doesn't render what it doesn't have", () => {
    const wrapper = renderWithWrappers(<TestRenderer />)
    resolveData({
      Artwork: () => ({
        signatureInfo: {
          details: null,
        },
      }),
    })
    wrapper.root.findByType(TouchableOpacity).props.onPress()
    expect(wrapper.root.findAllByType(ArtworkDetailsRow)).toHaveLength(10)
  })
})
