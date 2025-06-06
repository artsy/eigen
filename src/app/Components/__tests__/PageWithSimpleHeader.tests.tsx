import { screen } from "@testing-library/react-native"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"

describe("PageWithSimpleHeader", () => {
  it("renders with the provided title", () => {
    renderWithWrappers(
      <PageWithSimpleHeader title="Test Title">
        <Text>Page Content</Text>
      </PageWithSimpleHeader>
    )

    expect(screen.getByText("Test Title")).toBeTruthy()
    expect(screen.getByText("Page Content")).toBeTruthy()
  })

  it("renders with left and right components", () => {
    renderWithWrappers(
      <PageWithSimpleHeader
        title="Page Title"
        left={<Text>Left Component</Text>}
        right={<Text>Right Component</Text>}
      >
        <Text>Main Content</Text>
      </PageWithSimpleHeader>
    )

    expect(screen.getByText("Page Title")).toBeTruthy()
    expect(screen.getByText("Left Component")).toBeTruthy()
    expect(screen.getByText("Right Component")).toBeTruthy()
    expect(screen.getByText("Main Content")).toBeTruthy()
  })
})
