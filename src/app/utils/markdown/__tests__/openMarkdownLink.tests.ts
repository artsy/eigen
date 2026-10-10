import { navigate } from "app/system/navigation/navigate"
import { openMarkdownLink } from "app/utils/markdown/openMarkdownLink"
import { sendEmailWithMailTo } from "app/utils/sendEmail"

jest.mock("app/utils/sendEmail", () => ({ sendEmailWithMailTo: jest.fn() }))

describe("openMarkdownLink", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("navigates to the url", () => {
    openMarkdownLink("/artist/andy-warhol")

    expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol")
  })

  it("navigates modally when specified", () => {
    openMarkdownLink("/artist/andy-warhol", { modal: true })

    expect(navigate).toHaveBeenCalledWith("/artist/andy-warhol", { modal: true })
  })

  it("opens the mail client for mailto links", () => {
    openMarkdownLink("mailto:support@artsy.net", { modal: true })

    expect(sendEmailWithMailTo).toHaveBeenCalledWith("mailto:support@artsy.net")
    expect(navigate).not.toHaveBeenCalled()
  })
})
