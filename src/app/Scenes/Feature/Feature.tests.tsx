import { defaultEnvironment } from "app/relay/createEnvironment"
import { extractText } from "app/tests/extractText"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import React from "react"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { FeatureQueryRenderer } from "./Feature"

jest.unmock("react-relay")

let mockRelayEnvironment = defaultEnvironment as ReturnType<typeof createMockEnvironment>
beforeEach(() => {
  mockRelayEnvironment = require("app/relay/createEnvironment").defaultEnvironment =
    createMockEnvironment()
})

describe(FeatureQueryRenderer, () => {
  it("renders without failing", () => {
    const tree = renderWithWrappers(<FeatureQueryRenderer slug="anything" />)

    mockRelayEnvironment.mock.resolveMostRecentOperation((op) => {
      return MockPayloadGenerator.generate(op, {
        Feature() {
          return {
            name: "this is the name",
            subheadline: "this is the subheadline",
            callout: "this is the callout",
            description: "this is the description",
            sets: {
              edges: [
                {
                  node: {
                    id: "set 0",
                    description: "set 0 description",
                    name: "set 0 name",
                    itemType: "Artwork",
                    orderedItems: {
                      edges: [
                        {
                          node: {
                            __typename: "Artwork",
                            id: "artwork 0",
                            title: "art 0 title",
                            artistNames: "artwork 0 artist",
                          },
                        },
                        {
                          node: {
                            __typename: "Artwork",
                            id: "artwork 1",
                            title: "art 1 title",
                            artistNames: "artwork 1 artist",
                          },
                        },
                      ],
                    },
                  },
                },
                {
                  node: {
                    id: "set 1",
                    description: "set 1 description",
                    name: "set 1 name",
                    itemType: "FeaturedLink",
                    orderedItems: {
                      edges: [
                        {
                          node: {
                            __typename: "FeaturedLink",
                            id: "link 0",
                            href: "link 0 href",
                            title: "link 0 title",
                            subtitle: "link 0 subtitle",
                            description: "link 0 description",
                          },
                        },
                        {
                          node: {
                            __typename: "FeaturedLink",
                            id: "link 1",
                            href: "link 1 href",
                            title: "link 1 title",
                            subtitle: "link 1 subtitle",
                            description: "link 1 description",
                          },
                        },
                        ,
                      ],
                    },
                  },
                },
              ],
            },
          }
        },
      })
    })

    expect(extractText(tree.root)).toContain("this is the name")
    expect(extractText(tree.root)).toContain("this is the subheadline")
    expect(extractText(tree.root)).toContain("this is the callout")
    expect(extractText(tree.root)).toContain("this is the description")

    expect(extractText(tree.root)).toContain("set 0 description")
    expect(extractText(tree.root)).toContain("set 0 name")
    expect(extractText(tree.root)).toContain("set 1 description")
    expect(extractText(tree.root)).toContain("set 1 name")
  })
})
