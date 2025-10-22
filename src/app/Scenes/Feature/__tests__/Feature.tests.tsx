import { act, screen } from "@testing-library/react-native"
import { FeatureQueryRenderer } from "app/Scenes/Feature/Feature"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { MockPayloadGenerator, createMockEnvironment } from "relay-test-utils"

describe(FeatureQueryRenderer, () => {
  let mockRelayEnvironment: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    mockRelayEnvironment = getMockRelayEnvironment()
  })

  it("renders without failing", async () => {
    renderWithWrappers(<FeatureQueryRenderer slug="anything" />)

    await act(async () => {
      mockRelayEnvironment.mock.resolveMostRecentOperation((op) => {
        return MockPayloadGenerator.generate(op, {
          Feature() {
            return {
              name: "this is the name",
              subheadline: "this is the subheadline",
              callout: "this is the callout",
              description: "this is the description",
              video: {
                url: "https://www.youtube.com/somevideo",
              },
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
    })

    expect(screen.getByText("this is the name")).toBeTruthy()
    expect(screen.getByText("this is the subheadline")).toBeTruthy()
    expect(screen.getByText("this is the callout")).toBeTruthy()
    expect(screen.getByText("this is the description")).toBeTruthy()

    expect(screen.getByText("set 0 description")).toBeTruthy()
    expect(screen.getByText("set 0 name")).toBeTruthy()
    expect(screen.getByText("set 1 description")).toBeTruthy()
    expect(screen.getByText("set 1 name")).toBeTruthy()

    expect(screen.getByTestId("FeatureVideo")).toBeTruthy()
  })
})
