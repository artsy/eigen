import { fireEvent } from "@testing-library/react-native"
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
    useRoute: () => {
      const props: ArtworkFormScreen["AddMyCollectionArtist"] = {
        props: {
          onSubmit: jest.fn(),
          artistDisplayName: "",
        },
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
    const { getByText, getByTestId, getByPlaceholderText } = renderWithWrappers(<TestRenderer />)

    expect(getByText("Add New Artist")).toBeTruthy()

    const nameInput = getByPlaceholderText("Artist Name")
    const nationalityInpur = getByPlaceholderText("Nationality")
    const birthYearInput = getByPlaceholderText("Birth Year")
    const deathYearInput = getByPlaceholderText("Death Year")

    expect(nameInput).toBeTruthy()
    expect(nationalityInpur).toBeTruthy()
    expect(birthYearInput).toBeTruthy()
    expect(deathYearInput).toBeTruthy()

    expect(nameInput).toHaveProp("value", "")
    expect(nationalityInpur).toHaveProp("value", "")
    expect(birthYearInput).toHaveProp("value", "")
    expect(deathYearInput).toHaveProp("value", "")

    const submitButton = getByTestId("submit-add-artist-button")

    expect(submitButton).toBeDisabled()
  })

  it("displays error message for name", async () => {
    const { getByText, getByPlaceholderText } = renderWithWrappers(<TestRenderer />)

    const nameInput = getByPlaceholderText("Artist Name")

    fireEvent.changeText(nameInput, "Artist Name")
    await flushPromiseQueue()
    expect(nameInput).toHaveProp("value", "Artist Name")

    fireEvent.changeText(nameInput, "")
    await flushPromiseQueue()
    expect(nameInput).toHaveProp("value", "")

    expect(getByText("Name field is required")).toBeTruthy()
  })

  it("can successfully create a new artist", async () => {
    const { getByPlaceholderText, getByText, getByTestId } = renderWithWrappers(<TestRenderer />)

    const submitButton = getByText("Add Artist")
    expect(submitButton).toBeTruthy()

    const nameInput = getByPlaceholderText("Artist Name")
    expect(nameInput).toHaveProp("value", "")

    fireEvent.changeText(nameInput, "Artist Name")

    await flushPromiseQueue()

    expect(submitButton).not.toBeDisabled()

    fireEvent.press(getByTestId("submit-add-artist-button"))

    // TODO: add tests later
  })
})
