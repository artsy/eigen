import { screen } from "@testing-library/react-native"
import { Fair } from "app/Scenes/Fair/Fair"
import { PartnerContainer } from "app/Scenes/Partner/Partner"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { __renderWithPlaceholderTestUtils__ } from "app/utils/renderWithPlaceholder"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { act } from "react-test-renderer"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"
import { VanityURLEntityRenderer } from "./VanityURLEntity"
import { VanityURLPossibleRedirect } from "./VanityURLPossibleRedirect"

jest.mock("./VanityURLPossibleRedirect", () => ({
  VanityURLPossibleRedirect: () => null,
}))

const TestRenderer: React.FC<{
  entity: "fair" | "partner" | "unknown"
  slugType?: "profileID" | "fairID"
  slug: string
}> = ({ entity, slugType, slug }) => (
  <VanityURLEntityRenderer entity={entity} slugType={slugType} slug={slug} />
)

describe("VanityURLEntity", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = getMockRelayEnvironment()
  })

  it("renders a VanityURLPossibleRedirect when 404", () => {
    if (__renderWithPlaceholderTestUtils__) {
      __renderWithPlaceholderTestUtils__.allowFallbacksAtTestTime = true
    }
    renderWithWrappers(<TestRenderer entity="unknown" slug="a-cool-new-url" />)

    act(() => {
      env.mock.resolveMostRecentOperation({ data: undefined, errors: [{ message: "404" }] })
    })

    expect(screen.UNSAFE_getAllByType(VanityURLPossibleRedirect)).toHaveLength(1)
  })

  describe("rendering a profile", () => {
    it("shows a fair placeholder when entityType is fair", () => {
      renderWithWrappers(<TestRenderer entity="fair" slugType="profileID" slug="some-fair" />)

      expect(screen.getByTestId("FairPlaceholder")).toBeTruthy()
    })

    it("shows a partner placeholder when entityType is partner", () => {
      renderWithWrappers(<TestRenderer entity="partner" slugType="profileID" slug="some-partner" />)

      expect(screen.getByTestId("PartnerPlaceholder")).toBeTruthy()
    })

    it("shows a spinner when entityType is unknown", () => {
      renderWithWrappers(<TestRenderer entity="unknown" slugType="profileID" slug="some-partner" />)

      expect(screen.getByTestId("LoadingSpinner")).toBeTruthy()
    })

    it("renders a partner when a partner is returned", () => {
      renderWithWrappers(<TestRenderer entity="partner" slugType="profileID" slug="some-gallery" />)
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "VanityURLEntityQuery"
      )

      act(() => {
        env.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, {
            Query: () => ({
              vanityURLEntity: {
                __typename: "Partner",
                id: "some-gallery",
                name: "Some Gallery",
                cities: [],
              },
            }),
          })
        )
      })

      const partnerComponent = screen.UNSAFE_getByType(PartnerContainer)
      expect(partnerComponent).toBeTruthy()
    })

    it("renders a fair when a fair is returned", () => {
      renderWithWrappers(<TestRenderer entity="fair" slugType="profileID" slug="some-fair" />)
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "VanityURLEntityQuery"
      )
      act(() => {
        env.mock.resolveMostRecentOperation((operation) =>
          MockPayloadGenerator.generate(operation, {
            Query: () => ({
              vanityURLEntity: {
                __typename: "Fair",
                id: "some-fair",
                slug: "some-fair",
              },
            }),
          })
        )
      })

      const fairComponent = screen.UNSAFE_getByType(Fair)
      expect(fairComponent).toBeTruthy()
    })

    it("renders a webview when an unknown profile type is returned", () => {
      renderWithWrappers(
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
              id: "some-unknown",
              slug: "some-unknown",
            },
          },
        })
      })
      const webComponent = screen.UNSAFE_getByType(VanityURLPossibleRedirect)
      expect(webComponent).toBeTruthy()
    })
  })
})
