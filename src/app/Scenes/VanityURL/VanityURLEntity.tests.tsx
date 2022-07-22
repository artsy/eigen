import { act } from "@testing-library/react-native"
import { HeaderTabsGridPlaceholder } from "app/Components/HeaderTabGridPlaceholder"
import { getMockRelayEnvironment, getRelayEnvironment } from "app/relay/defaultEnvironment"
import { Fair, FairFragmentContainer, FairPlaceholder } from "app/Scenes/Fair/Fair"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers, renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import {
  resolveMostRecentRelayOperation,
  resolveMostRecentRelayOperationRawPayload,
} from "app/tests/resolveMostRecentRelayOperation"
import { __renderWithPlaceholderTestUtils__ } from "app/utils/renderWithPlaceholder"
import { Spinner } from "palette"
import { MockPayloadGenerator, RelayMockEnvironment } from "relay-test-utils"
import { PartnerContainer } from "../Partner/Partner"
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
  it("renders a VanityURLPossibleRedirect when 404", () => {
    if (__renderWithPlaceholderTestUtils__) {
      __renderWithPlaceholderTestUtils__.allowFallbacksAtTestTime = true
    }
    const { UNSAFE_getAllByType } = renderWithWrappers(
      <TestRenderer entity="unknown" slug="a-cool-new-url" />
    )
    resolveMostRecentRelayOperationRawPayload({ data: undefined, errors: [{ message: "404" }] })
    expect(UNSAFE_getAllByType(VanityURLPossibleRedirect)).toHaveLength(1)
  })

  it("renders a fairQueryRenderer when given a fair id", () => {
    const tree = renderWithWrappersLEGACY(
      <TestRenderer entity="fair" slugType="fairID" slug="some-fair" />
    )
    expect(
      (getRelayEnvironment as () => RelayMockEnvironment)().mock.getMostRecentOperation().request
        .node.operation.name
    ).toBe("FairQuery")
    act(() => {
      getMockRelayEnvironment().mock.resolveMostRecentOperation((operation) =>
        MockPayloadGenerator.generate(operation)
      )
    })
    const fairComponent = tree.root.findByType(Fair)
    expect(fairComponent).toBeDefined()
  })

  describe("rendering a profile", () => {
    it("shows a fair placeholder when entityType is fair", () => {
      const tree = renderWithWrappersLEGACY(
        <TestRenderer entity="fair" slugType="profileID" slug="some-fair" />
      )
      const fairPlaceholder = tree.root.findByType(FairPlaceholder)
      expect(fairPlaceholder).toBeDefined()
    })

    it("shows a partner placeholder when entityType is partner", () => {
      const tree = renderWithWrappersLEGACY(
        <TestRenderer entity="partner" slugType="profileID" slug="some-partner" />
      )
      const partnerPlaceholder = tree.root.findByType(HeaderTabsGridPlaceholder)
      expect(partnerPlaceholder).toBeDefined()
    })

    it("shows a spinner when entityType is unknown", () => {
      const tree = renderWithWrappersLEGACY(
        <TestRenderer entity="unknown" slugType="profileID" slug="some-partner" />
      )
      const spinner = tree.root.findByType(Spinner)
      expect(spinner).toBeDefined()
    })

    it("renders a partner when a partner is returned", () => {
      const tree = renderWithWrappersLEGACY(
        <TestRenderer entity="partner" slugType="profileID" slug="some-gallery" />
      )
      expect(
        getMockRelayEnvironment().mock.getMostRecentOperation().request.node.operation.name
      ).toBe("VanityURLEntityQuery")
      resolveMostRecentRelayOperation({
        Query: () => ({
          vanityURLEntity: {
            __typename: "Partner",
            id: "some-gallery",
            name: "Some Gallery",
            cities: [],
          },
        }),
      })

      const partnerComponent = tree.root.findByType(PartnerContainer)
      expect(partnerComponent).toBeDefined()
    })

    it("renders a fair when a fair is returned", () => {
      const tree = renderWithWrappersLEGACY(
        <TestRenderer entity="fair" slugType="profileID" slug="some-fair" />
      )
      expect(
        getMockRelayEnvironment().mock.getMostRecentOperation().request.node.operation.name
      ).toBe("VanityURLEntityQuery")
      resolveMostRecentRelayOperation({
        Query: () => ({
          vanityURLEntity: {
            __typename: "Fair",
            id: "some-fair",
            slug: "some-fair",
          },
        }),
      })
      const fairComponent = tree.root.findByType(FairFragmentContainer)
      expect(fairComponent).toBeDefined()
    })

    it("renders a webview when an unknown profile type is returned", () => {
      const tree = renderWithWrappersLEGACY(
        <TestRenderer entity="unknown" slugType="profileID" slug="some-unknown-id" />
      )
      expect(
        getMockRelayEnvironment().mock.getMostRecentOperation().request.node.operation.name
      ).toBe("VanityURLEntityQuery")
      resolveMostRecentRelayOperationRawPayload({
        errors: [],
        data: {
          vanityURLEntity: {
            __typename: "UnknownType",
            id: "some-unknown",
            slug: "some-unknown",
          },
        },
      })
      const webComponent = tree.root.findByType(VanityURLPossibleRedirect)
      expect(webComponent).toBeDefined()
    })
  })
})
