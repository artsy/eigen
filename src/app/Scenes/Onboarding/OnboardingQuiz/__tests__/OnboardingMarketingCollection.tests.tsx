import { screen, waitForElementToBeRemoved } from "@testing-library/react-native"
import { OnboardingMarketingCollectionScreen } from "app/Scenes/Onboarding/OnboardingQuiz/OnboardingMarketingCollection"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { useEffect } from "react"
import { View } from "react-native"

const mockedNavigate = jest.fn()

jest.mock("app/utils/Sentinel", () => ({
  __esModule: true,
  Sentinel: (props: any) => <MockedVisibleSentinel {...props} />,
}))

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
  const description = "This is the description."
  const placeholderText = "Great choice\nWe’re finding a collection for you"

  const { renderWithRelay } = setupTestWrapper({
    Component: () => (
      <OnboardingMarketingCollectionScreen
        slug="curators-picks-emerging"
        description={description}
      />
    ),
  })

  it("renders properly", async () => {
    renderWithRelay({
      MarketingCollection: () => ({
        title: "Example Collection",
      }),
    })

    expect(screen.getByText(placeholderText)).toBeTruthy()

    await waitForElementToBeRemoved(() => screen.queryByText(placeholderText))

    expect(screen.queryByText(placeholderText)).toBeNull()

    expect(screen.getByText("Example Collection")).toBeTruthy()
    expect(screen.getByText(description)).toBeTruthy()

    expect(screen.getByText("Explore More on Artsy")).toBeTruthy()
  })
})

const MockedVisibleSentinel: React.FC<any> = ({ children, onChange }) => {
  useEffect(() => onChange(true), [])

  return <View>{children}</View>
}
