import { ActionType, ContextModule } from "@artsy/cohesion"
import { useTracking } from "react-tracking"
import { useOnboardingTracking } from "app/Scenes/Onboarding/OnboardingV2/Hooks/useOnboardingTracking"

const trackEventMock = jest.fn()
jest.mock("react-tracking")
;(useTracking as jest.Mock).mockImplementation(() => {
  return {
    useTracking: () => {
      return {
        trackEvent: trackEventMock,
      }
    },
  }
})

jest.mock("@react-navigation/native", () => {
  return {
    useNavigation: () => {
      return {
        getId: jest.fn(),
      }
    },
  }
})

describe("useOnboardingTracking", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it.each<
    | [keyof ReturnType<typeof useOnboardingTracking>, ActionType, null, null, null, null]
    | [
        keyof ReturnType<typeof useOnboardingTracking>,
        ActionType,
        ContextModule,
        string,
        null,
        null
      ]
    | [
        keyof ReturnType<typeof useOnboardingTracking>,
        ActionType,
        ContextModule,
        null,
        string,
        boolean
      ]
    | [
        keyof ReturnType<typeof useOnboardingTracking>,
        ActionType,
        ContextModule,
        string[],
        null,
        null
      ]
  >([
    ["trackStartedOnboarding", ActionType.startedOnboarding, null, null, null, null],
    [
      "trackAnsweredQuestionOne",
      ActionType.onboardingUserInputData,
      ContextModule.onboardingCollectorLevel,
      "question 1 test response",
      null,
      null,
    ],
    [
      "trackAnsweredQuestionTwo",
      ActionType.onboardingUserInputData,
      ContextModule.onboardingInterests,
      ["question 2 test response 0", "question 2 test response 1"],
      null,
      null,
    ],
    [
      "trackAnsweredQuestionThree",
      ActionType.onboardingUserInputData,
      ContextModule.onboardingActivity,
      "question 3 test response",
      null,
      null,
    ],
    [
      "trackArtistFollow",
      ActionType.followedArtist,
      ContextModule.onboardingFlow,
      null,
      "artist-test-id",
      false,
    ],
    [
      "trackGalleryFollow",
      ActionType.followedPartner,
      ContextModule.onboardingFlow,
      null,
      "partner-test-id",
      false,
    ],
    [
      "trackGeneFollow",
      ActionType.followedGene,
      ContextModule.onboardingFlow,
      null,
      "gene-test-id",
      true,
    ],
    ["trackCompletedOnboarding", ActionType.completedOnboarding, null, null, null, null],
  ])(
    "%s calls trackEvent with the expected payload",
    (key, actionType, contextModule, response, internalId, isFollowed) => {
      const { [key]: fn } = useOnboardingTracking()

      expect(trackEventMock).toHaveBeenCalledWith()
    }
  )

  it.each()(() => {})
  it.each()(() => {})
})
