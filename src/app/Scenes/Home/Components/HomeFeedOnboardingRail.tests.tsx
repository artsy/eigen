import { setupTestWrapperTL } from "app/tests/setupTestWrapper"
import { Theme } from "palette"
import { graphql } from "react-relay"
import { HomeFeedOnboardingRailFragmentContainer } from "./HomeFeedOnboardingRail"

jest.unmock("react-relay")

describe("HomeFeedOnboardingRail", () => {
  const { renderWithRelay } = setupTestWrapperTL({
    Component: (props) => {
      return (
        <Theme>
          <HomeFeedOnboardingRailFragmentContainer
            onboardingModule={props.homePage.onboardingModule}
            title="Do More on Artsy"
          />
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
    const { getByTestId, getAllByTestId, getByText } = renderWithRelay({
      HomePage: () => ({
        onboardingModule: {
          showMyCollectionCard: true,
          showSWACard: true,
        },
      }),
    })

    expect(getByTestId("my-collection-hf-onboadring-rail")).toBeTruthy()
    expect(getAllByTestId("my-collection-hf-onboadring-card")).toHaveLength(2)
    expect(getByText("Manage your collection")).toBeTruthy()
    expect(getByText("Sell with Artsy")).toBeTruthy()
  })

  it("renders one card when only one card is visible", () => {
    const { getByTestId, getAllByTestId, getByText, queryAllByText } = renderWithRelay({
      HomePage: () => ({
        onboardingModule: {
          showMyCollectionCard: true,
          showSWACard: false,
        },
      }),
    })

    expect(getByTestId("my-collection-hf-onboadring-rail")).toBeTruthy()
    expect(getAllByTestId("my-collection-hf-onboadring-card")).toHaveLength(1)
    expect(getByText("Manage your collection")).toBeTruthy()
    expect(queryAllByText("Sell with Artsy")).toHaveLength(0)
  })

  it("doesn't render any cards when both cards are not visible", () => {
    const { queryAllByTestId } = renderWithRelay({
      HomePage: () => ({
        onboardingModule: {
          showMyCollectionCard: false,
          showSWACard: false,
        },
      }),
    })

    expect(queryAllByTestId("my-collection-hf-onboadring-rail")).toHaveLength(0)
    expect(queryAllByTestId("my-collection-hf-onboadring-card")).toHaveLength(0)
  })
})
