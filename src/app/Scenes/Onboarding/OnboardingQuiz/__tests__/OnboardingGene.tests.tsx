import { fireEvent, screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { OnboardingGeneScreen } from "app/Scenes/Onboarding/OnboardingQuiz/OnboardingGene"
import { renderWithHookWrappersTL } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { createMockEnvironment } from "relay-test-utils"

jest.mock("app/Scenes/Onboarding/OnboardingQuiz/Hooks/useOnboardingTracking")

const mockedNavigate = jest.fn()

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native")
  return {
    ...actualNav,
    useNavigation: () => ({
      getId: () => "onboarding-gene-id",
      navigate: mockedNavigate,
    }),
  }
})

describe("OnboardingGene", () => {
  let env: ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env = createMockEnvironment()
  })

  const description = "This is the description."
  const placeholderText = "Great choice\nWe’re finding a collection for you"

  it("renders properly", async () => {
    renderWithHookWrappersTL(<OnboardingGeneScreen id="trove" description={description} />, env)

    expect(screen.queryByText(placeholderText)).toBeTruthy()

    resolveMostRecentRelayOperation(env, {
      Gene: () => ({
        name: "Example Gene",
      }),
    })

    await waitForElementToBeRemoved(() => screen.getByText(placeholderText))

    expect(screen.queryByText(placeholderText)).toBeNull()

    expect(screen.queryByText("Example Gene")).toBeTruthy()
    expect(screen.queryByText(description)).toBeTruthy()

    expect(screen.queryByText("Find your Saves and Follows in your settings.")).toBeTruthy()
    expect(screen.queryByText("Explore More on Artsy")).toBeTruthy()
  })

  it("lets collector follow a gene", async () => {
    renderWithHookWrappersTL(<OnboardingGeneScreen id="trove" description={description} />, env)

    resolveMostRecentRelayOperation(env, {
      Gene: () => ({
        name: "Example Gene",
        isFollowed: false,
      }),
    })

    await waitForElementToBeRemoved(() => screen.getByText(placeholderText))

    expect(screen.queryByText("Example Gene")).toBeTruthy()
    expect(screen.queryByText("Follow")).toBeTruthy()
    expect(screen.queryByText("Following")).toBeNull()

    fireEvent.press(screen.getByText("Follow"))

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toEqual(
      "GeneHeaderFollowButtonMutation"
    )
  })
})
