import { fireEvent } from "@testing-library/react-native"
import { CareerHighlightsRailTestQuery } from "__generated__/CareerHighlightsRailTestQuery.graphql"
import { navigate } from "app/navigation/navigate"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { graphql, useLazyLoadQuery } from "react-relay"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { CareerHighlightsRail } from "./CareerHighlightsRail"

jest.unmock("react-relay")

describe("CareerHighlightsRail", () => {
  const TestRenderer = () => {
    const data = useLazyLoadQuery<CareerHighlightsRailTestQuery>(
      graphql`
        query CareerHighlightsRailTestQuery @relay_test_operation {
          me {
            ...CareerHighlightsRail_me
          }
        }
      `,
      {}
    )

    return <CareerHighlightsRail me={data.me!} />
  }

  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  beforeEach(() => (mockEnvironment = createMockEnvironment()))

  it("renders the rail with data", async () => {
    const { getByTestId, getByText } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation({
        data: {
          me: {
            myCollectionInfo: {
              artistInsightsCount: {
                BIENNIAL: 1,
                COLLECTED: 2,
                GROUP_SHOW: 1,
                SOLO_SHOW: 0,
                REVIEWED: 4,
              },
            },
          },
        },
      })
    })

    await flushPromiseQueue()

    expect(getByTestId("career-highlight-cards-flatlist")).toBeTruthy()
    // singular
    expect(getByText("Artist was included in a major biennial.")).toBeTruthy()
    expect(getByText("Artist was in a group show at a major institution.")).toBeTruthy()

    // plural
    expect(getByText("Artists are collected by a major institutions.")).toBeTruthy()
    expect(getByText("Artists were reviewed by a major art publications.")).toBeTruthy()

    // promo card
    expect(getByText("Discover career highlights for your artists.")).toBeTruthy()

    expect(() => getByText("Artist had a solo show at a major institution.")).toThrow(
      "Unable to find an element with text: Artist had a solo show at a major institution."
    )
  })

  it("does not render when the count is 0 for all kinds", async () => {
    const { queryByTestId } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation({
        data: {
          me: {
            myCollectionInfo: {
              artistInsightsCount: {
                BIENNIAL: 0,
                COLLECTED: 0,
                GROUP_SHOW: 0,
                SOLO_SHOW: 0,
                REVIEWED: 0,
              },
            },
          },
        },
      })
    })

    await flushPromiseQueue()

    expect(queryByTestId("career-highlight-cards-flatlist")).toBeFalsy()
  })

  it("navigates to the correct screen with correct passProps", async () => {
    const { getByTestId } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)
    act(() => {
      mockEnvironment.mock.resolveMostRecentOperation({
        data: {
          me: {
            myCollectionInfo: {
              artistInsightsCount: {
                BIENNIAL: 1,
              },
            },
          },
        },
      })
    })
    await flushPromiseQueue()

    fireEvent(getByTestId("career-highlight-card-item"), "press")
    expect(navigate).toHaveBeenCalledWith("/my-collection/career-highlights-big-cards-swiper", {
      modal: true,
      passProps: { careerHighlightsAvailableTypes: ["BIENNIAL"], type: "BIENNIAL" },
    })
  })
})
