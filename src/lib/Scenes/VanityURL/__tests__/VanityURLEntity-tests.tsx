import { HeaderTabsGridPlaceholder } from "lib/Components/HeaderTabGridPlaceholder"
import InternalWebView from "lib/Components/InternalWebView"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { fairFixture } from "lib/Scenes/Fair/__fixtures__"
import { Fair, FairContainer, FairPlaceholder } from "lib/Scenes/Fair/Fair"
import { PartnerContainer } from "lib/Scenes/Partner"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Spinner } from "palette"
import React from "react"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { VanityURLEntityRenderer } from "../VanityURLEntity"

jest.mock("lib/relay/createEnvironment", () => ({
  defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
}))

jest.unmock("react-relay")

interface RendererProps {
  entity: "fair" | "partner" | "unknown"
  slugType?: "profileID" | "fairID"
  slug: string
}

const TestRenderer: React.FC<RendererProps> = ({ entity, slugType, slug }) => {
  return <VanityURLEntityRenderer entity={entity} slugType={slugType} slug={slug} />
}

describe("VanityURLEntity", () => {
  const env = (defaultEnvironment as any) as ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env.mockClear()
  })

  it("renders a fairQueryRenderer when given a fair id", () => {
    const tree = renderWithWrappers(<TestRenderer entity="fair" slugType={"fairID"} slug={"some-fair"} />)
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("FairQuery")
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          fair: fairFixture,
        },
      })
    })
    const fairComponent = tree.root.findByType(Fair)
    expect(fairComponent).toBeDefined()
  })

  describe("rendering a profile", () => {
    it("shows a fair placeholder when entityType is fair", () => {
      const tree = renderWithWrappers(<TestRenderer entity="fair" slugType="profileID" slug="some-fair" />)
      const fairPlaceholder = tree.root.findByType(FairPlaceholder)
      expect(fairPlaceholder).toBeDefined()
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          vanityURLEntity: {
            ...fairFixture,
          },
        },
      })
    })

    it("shows a partner placeholder when entityType is partner", () => {
      const tree = renderWithWrappers(<TestRenderer entity="partner" slugType="profileID" slug="some-partner" />)
      const partnerPlaceholder = tree.root.findByType(HeaderTabsGridPlaceholder)
      expect(partnerPlaceholder).toBeDefined()
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          vanityURLEntity: {
            ...fairFixture,
          },
        },
      })
    })

    it("shows a spinner when entityType is unknown", () => {
      const tree = renderWithWrappers(<TestRenderer entity="unknown" slugType="profileID" slug="some-partner" />)
      const spinner = tree.root.findByType(Spinner)
      expect(spinner).toBeDefined()
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          vanityURLEntity: {
            ...fairFixture,
          },
        },
      })
    })

    it("renders a partner when a partner is returned", () => {
      const tree = renderWithWrappers(<TestRenderer entity="partner" slugType="profileID" slug="some-gallery" />)
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("VanityURLEntityQuery")
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: {
            vanityURLEntity: {
              __typename: "Partner",
              id: "some-partner-id",
              internalID: "some-internal-id",
              slug: "some-slug",
              profile: {
                id: "some-profile-id",
                isFollowed: false,
                internalID: "some-internal-profile-id",
              },
            },
          },
        })
      })
      const partnerComponent = tree.root.findByType(PartnerContainer)
      expect(partnerComponent).toBeDefined()
    })

    it("renders a fair when a fair is returned", () => {
      const tree = renderWithWrappers(<TestRenderer entity="fair" slugType="profileID" slug="some-fair" />)
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("VanityURLEntityQuery")
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: {
            vanityURLEntity: {
              ...fairFixture,
            },
          },
        })
      })
      const fairComponent = tree.root.findByType(FairContainer)
      expect(fairComponent).toBeDefined()
    })

    it("renders a webview when an unknown profile type is returned", () => {
      const tree = renderWithWrappers(<TestRenderer entity="unknown" slugType="profileID" slug="some-unknown-id" />)
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("VanityURLEntityQuery")
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: {
            vanityURLEntity: {
              __typename: "UnknownType",
            },
          },
        })
      })
      const webComponent = tree.root.findByType(InternalWebView)
      expect(webComponent).toBeDefined()
    })
  })
})
