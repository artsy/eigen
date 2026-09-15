import { fireEvent, screen } from "@testing-library/react-native"
import { FollowIconButton } from "app/Components/FollowIconButton"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("FollowIconButton", () => {
  it("shows the add glyph when not followed, and the tick when followed", () => {
    renderWithWrappers(<FollowIconButton isFollowed={false} onPress={jest.fn()} />)

    expect(screen.getByTestId("follow-icon-button-add")).toBeOnTheScreen()
    expect(screen.queryByTestId("follow-icon-button-check")).not.toBeOnTheScreen()

    screen.unmount()
    renderWithWrappers(<FollowIconButton isFollowed onPress={jest.fn()} />)

    expect(screen.getByTestId("follow-icon-button-check")).toBeOnTheScreen()
    expect(screen.queryByTestId("follow-icon-button-add")).not.toBeOnTheScreen()
  })

  it("calls onPress", () => {
    const onPress = jest.fn()
    renderWithWrappers(<FollowIconButton isFollowed={false} onPress={onPress} />)

    fireEvent.press(screen.getByTestId("follow-icon-button"))

    expect(onPress).toHaveBeenCalled()
  })

  // Guards against a double-fire while the mutation is still running.
  it("does not fire while a follow is in flight", () => {
    const onPress = jest.fn()
    renderWithWrappers(<FollowIconButton isFollowed={false} isInFlight onPress={onPress} />)

    fireEvent.press(screen.getByTestId("follow-icon-button"))

    expect(onPress).not.toHaveBeenCalled()
  })

  it("names the thing being followed in its label, and the action alone without a name", () => {
    renderWithWrappers(
      <FollowIconButton isFollowed={false} name="440 Gallery" onPress={jest.fn()} />
    )

    expect(screen.getByLabelText("Save 440 Gallery")).toBeOnTheScreen()

    screen.unmount()
    renderWithWrappers(<FollowIconButton isFollowed onPress={jest.fn()} />)

    expect(screen.getByLabelText("Unsave")).toBeOnTheScreen()
  })

  // The City Guide rails draw it at 18; everywhere else takes the 24 default.
  it("draws at the requested size, defaulting to 24", () => {
    renderWithWrappers(<FollowIconButton isFollowed={false} onPress={jest.fn()} />)

    expect(screen.getByTestId("follow-icon-button-add")).toHaveProp("width", 24)

    screen.unmount()
    renderWithWrappers(<FollowIconButton isFollowed={false} size={18} onPress={jest.fn()} />)

    expect(screen.getByTestId("follow-icon-button-add")).toHaveProp("width", 18)
  })
})
