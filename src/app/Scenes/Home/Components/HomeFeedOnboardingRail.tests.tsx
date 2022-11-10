import { setupTestWrapperTL } from "app/tests/setupTestWrapper"
import { Theme } from "palette"
import { graphql } from "react-relay"
import { HomeFeedOnboardingRail } from "./HomeFeedOnboardingRail"

jest.unmock("react-relay")

describe("HomeFeedOnboardingRail", () => {
  const { renderWithRelay } = setupTestWrapperTL({
    Component: (props) => {
      return (
        <Theme>
          <HomeFeedOnboardingRail {...props} />
        </Theme>
      )
    },
    query: graphql`
      query HomeFeedOnboardingRailTestsQuery @raw_response_type {
        homePage {
          onboardingModule {
            showMyCollectionCard
            showSWACard
          }
        }
      }
    `,
  })

  it("doesn't throw an error when rendered", () => {
    const { getByTestId } = renderWithRelay({
      HomePage: () => ({
        homePageAbove: {
          onboardingModule: {
            showMyCollectionCard: true,
            showSWACard: true,
          },
        },
      }),
    })

    expect(getByTestId("my-collection-hf-onboadring-rail")).toBeTruthy()
  })
})
