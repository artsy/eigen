import { fireEvent, waitFor } from "@testing-library/react-native"
import { TagTestsQuery } from "__generated__/TagTestsQuery.graphql"
import { ArtworkFilterOptionsScreen } from "app/Components/ArtworkFilter"
import About from "app/Components/Tag/About"
import { TagArtworks } from "app/Components/Tag/TagArtworks"
import { renderWithWrappers, renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { TouchableHighlightColor } from "palette"
import { graphql, QueryRenderer } from "react-relay"

import { getMockRelayEnvironment } from "app/relay/defaultEnvironment"
import { Tag } from "./Tag"

describe("Tag", () => {
  const tagID = "skull"

  const TestRenderer = () => {
    return (
      <QueryRenderer<TagTestsQuery>
        environment={getMockRelayEnvironment()}
        query={graphql`
          query TagTestsQuery($tagID: String!, $input: FilterArtworksInput) @relay_test_operation {
            tag(id: $tagID) {
              slug
              description
              ...TagHeader_tag
              ...About_tag
              ...TagArtworks_tag @arguments(input: $input)
            }
          }
        `}
        render={({ props }) => {
          if (props?.tag) {
            return <Tag tagID={tagID} tag={props.tag} />
          }

          return null
        }}
        variables={{ tagID }}
      />
    )
  }

  it("renders without throwing an error", () => {
    renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation()
  })

  it("returns all tabs", async () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation()

    expect(tree.root.findAllByType(TagArtworks)).toHaveLength(1)
    expect(tree.root.findAllByType(About)).toHaveLength(1)
  })

  it('don\'t render "about" tab without description', async () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />)
    resolveMostRecentRelayOperation({
      Tag: () => ({
        description: null,
      }),
    })

    expect(tree.root.findAllByType(TagArtworks)).toHaveLength(1)
    expect(tree.root.findAllByType(About)).toHaveLength(0)
  })

  it("renders filter modal", async () => {
    const { UNSAFE_getByType, UNSAFE_getAllByType } = renderWithWrappers(<TestRenderer />)
    resolveMostRecentRelayOperation()

    await waitFor(() => expect(UNSAFE_getByType(TouchableHighlightColor)).toBeTruthy())
    fireEvent.press(UNSAFE_getByType(TouchableHighlightColor))

    expect(UNSAFE_getAllByType(ArtworkFilterOptionsScreen)).toHaveLength(1)
  })
})
