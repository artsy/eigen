import { fireEvent } from "@testing-library/react-native"
import { Field } from "app/Scenes/MyCollection/Screens/Artwork/Components/Field"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("Field", () => {
  it("Value is truncated when truncateLimit is set", () => {
    const { queryByText } = renderWithWrappers(
      <Field label="Test" value={longText} truncateLimit={5} />
    )
    expect(queryByText(longText)).not.toBeOnTheScreen()

    expect(queryByText("Lorem")).toBeOnTheScreen()
  })

  it("Value is NOT truncated when truncateLimit is not given", () => {
    const { queryByText } = renderWithWrappers(<Field label="Test" value={longText} />)
    expect(queryByText(longText)).toBeOnTheScreen()
  })

  it("Read More button is only present if value can be expanded", () => {
    const { queryByText: queryByTextOne } = renderWithWrappers(
      <Field label="Test" value={longText} truncateLimit={longText.length} />
    )
    expect(queryByTextOne("Read More")).not.toBeOnTheScreen()

    const { queryByText: queryByTextTwo } = renderWithWrappers(
      <Field label="Test" value={longText} truncateLimit={longText.length - 20} />
    )
    expect(queryByTextTwo("Read More")).toBeOnTheScreen()
  })

  it('Pressing "Read More" expands the text value', async () => {
    const { findByTestId, queryByText } = renderWithWrappers(
      <Field label="Test" value={longText} truncateLimit={10} />
    )

    expect(queryByText(longText)).not.toBeOnTheScreen()

    const button = await findByTestId("ReadMoreButton")

    fireEvent.press(button)
    expect(queryByText(longText)).toBeOnTheScreen()
  })
})

const longText =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
