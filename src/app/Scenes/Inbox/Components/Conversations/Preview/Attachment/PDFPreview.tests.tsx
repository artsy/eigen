import { screen } from "@testing-library/react-native"
import { renderWithRelayWrappers } from "app/tests/renderWithWrappers"

import PDFPreview from "./PDFPreview"

it("renders without throwing an error", () => {
  renderWithRelayWrappers(<PDFPreview attachment={attachment as any} />)

  expect(screen.queryByText("This is a great PDF telling you all about cats")).toBeTruthy()
})

const attachment = {
  id: "cats",
  fileName: "This is a great PDF telling you all about cats",
}
