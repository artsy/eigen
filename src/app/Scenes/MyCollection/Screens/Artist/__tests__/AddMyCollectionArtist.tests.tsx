import { fireEvent, screen } from "@testing-library/react-native"
import { AddMyCollectionArtist } from "app/Scenes/MyCollection/Screens/Artist/AddMyCollectionArtist"
import { ArtworkFormScreen } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native")
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
    useIsFocused: () => true,
    useRoute: () => {
      const props: ArtworkFormScreen["AddMyCollectionArtist"] = {
        onSubmit: jest.fn(),
        artistDisplayName: "",
      }
      return {
        params: {
          props,
        },
      }
    },
  }
})

describe("AddMyCollectionArtist", () => {
  const TestRenderer = () => <AddMyCollectionArtist />

  it("renders the form with the right name", () => {
    renderWithWrappers(<TestRenderer />)

    expect(screen.getByText("Add New Artist")).toBeTruthy()

    const nameInput = screen.getByTestId("artist-input")
    const nationalityInpur = screen.getByTestId("nationality-input")
    const birthYearInput = screen.getByTestId("birth-year-input")
    const deathYearInput = screen.getByTestId("death-year-input")

    expect(nameInput).toBeTruthy()
    expect(nationalityInpur).toBeTruthy()
    expect(birthYearInput).toBeTruthy()
    expect(deathYearInput).toBeTruthy()

    expect(nameInput).toHaveProp("value", "")
    expect(nationalityInpur).toHaveProp("value", "")
    expect(birthYearInput).toHaveProp("value", "")
    expect(deathYearInput).toHaveProp("value", "")

    const submitButton = screen.getByTestId("submit-add-artist-button")

    expect(submitButton).toBeDisabled()
  })

  it("displays error message for name", async () => {
    renderWithWrappers(<TestRenderer />)

    const nameInput = screen.getByTestId("artist-input")

    fireEvent.changeText(nameInput, "Artist Name")
    await flushPromiseQueue()
    expect(nameInput).toHaveProp("value", "Artist Name")

    fireEvent.changeText(nameInput, "")
    await flushPromiseQueue()
    expect(nameInput).toHaveProp("value", "")

    expect(screen.getByText("Name field is required")).toBeTruthy()
  })

  it("can successfully create a new artist", async () => {
    renderWithWrappers(<TestRenderer />)

    const submitButton = screen.getByText("Add Artist")
    expect(submitButton).toBeTruthy()

    const nameInput = screen.getByTestId("artist-input")
    expect(nameInput).toHaveProp("value", "")

    fireEvent.changeText(nameInput, "Artist Name")

    await flushPromiseQueue()

    expect(submitButton).not.toBeDisabled()

    fireEvent.press(screen.getByTestId("submit-add-artist-button"))

    // TODO: add tests later
  })
})
