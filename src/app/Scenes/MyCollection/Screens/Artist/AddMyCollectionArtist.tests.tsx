import { Route } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { fireEvent } from "@testing-library/react-native"
import { AddMyCollectionArtist } from "app/Scenes/MyCollection/Screens/Artist/AddMyCollectionArtist"
import { ArtworkFormMode } from "app/Scenes/MyCollection/Screens/ArtworkForm/MyCollectionArtworkForm"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("AddMyCollectionArtist", () => {
  const mockNav: Partial<StackNavigationProp<{}>> = {
    addListener: jest.fn(),
  }
  const mockRoute: Route<
    "AddMyCollectionArtist",
    {
      mode: ArtworkFormMode
      clearForm(): void
      onDelete(): void
      onHeaderBackButtonPress(): void
    }
  > = {
    key: "AddMyCollectionArtist",
    name: "AddMyCollectionArtist",
    params: {
      mode: "add",
      clearForm: jest.fn(),
      onDelete: jest.fn(),
      onHeaderBackButtonPress: jest.fn(),
    },
  }

  const TestRenderer = () => <AddMyCollectionArtist navigation={mockNav as any} route={mockRoute} />

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
