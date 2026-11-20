import { fireEvent, screen } from "@testing-library/react-native"
import { BrowsePromptStep } from "app/Scenes/Onboarding/Screens/Onboarding/Components/BrowsePromptStep"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("BrowsePromptStep", () => {
  it("renders the prompt and calls onNext", async () => {
    const onNext = jest.fn()
    await renderWithWrappers(<BrowsePromptStep onNext={onNext} />)

    expect(screen.getByText("What art are you drawn to?")).toBeOnTheScreen()
    expect(screen.getByText("Save the works that catch your eye.")).toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Start Swiping"))
    expect(onNext).toHaveBeenCalled()
  })
})
