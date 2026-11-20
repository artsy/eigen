import { fireEvent, screen } from "@testing-library/react-native"
import { FollowIconButton } from "app/Components/FollowIconButton"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("FollowIconButton", () => {
  it("shows the add glyph when not followed, and the tick when followed", async () => {
    await renderWithWrappers(<FollowIconButton isFollowed={false} onPress={jest.fn()} />)

    expect(screen.getByTestId("follow-icon-button-add")).toBeOnTheScreen()
    expect(screen.queryByTestId("follow-icon-button-check")).not.toBeOnTheScreen()

    await screen.unmount()
    await renderWithWrappers(<FollowIconButton isFollowed onPress={jest.fn()} />)

    expect(screen.getByTestId("follow-icon-button-check")).toBeOnTheScreen()
    expect(screen.queryByTestId("follow-icon-button-add")).not.toBeOnTheScreen()
  })

  it("calls onPress", async () => {
    const onPress = jest.fn()
    await renderWithWrappers(<FollowIconButton isFollowed={false} onPress={onPress} />)

    await fireEvent.press(screen.getByTestId("follow-icon-button"))

    expect(onPress).toHaveBeenCalled()
  })

  // Guards against a double-fire while the mutation is still running.
  it("does not fire while a follow is in flight", async () => {
    const onPress = jest.fn()
    await renderWithWrappers(<FollowIconButton isFollowed={false} isInFlight onPress={onPress} />)

    await fireEvent.press(screen.getByTestId("follow-icon-button"))

    expect(onPress).not.toHaveBeenCalled()
  })

  it("names the thing being followed in its label, and the action alone without a name", async () => {
    await renderWithWrappers(
      <FollowIconButton isFollowed={false} name="440 Gallery" onPress={jest.fn()} />
    )

    expect(screen.getByLabelText("Save 440 Gallery")).toBeOnTheScreen()

    await screen.unmount()
    await renderWithWrappers(<FollowIconButton isFollowed onPress={jest.fn()} />)

    expect(screen.getByLabelText("Unsave")).toBeOnTheScreen()
  })

  // The City Guide rails draw it at 18; everywhere else takes the 24 default.
  it("draws at the requested size, defaulting to 24", async () => {
    await renderWithWrappers(<FollowIconButton isFollowed={false} onPress={jest.fn()} />)

    expect(screen.getByTestId("follow-icon-button-add")).toHaveProp("width", 24)

    await screen.unmount()
    await renderWithWrappers(<FollowIconButton isFollowed={false} size={18} onPress={jest.fn()} />)

    expect(screen.getByTestId("follow-icon-button-add")).toHaveProp("width", 18)
  })
})
