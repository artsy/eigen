import { ContextModule, OwnerType } from "@artsy/cohesion"
import Clipboard from "@react-native-community/clipboard"
import { fireEvent, waitFor } from "@testing-library/react-native"
import { mockTrackEvent } from "app/tests/globallyMockedStuff"
import { renderWithWrappersTL } from "app/tests/renderWithWrappers"
import { useCanOpenURL } from "app/utils/useCanOpenURL"
import React from "react"
import Share from "react-native-share"
import * as helpers from "./helpers"
import { ShareSheet, ShareSheetProps } from "./ShareSheet"

const setVisibleMock = jest.fn()

jest.mock("app/utils/useCanOpenURL")

jest.mock("@react-native-community/clipboard", () => ({
  setString: jest.fn(),
}))

jest.mock("app/Scenes/Artwork/Components/InstagramStoryViewShot", () => ({
  InstagramStoryViewShot: () => null,
}))

jest.mock("react-native-share", () => ({
  Social: {
    INSTAGRAM_STORIES: "instagramstories",
    WHATSAPP: "whatsapp",
  },
  open: () => ({
    message: "shared",
  }),
  shareSingle: jest.fn(),
}))

describe("ShareSheet", () => {
  const useCanOpenURLMock = useCanOpenURL as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const TestWrapper = (props?: Partial<ShareSheetProps>) => {
    return <ShareSheet {...defaultProps} {...props} />
  }

  it('should render "Copy link" item', () => {
    const { getByText } = renderWithWrappersTL(<TestWrapper />)

    expect(getByText("Copy link")).toBeTruthy()
  })

  it('should render "More" item', () => {
    const { getByText } = renderWithWrappersTL(<TestWrapper />)

    expect(getByText("More")).toBeTruthy()
  })

  it('should correctly handle click on "Copy Link" item', () => {
    const { getByText } = renderWithWrappersTL(<TestWrapper />)

    fireEvent.press(getByText("Copy link"))

    expect(setVisibleMock).toBeCalledWith(false)
    expect(Clipboard.setString).toBeCalledWith("https://staging.artsy.net/href")
    expect(mockTrackEvent).toHaveBeenCalledWith({
      action: "share",
      context_module: "contextModule",
      context_owner_type: "ownerType",
      context_owner_id: "internalID",
      context_owner_slug: "slug",
      service: "copy_link",
    })
  })

  it('should correctly handle click on "More" item', async () => {
    const { getByText } = renderWithWrappersTL(<TestWrapper />)

    fireEvent.press(getByText("More"))

    expect(mockTrackEvent).toHaveBeenCalledWith({
      action_name: "share",
      action_type: "tap",
      context_module: "shareSheet",
    })

    await waitFor(() =>
      expect(mockTrackEvent).toHaveBeenCalledWith({
        action: "share",
        context_module: "contextModule",
        context_owner_id: "internalID",
        context_owner_slug: "slug",
        context_owner_type: "ownerType",
        service: "shared",
      })
    )
  })

  describe("Instagram Stories", () => {
    beforeEach(() => {
      useCanOpenURLMock.mockImplementation(() => true)
    })

    it("should hide item if showInstagram props is set to false", async () => {
      const { queryByText } = renderWithWrappersTL(
        <TestWrapper
          entry={{ ...defaultProps.entry, imageURL: "imageURL" }}
          showInstagram={false}
        />
      )

      expect(queryByText("Instagram Stories")).toBeFalsy()
    })

    it("should hide item if imageUrl is not passed in entry prop", async () => {
      const { queryByText } = renderWithWrappersTL(<TestWrapper />)

      expect(queryByText("Instagram Stories")).toBeFalsy()
    })

    it("should show item if imageUrl is passed in entry prop", async () => {
      const { getByText } = renderWithWrappersTL(
        <TestWrapper entry={{ ...defaultProps.entry, imageURL: "imageURL" }} />
      )

      expect(getByText("Instagram Stories")).toBeTruthy()
    })

    it("should correctly handle click on item", async () => {
      jest.spyOn(helpers, "getBase64Data").mockImplementation(() => Promise.resolve("data"))

      const { getByText } = renderWithWrappersTL(
        <TestWrapper entry={{ ...defaultProps.entry, imageURL: "imageURL" }} />
      )

      fireEvent.press(getByText("Instagram Stories"))

      await waitFor(() =>
        expect(Share.shareSingle).toBeCalledWith({
          social: "instagramstories",
          backgroundImage: "data",
        })
      )

      await waitFor(() =>
        expect(mockTrackEvent).toBeCalledWith({
          action: "share",
          context_module: "contextModule",
          context_owner_type: "ownerType",
          context_owner_id: "internalID",
          context_owner_slug: "slug",
          service: "instagram_stories",
        })
      )
    })
  })

  describe("WhatsApp", () => {
    beforeEach(() => {
      useCanOpenURLMock.mockImplementation(() => true)
    })

    it("should hide item if showWhatsapp props is set to false", async () => {
      const { queryByText } = renderWithWrappersTL(<TestWrapper showWhatsapp={false} />)

      expect(queryByText("WhatsApp")).toBeFalsy()
    })

    it("should show item", async () => {
      const { getByText } = renderWithWrappersTL(<TestWrapper />)

      expect(getByText("WhatsApp")).toBeTruthy()
    })

    it("should correctly handle click on item", async () => {
      const { getByText } = renderWithWrappersTL(
        <TestWrapper entry={{ ...defaultProps.entry, imageURL: "imageURL" }} />
      )

      fireEvent.press(getByText("WhatsApp"))

      expect(Share.shareSingle).toBeCalledWith({
        social: "whatsapp",
        message: "Artist One on Artsy",
        url: "https://staging.artsy.net/href",
      })
      await waitFor(() =>
        expect(mockTrackEvent).toBeCalledWith({
          action: "share",
          context_module: "contextModule",
          context_owner_type: "ownerType",
          context_owner_id: "internalID",
          context_owner_slug: "slug",
          service: "whatsapp",
        })
      )
    })
  })
})

const defaultProps: ShareSheetProps = {
  visible: true,
  entry: {
    internalID: "internalID",
    slug: "slug",
    href: "/href",
    artistNames: ["Artist One"],
  },
  componentContextModule: "shareSheet" as ContextModule,
  contextModule: "contextModule" as ContextModule,
  ownerType: "ownerType" as OwnerType,
  setVisible: setVisibleMock,
}
