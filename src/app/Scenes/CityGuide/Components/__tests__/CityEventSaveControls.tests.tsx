import { fireEvent, screen } from "@testing-library/react-native"
import {
  CityEventFairSaveControl,
  CityEventPartnerSaveControl,
  CityEventShowSaveControl,
} from "app/Scenes/CityGuide/Components/CityEventSaveControls"
import { mockTrackEvent } from "app/utils/tests/globallyMockedStuff"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

beforeEach(() => {
  jest.clearAllMocks()
})

describe("CityEventShowSaveControl", () => {
  const props = { id: "show-node-id", internalID: "show-internal-id", name: "Frida Kahlo" }

  it("offers to save a show that is not followed", () => {
    renderWithWrappers(<CityEventShowSaveControl {...props} isFollowed={false} />)

    expect(screen.getByLabelText("Save Frida Kahlo")).toBeTruthy()
    expect(screen.getByTestId("city-guide-save-button-add-icon")).toBeTruthy()
  })

  it("offers to unsave a show that is followed", () => {
    renderWithWrappers(<CityEventShowSaveControl {...props} isFollowed />)

    expect(screen.getByLabelText("Unsave Frida Kahlo")).toBeTruthy()
    expect(screen.getByTestId("city-guide-save-button-check-icon")).toBeTruthy()
  })

  it("treats a null follow state as not followed", () => {
    renderWithWrappers(<CityEventShowSaveControl {...props} isFollowed={null} />)

    expect(screen.getByLabelText("Save Frida Kahlo")).toBeTruthy()
  })
})

describe("variant", () => {
  it("renders the labelled form when asked", () => {
    renderWithWrappers(
      <CityEventShowSaveControl
        id="show-node-id"
        internalID="show-internal-id"
        isFollowed={false}
        name="Frida Kahlo"
        variant="button"
      />
    )

    // ItineraryStopPreview needs this form beside "Show on map".
    expect(screen.getByText("Save")).toBeTruthy()
  })
})

describe("CityEventFairSaveControl", () => {
  it("tracks a fair follow", () => {
    renderWithWrappers(
      <CityEventFairSaveControl
        id="profile-node-id"
        internalID="profile-internal-id"
        isFollowed={false}
        name="Frieze London"
      />
    )
    fireEvent.press(screen.getByLabelText("Save Frieze London"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action_name: "followFair" })
    )
  })

  it("tracks a fair unfollow", () => {
    renderWithWrappers(
      <CityEventFairSaveControl
        id="profile-node-id"
        internalID="profile-internal-id"
        isFollowed
        name="Frieze London"
      />
    )
    fireEvent.press(screen.getByLabelText("Unsave Frieze London"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ action_name: "unfollowFair" })
    )
  })

  it("labels itself with the fair name", () => {
    renderWithWrappers(
      <CityEventFairSaveControl
        id="profile-node-id"
        internalID="profile-internal-id"
        isFollowed={false}
        name="Frieze London"
      />
    )

    expect(screen.getByLabelText("Save Frieze London")).toBeTruthy()
  })
})

describe("CityEventPartnerSaveControl", () => {
  it("tracks a gallery follow", () => {
    renderWithWrappers(
      <CityEventPartnerSaveControl
        id="profile-node-id"
        internalID="profile-internal-id"
        isFollowed={false}
        name="White Cube"
      />
    )
    fireEvent.press(screen.getByLabelText("Save White Cube"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action_name: "galleryFollow",
        action_type: "success",
        owner_type: "Partner",
        owner_id: "profile-internal-id",
      })
    )
  })

  it("tracks a gallery unfollow", () => {
    renderWithWrappers(
      <CityEventPartnerSaveControl
        id="profile-node-id"
        internalID="profile-internal-id"
        isFollowed
        name="White Cube"
      />
    )
    fireEvent.press(screen.getByLabelText("Unsave White Cube"))

    expect(mockTrackEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action_name: "galleryUnfollow",
        action_type: "success",
        owner_type: "Partner",
        owner_id: "profile-internal-id",
      })
    )
  })

  it("supports the labelled button variant", () => {
    renderWithWrappers(
      <CityEventPartnerSaveControl
        id="profile-node-id"
        internalID="profile-internal-id"
        isFollowed={false}
        name="White Cube"
        variant="button"
      />
    )

    expect(screen.getByText("Save")).toBeTruthy()
  })
})
