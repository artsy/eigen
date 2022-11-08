import { HomeFeedOnboardingRailTestsQuery } from "__generated__/HomeFeedOnboardingRailTestsQuery.graphql"
import { renderWithHookWrappersTL } from "app/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { graphql, QueryRenderer } from "react-relay"
import { createMockEnvironment } from "relay-test-utils"
import { HomeFeedOnboardingRailFragmentContainer } from "./HomeFeedOnboardingRail"

jest.unmock("react-relay")

describe("HomeFeedOnboardingRail", () => {
  let mockEnvironment: ReturnType<typeof createMockEnvironment>
  const TestRenderer = () => {
    return (
      <QueryRenderer<HomeFeedOnboardingRailTestsQuery>
        environment={mockEnvironment}
        query={graphql`
          query HomeFeedOnboardingRailTestsQuery @raw_response_type {
            homePage {
              onboardingModule {
                ...HomeFeedOnboardingRail_onboardingModule
              }
            }
          }
        `}
        variables={{}}
        render={({ props, error }) => {
          if (props) {
            return (
              <HomeFeedOnboardingRailFragmentContainer
                title="Do More on Artsy"
                onboardingModule={props.homePage?.onboardingModule!}
              />
            )
          } else if (error) {
            console.log(error)
          }
        }}
      />
    )
  }

  beforeEach(() => {
    mockEnvironment = createMockEnvironment()
  })

  it("doesn't throw when rendered", () => {
    const { getByTestId } = renderWithHookWrappersTL(<TestRenderer />, mockEnvironment)

    resolveMostRecentRelayOperation(mockEnvironment, {
      HomePage: () => ({
        homePageAbove: {
          onboardingModule: {
            showMyCollectionCard: true,
            showSWACard: true,
          },
        },
      }),
    })
    expect(getByTestId("my-collection-hf-onboadring")).toBeTruthy()
  })
})
