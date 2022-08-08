import { fireEvent } from "@testing-library/react-native"
import { PartnerLink_Test_Query } from "__generated__/PartnerLink_Test_Query.graphql"
import * as navigate from "app/navigation/navigate"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, useLazyLoadQuery } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { PartnerLink } from "./PartnerLink"

jest.unmock("react-relay")

describe("PartnerLink", () => {
  const TestRenderer = () => {
    const data = useLazyLoadQuery<PartnerLink_Test_Query>(
      graphql`
        query PartnerLink_Test_Query {
          artwork(id: "test-id") {
            ...PartnerLink_artwork
          }
        }
      `,
      {}
    )
    return <PartnerLink artwork={data.artwork!} />
  }
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const navigateToPartnerSpy = jest.spyOn(navigate, "navigateToPartner")

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
    jest.clearAllMocks()
  })

  it("renders and calls navigation", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)
    resolveMostRecentRelayOperation(mockEnvironment, {})
    await flushPromiseQueue()

    expect(getByText("name-1")).toBeDefined()
    fireEvent.press(getByText("name-1"))
    expect(navigateToPartnerSpy).toHaveBeenLastCalledWith("href-1")
  })

  it("does not call navigation given a non linkable partner", async () => {
    const { getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)
    resolveMostRecentRelayOperation(mockEnvironment, {
      Artwork: () => ({
        partner: {
          name: "non-linkable",
          isLinkable: false,
        },
      }),
    })
    await flushPromiseQueue()

    fireEvent.press(getByText("non-linkable"))
    expect(navigateToPartnerSpy).not.toHaveBeenCalled()
  })
})
