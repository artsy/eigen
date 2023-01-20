import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"
import { OnboardingMarketingCollectionScreen } from "../OnboardingMarketingCollection"

jest.unmock("react-relay")

const mockedNavigate = jest.fn()

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native")
  return {
    ...actualNav,
    useNavigation: () => ({
      getId: () => "onboarding-marketing-collection-id",
      navigate: mockedNavigate,
    }),
  }
})

describe("OnboardingMarketingCollection", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const description = "This is the description."
  const placeholderText = "Great choice\nWe’re finding a collection for you"

  it("renders properly", async () => {
    renderWithHookWrappersTL(
      <OnboardingMarketingCollectionScreen
        slug="curators-picks-emerging"
        description={description}
      />,
      env
    )

    expect(screen.queryByText(placeholderText)).toBeTruthy()

    resolveMostRecentRelayOperation(env, {
      MarketingCollection: () => ({
        title: "Example Collection",
      }),
    })

    await waitForElementToBeRemoved(() => screen.getByText(placeholderText))

    expect(screen.queryByText(placeholderText)).toBeNull()

    expect(screen.queryByText("Example Collection")).toBeTruthy()
    expect(screen.queryByText(description)).toBeTruthy()

    expect(screen.queryByText("Explore More on Artsy")).toBeTruthy()
  })
})
