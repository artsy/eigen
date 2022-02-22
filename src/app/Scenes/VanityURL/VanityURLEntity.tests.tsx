import { HeaderTabsGridPlaceholder } from "lib/Components/HeaderTabGridPlaceholder"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { Fair, FairFragmentContainer, FairPlaceholder } from "lib/Scenes/Fair/Fair"
import { PartnerContainer } from "lib/Scenes/Partner"
import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { __renderWithPlaceholderTestUtils__ } from "lib/utils/renderWithPlaceholder"
import { Spinner } from "palette"
import React from "react"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { VanityURLEntityRenderer } from "./VanityURLEntity"
import { VanityURLPossibleRedirect } from "./VanityURLPossibleRedirect"

jest.unmock("react-relay")

jest.mock("./VanityURLPossibleRedirect", () => {
  return {
    VanityURLPossibleRedirect: () => null,
  }
})

const TestRenderer: React.FC<{
  entity: "fair" | "partner" | "unknown"
  slugType?: "profileID" | "fairID"
  slug: string
}> = ({ entity, slugType, slug }) => {
  return <VanityURLEntityRenderer entity={entity} slugType={slugType} slug={slug} />
}

describe("VanityURLEntity", () => {
  const env = defaultEnvironment as any as ReturnType<typeof createMockEnvironment>

  afterEach(() => {
    env.mockClear()
  })

  it("renders a VanityURLPossibleRedirect when 404", () => {
    if (__renderWithPlaceholderTestUtils__) {
      __renderWithPlaceholderTestUtils__.allowFallbacksAtTestTime = true
    }
    const tree = renderWithWrappers(<TestRenderer entity="unknown" slug="some-fair" />)
    expect(tree.root.findAllByType(VanityURLPossibleRedirect)).toHaveLength(0)
    env.mock.resolveMostRecentOperation({ data: undefined, errors: [{ message: "404" }] })
    expect(tree.root.findAllByType(VanityURLPossibleRedirect)).toHaveLength(1)
  })

  it("renders a fairQueryRenderer when given a fair id", () => {
    const tree = renderWithWrappers(
      <TestRenderer entity="fair" slugType="fairID" slug="some-fair" />
    )
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("FairQuery")
    act(() => {
      env.mock.resolveMostRecentOperation((operation) => MockPayloadGenerator.generate(operation))
    })
    const fairComponent = tree.root.findByType(Fair)
    expect(fairComponent).toBeDefined()
  })

  describe("rendering a profile", () => {
    it("shows a fair placeholder when entityType is fair", () => {
      const tree = renderWithWrappers(
        <TestRenderer entity="fair" slugType="profileID" slug="some-fair" />
      )
      const fairPlaceholder = tree.root.findByType(FairPlaceholder)
      expect(fairPlaceholder).toBeDefined()
    })

    it("shows a partner placeholder when entityType is partner", () => {
      const tree = renderWithWrappers(
        <TestRenderer entity="partner" slugType="profileID" slug="some-partner" />
      )
      const partnerPlaceholder = tree.root.findByType(HeaderTabsGridPlaceholder)
      expect(partnerPlaceholder).toBeDefined()
    })

    it("shows a spinner when entityType is unknown", () => {
      const tree = renderWithWrappers(
        <TestRenderer entity="unknown" slugType="profileID" slug="some-partner" />
      )
      const spinner = tree.root.findByType(Spinner)
      expect(spinner).toBeDefined()
    })

    it("renders a partner when a partner is returned", () => {
      const tree = renderWithWrappers(
        <TestRenderer entity="partner" slugType="profileID" slug="some-gallery" />
      )
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "VanityURLEntityQuery"
      )
      act(() => {
        env.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, {
            Query: () => ({
              vanityURLEntity: {
                __typename: "Partner",
                cities: [],
              },
            }),
          })
        )
      })
      const partnerComponent = tree.root.findByType(PartnerContainer)
      expect(partnerComponent).toBeDefined()
    })

    // TODO: Passes in isolation, but not with other specs
    xit("renders a fair when a fair is returned", () => {
      const tree = renderWithWrappers(
        <TestRenderer entity="fair" slugType="profileID" slug="some-fair" />
      )
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "VanityURLEntityQuery"
      )
      act(() => {
        env.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, {
            Query: () => ({
              vanityURLEntity: {
                __typename: "Fair",
              },
            }),
          })
        )
      })
      const fairComponent = tree.root.findByType(FairFragmentContainer)
      expect(fairComponent).toBeDefined()
    })

    it("renders a webview when an unknown profile type is returned", () => {
      const tree = renderWithWrappers(
        <TestRenderer entity="unknown" slugType="profileID" slug="some-unknown-id" />
      )
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "VanityURLEntityQuery"
      )
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
      const webComponent = tree.root.findByType(VanityURLPossibleRedirect)
      expect(webComponent).toBeDefined()
    })
  })
})
