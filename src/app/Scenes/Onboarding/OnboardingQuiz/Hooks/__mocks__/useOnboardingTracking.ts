export const useOnboardingTracking = jest.fn().mockImplementation(() => {
  return {
    trackStartedOnboarding: jest.fn(),
    trackAnsweredQuestionOne: jest.fn(),
    trackAnsweredQuestionTwo: jest.fn(),
    trackAnsweredQuestionThree: jest.fn(),
    trackArtistFollow: jest.fn(),
    trackGeneFollow: jest.fn(),
    trackPartnerFollow: jest.fn(),
    trackGalleryFollow: jest.fn(),
    trackCompletedOnboarding: jest.fn(),
  }
})
