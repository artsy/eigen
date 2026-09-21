import { fireEvent, screen } from "@testing-library/react-native"
import { AddToItineraryProvider } from "app/Scenes/CityGuide/Components/AddToItinerarySheet/AddToItineraryProvider"
import { CityGuideShowCard } from "app/Scenes/CityGuide/Components/CityGuideShowCard"
import { cityGuideFairFragment } from "app/Scenes/CityGuide/utils/CityGuideFair"
import { cityGuideShowFragment } from "app/Scenes/CityGuide/utils/CityGuideShow"
import { Fair, Show } from "app/Scenes/CityGuide/utils/types"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { Schema } from "app/utils/track"
import { graphql, useFragment } from "react-relay"

beforeEach(() => {
  jest.clearAllMocks()
})

describe("CityGuideShowCard", () => {
  describe("Show branch", () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: ({ show }: any) => {
        const [data] = useFragment(cityGuideShowFragment, [show])

        return (
          <AddToItineraryProvider citySlug="new-york-ny-usa" cityName="New York">
            <CityGuideShowCard shows={[data as Show]} />
          </AddToItineraryProvider>
        )
      },
      query: graphql`
        query CityGuideShowCardTestsShowQuery @relay_test_operation {
          show(id: "show-id") {
            ...CityGuideShow_show
          }
        }
      `,
    })

    it("renders an add-to-itinerary control", () => {
      renderWithRelay({
        Show: () => ({ internalID: "show-internal-id", name: "Frida Kahlo", type: "Show" }),
      })

      expect(screen.getByLabelText("Add Frida Kahlo to an itinerary")).toBeTruthy()
    })

    it("tracks the tap against the show when pressed", () => {
      renderWithRelay({
        Show: () => ({ internalID: "show-internal-id", name: "Frida Kahlo", type: "Show" }),
      })

      fireEvent.press(screen.getByTestId("city-guide-save-button"))

      expect(mockTrackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action_name: Schema.ActionNames.SaveShow,
          owner_type: Schema.OwnerEntityTypes.Show,
          owner_id: "show-internal-id",
        })
      )
    })

    it("renders no add-to-itinerary control without a provider", () => {
      const { renderWithRelay: renderWithoutProvider } = setupTestWrapper({
        Component: ({ show }: any) => {
          const [data] = useFragment(cityGuideShowFragment, [show])

          return <CityGuideShowCard shows={[data as Show]} />
        },
        query: graphql`
          query CityGuideShowCardTestsShowNoProviderQuery @relay_test_operation {
            show(id: "show-id") {
              ...CityGuideShow_show
            }
          }
        `,
      })

      renderWithoutProvider({
        Show: () => ({ internalID: "show-internal-id", name: "Frida Kahlo", type: "Show" }),
      })

      expect(screen.queryByTestId("city-guide-save-button")).toBeNull()
    })
  })

  describe("Fair branch", () => {
    const { renderWithRelay } = setupTestWrapper({
      Component: ({ fair }: any) => {
        const [data] = useFragment(cityGuideFairFragment, [fair])

        return (
          <AddToItineraryProvider citySlug="new-york-ny-usa" cityName="New York">
            <CityGuideShowCard shows={[{ ...data, type: "Fair" } as Fair]} />
          </AddToItineraryProvider>
        )
      },
      query: graphql`
        query CityGuideShowCardTestsFairQuery @relay_test_operation {
          fair(id: "fair-id") {
            ...CityGuideFair_fair
          }
        }
      `,
    })

    it("renders an add-to-itinerary control", () => {
      renderWithRelay({
        Fair: () => ({ internalID: "fair-internal-id", name: "Frieze" }),
      })

      expect(screen.getByLabelText("Add Frieze to an itinerary")).toBeTruthy()
    })

    it("tracks the tap against the fair when pressed", () => {
      renderWithRelay({
        Fair: () => ({ internalID: "fair-internal-id", name: "Frieze" }),
      })

      fireEvent.press(screen.getByTestId("city-guide-save-button"))

      expect(mockTrackEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          action_name: Schema.ActionNames.FollowFair,
          owner_type: Schema.OwnerEntityTypes.Fair,
          owner_id: "fair-internal-id",
        })
      )
    })

    it("renders no add-to-itinerary control without a provider", () => {
      const { renderWithRelay: renderWithoutProvider } = setupTestWrapper({
        Component: ({ fair }: any) => {
          const [data] = useFragment(cityGuideFairFragment, [fair])

          return <CityGuideShowCard shows={[{ ...data, type: "Fair" } as Fair]} />
        },
        query: graphql`
          query CityGuideShowCardTestsFairNoProviderQuery @relay_test_operation {
            fair(id: "fair-id") {
              ...CityGuideFair_fair
            }
          }
        `,
      })

      renderWithoutProvider({
        Fair: () => ({ internalID: "fair-internal-id", name: "Frieze" }),
      })

      expect(screen.queryByTestId("city-guide-save-button")).toBeNull()
    })
  })
})
