import { setupTestWrapperTL } from "app/tests/setupTestWrapper"
import { Theme } from "palette"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { graphql } from "react-relay"
import { HomeFeedOnboardingRailFragmentContainer } from "./HomeFeedOnboardingRail"

jest.unmock("react-relay")

describe("HomeFeedOnboardingRail", () => {
  const { renderWithRelay } = setupTestWrapperTL({
    Component: (props) => {
      return (
        <Theme>
          <SafeAreaProvider>
            <HomeFeedOnboardingRailFragmentContainer
              onboardingModule={props.homePage.onboardingModule}
              title="Do More on Artsy"
            />
          </SafeAreaProvider>
        </Theme>
      )
    },
    query: graphql`
      query HomeFeedOnboardingRailTestsQuery {
        homePage {
          onboardingModule {
            ...HomeFeedOnboardingRail_onboardingModule
          }
        }
      }
    `,
  })

  it("renders two cards when both cards are visible", () => {
    const { getByText } = renderWithRelay({
      HomePage: () => ({
        onboardingModule: {
          showMyCollectionCard: true,
          showSWACard: true,
        },
      }),
    })

    expect(getByText("Manage your collection")).toBeTruthy()
    expect(getByText("Sell with Artsy")).toBeTruthy()
  })

  it("renders one card when only one card is visible", () => {
    const { getByText, queryAllByText } = renderWithRelay({
      HomePage: () => ({
        onboardingModule: {
          showMyCollectionCard: true,
          showSWACard: false,
        },
      }),
    })

    expect(getByText("Manage your collection")).toBeTruthy()
    expect(queryAllByText("Sell with Artsy")).toHaveLength(0)
  })

  it("doesn't render any cards when both cards are not visible", () => {
    const { getByText } = renderWithRelay({
      HomePage: () => ({
        onboardingModule: {
          showMyCollectionCard: false,
          showSWACard: false,
        },
      }),
    })

    expect(() => getByText("Manage your collection")).toThrow()
    expect(() => getByText("Sell with Artsy")).toThrow()
  })
})
