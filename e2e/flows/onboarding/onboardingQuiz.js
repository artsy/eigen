output.onboardingQuiz = { ...output.onboardingQuiz }

if (!output.onboardingQuiz.button) {
  output.onboardingQuiz = {
    counter: 0,
    button: () => {
      return counter % 2 === 0 ? "Like" : "Skip"
    },
  }
} else {
  output.onboardingQuiz = {
    ...output.onboardingQuiz,
    counter: output.onboardingQuiz.counter + 1,
  }
}
