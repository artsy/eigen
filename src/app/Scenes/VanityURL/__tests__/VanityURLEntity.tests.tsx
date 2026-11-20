import { act, screen } from "@testing-library/react-native"
import { VanityURLEntityRenderer } from "app/Scenes/VanityURL/VanityURLEntity"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { __renderWithPlaceholderTestUtils__ } from "app/utils/renderWithPlaceholder"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils"

jest.mock("../VanityURLPossibleRedirect", () => {
  const { View } = require("react-native")
  return {
    VanityURLPossibleRedirect: () => <View testID="VanityURLPossibleRedirect" />,
  }
})

jest.mock("app/Scenes/Fair/Fair", () => {
  const { View } = require("react-native")
  return {
    ...jest.requireActual("app/Scenes/Fair/Fair"),
    Fair: () => <View testID="Fair" />,
  }
})

jest.mock("app/Scenes/Partner/Partner", () => {
  const { View } = require("react-native")
  return {
    ...jest.requireActual("app/Scenes/Partner/Partner"),
    PartnerContainer: () => <View testID="PartnerContainer" />,
  }
})

jest.mock("app/utils/queryPrefetching", () => {
  const queryPrefetching = jest.requireActual("app/utils/queryPrefetching")
  return {
    ...queryPrefetching,
    prefetchQuery: jest.fn(),
  }
})

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

  it("renders a VanityURLPossibleRedirect when 404", async () => {
    if (__renderWithPlaceholderTestUtils__) {
      __renderWithPlaceholderTestUtils__.allowFallbacksAtTestTime = true
    }
    await renderWithWrappers(<TestRenderer entity="unknown" slug="a-cool-new-url" />)

    await act(() => {
      env.mock.resolveMostRecentOperation({ data: undefined, errors: [{ message: "404" }] })
    })

    expect(screen.getAllByTestId("VanityURLPossibleRedirect")).toHaveLength(1)
  })

  describe("rendering a profile", () => {
    it("shows a fair placeholder when entityType is fair", async () => {
      await renderWithWrappers(<TestRenderer entity="fair" slugType="profileID" slug="some-fair" />)

      expect(screen.getByTestId("FairPlaceholder")).toBeOnTheScreen()
    })

    it("shows a partner placeholder when entityType is partner", async () => {
      await renderWithWrappers(
        <TestRenderer entity="partner" slugType="profileID" slug="some-partner" />
      )

      expect(screen.getByTestId("PartnerPlaceholder")).toBeOnTheScreen()
    })

    it("shows a spinner when entityType is unknown", async () => {
      await renderWithWrappers(
        <TestRenderer entity="unknown" slugType="profileID" slug="some-partner" />
      )

      expect(screen.getByTestId("LoadingSpinner")).toBeOnTheScreen()
    })

    it("renders a partner when a partner is returned", async () => {
      await renderWithWrappers(
        <TestRenderer entity="partner" slugType="profileID" slug="some-gallery" />
      )
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "VanityURLEntityQuery"
      )

      await act(() => {
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

      expect(screen.getByTestId("PartnerContainer")).toBeOnTheScreen()
    })

    it("renders a fair when a fair is returned", async () => {
      await renderWithWrappers(<TestRenderer entity="fair" slugType="profileID" slug="some-fair" />)
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "VanityURLEntityQuery"
      )
      await act(() => {
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

      expect(screen.getByTestId("Fair")).toBeOnTheScreen()
    })

    it("renders a webview when an unknown profile type is returned", async () => {
      await renderWithWrappers(
        <TestRenderer entity="unknown" slugType="profileID" slug="some-unknown-id" />
      )
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
        "VanityURLEntityQuery"
      )
      await act(() => {
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
      expect(screen.getByTestId("VanityURLPossibleRedirect")).toBeOnTheScreen()
    })
  })
})
