import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { useOnboardingTracking } from "app/Scenes/Onboarding/OnboardingQuiz/Hooks/useOnboardingTracking"
import { useTracking } from "react-tracking"

jest.mock("react-tracking")

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
  let trackEventMock: jest.Mock

  beforeEach(() => {
    trackEventMock = jest.fn()
    ;(useTracking as jest.Mock).mockImplementation(() => ({
      trackEvent: trackEventMock,
    }))
  })

  describe("user input event", () => {
    it.each<
      [
        "trackAnsweredQuestionOne" | "trackAnsweredQuestionTwo" | "trackAnsweredQuestionThree",
        ActionType,
        ContextModule,
        string | string[],
      ]
    >([
      [
        "trackAnsweredQuestionOne",
        ActionType.onboardingUserInputData,
        ContextModule.onboardingCollectorLevel,
        "question 1 test response",
      ],
      [
        "trackAnsweredQuestionTwo",
        ActionType.onboardingUserInputData,
        ContextModule.onboardingInterests,
        ["question 2 test response 0", "question 2 test response 1"],
      ],
      [
        "trackAnsweredQuestionThree",
        ActionType.onboardingUserInputData,
        ContextModule.onboardingActivity,
        "question 3 test response",
      ],
    ])(
      "%s calls trackEvent with the expected payload",
      (key, actionType, contextModule, response) => {
        const { [key]: fn } = useOnboardingTracking()

        // @ts-expect-error
        fn(response)

        expect(trackEventMock).toHaveBeenCalledWith({
          action: actionType,
          context_module: contextModule,
          data_input: typeof response === "string" ? response : response.join(),
        })
      }
    )
  })

  describe("start / end event", () => {
    it.each<["trackCompletedOnboarding" | "trackStartedOnboarding", ActionType]>([
      ["trackCompletedOnboarding", ActionType.completedOnboarding],
      ["trackStartedOnboarding", ActionType.startedOnboarding],
    ])("% calls trackEvent with the expected payload", (key, actionType) => {
      const { [key]: fn } = useOnboardingTracking()
      fn()
      expect(trackEventMock).toHaveBeenCalledWith({
        action: actionType,
      })
    })
  })

  describe("follow event", () => {
    it.each<
      [
        "trackArtistFollow" | "trackGalleryFollow" | "trackGeneFollow",
        ActionType,
        ContextModule,
        string,
        boolean,
        OwnerType,
        OwnerType,
      ]
    >([
      [
        "trackArtistFollow",
        ActionType.followedArtist,
        ContextModule.onboardingFlow,
        "artist-test-id",
        false,
        OwnerType.savesAndFollows,
        OwnerType.artist,
      ],
      [
        "trackGalleryFollow",
        ActionType.followedPartner,
        ContextModule.onboardingFlow,
        "partner-test-id",
        false,
        OwnerType.savesAndFollows,
        OwnerType.partner,
      ],
      [
        "trackGeneFollow",
        ActionType.followedGene,
        ContextModule.onboardingFlow,
        "gene-test-id",
        false,
        OwnerType.savesAndFollows,
        OwnerType.gene,
      ],
      [
        "trackArtistFollow",
        ActionType.unfollowedArtist,
        ContextModule.onboardingFlow,
        "artist-test-id",
        true,
        OwnerType.savesAndFollows,
        OwnerType.artist,
      ],
      [
        "trackGalleryFollow",
        ActionType.unfollowedPartner,
        ContextModule.onboardingFlow,
        "partner-test-id",
        true,
        OwnerType.savesAndFollows,
        OwnerType.partner,
      ],
      [
        "trackGeneFollow",
        ActionType.unfollowedGene,
        ContextModule.onboardingFlow,
        "gene-test-id",
        true,
        OwnerType.savesAndFollows,
        OwnerType.gene,
      ],
    ])(
      "%s calls trackEvent with the expected payload",
      (key, actionType, contextModule, internalID, isFollowed, contextOwnerType, ownerType) => {
        const { [key]: fn } = useOnboardingTracking()
        fn(isFollowed, internalID, "owner-slug-mock")
        expect(trackEventMock).toHaveBeenCalledWith({
          action: actionType,
          context_module: contextModule,
          context_owner_type: contextOwnerType,
          owner_id: internalID,
          owner_slug: "owner-slug-mock",
          owner_type: ownerType,
        })
      }
    )
  })
})
