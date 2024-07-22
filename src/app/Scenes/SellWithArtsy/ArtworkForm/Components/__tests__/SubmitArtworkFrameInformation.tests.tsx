import { useIsFocused, useNavigation } from "@react-navigation/native"
import { fireEvent, screen } from "@testing-library/react-native"
import { SubmitArtworkFrameInformation } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkFrameInformation"
import { renderWithSubmitArtworkWrapper } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/testWrappers"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import relay from "react-relay"

const mockNavigate = jest.fn()
const mockCommitMutation = (fn?: typeof relay.commitMutation) =>
  jest.fn<typeof relay.commitMutation, Parameters<typeof relay.commitMutation>>(fn as any)

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: jest.fn(),
  useIsFocused: jest.fn(),
}))

describe("SubmitArtworkFrameInformation", () => {
  const useNavigationMock = useNavigation as jest.Mock
  const useIsFocusedMock = useIsFocused as jest.Mock

  beforeEach(() => {
    useIsFocusedMock.mockReturnValue(() => true)
    useNavigationMock.mockReturnValue({
      navigate: mockNavigate,
    })
  })

  describe("when the artwork is not framed", () => {
    it("does not render the frame information section", async () => {
      renderWithSubmitArtworkWrapper({
        props: { currentStep: "FrameInformation" },
        component: <SubmitArtworkFrameInformation />,
        injectedFormikProps: {
          artwork: {
            internalID: "some-id",
            isFramed: false,
            framedMetric: null,
            framedWidth: null,
            framedHeight: null,
            framedDepth: null,
          },
        },
      })

      expect(screen.getByText("Is the work framed?")).toBeOnTheScreen()
      expect(screen.queryByText("Height")).not.toBeOnTheScreen()
      expect(screen.queryByText("Width")).not.toBeOnTheScreen()
      expect(screen.queryByText("Depth")).not.toBeOnTheScreen()
      expect(screen.queryByText("in")).not.toBeOnTheScreen()
      expect(screen.queryByText("cm")).not.toBeOnTheScreen()
    })

    it("calls the mutation with the correct values when an artwork is framed", async () => {
      relay.commitMutation = mockCommitMutation((_, { onCompleted }) => {
        onCompleted!(
          {
            updateConsignmentSubmission: {
              consignmentSubmission: {
                internalID: "submission-id",
              },
            },
          },
          null
        )
        return { dispose: jest.fn() }
      }) as any

      renderWithSubmitArtworkWrapper({
        props: { currentStep: "FrameInformation" },
        component: <SubmitArtworkFrameInformation />,
        injectedFormikProps: {
          artwork: {
            internalID: "some-id",
            isFramed: null,
            framedMetric: "cm",
            framedWidth: "20",
            framedHeight: "30",
            framedDepth: "3",
          },
        },
      })

      expect(screen.getByText("Is the work framed?")).toBeOnTheScreen()
      fireEvent(screen.getByText("No"), "onPress")

      fireEvent(screen.getByText("Continue"), "onPress")

      expect(relay.commitMutation).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          variables: {
            input: {
              artworkId: "some-id",
              framedDepth: null,
              framedHeight: null,
              framedMetric: null,
              framedWidth: null,
              isFramed: false,
            },
          },
        })
      )

      await flushPromiseQueue()

      expect(mockNavigate).toHaveBeenCalledWith("AdditionalDocuments")
    })
  })

  describe("when the artwork is framed", () => {
    it("shows the frame information if the artwork is framed", async () => {
      renderWithSubmitArtworkWrapper({
        props: { currentStep: "FrameInformation" },
        component: <SubmitArtworkFrameInformation />,
        injectedFormikProps: {
          artwork: {
            internalID: "some-id",
            isFramed: null,
            framedMetric: "cm",
            framedWidth: "20",
            framedHeight: "30",
            framedDepth: "3",
          },
        },
      })

      fireEvent(screen.getByText("Yes"), "onPress")

      await flushPromiseQueue()

      expect(screen.getByText("Is the work framed?")).toBeOnTheScreen()
      expect(screen.getByDisplayValue("20")).toBeOnTheScreen()
      expect(screen.getByDisplayValue("30")).toBeOnTheScreen()
      expect(screen.getByDisplayValue("3")).toBeOnTheScreen()
      // The metric is rendered 4 times because it's also shown in the Input component
      // As a fixed right placeholder
      expect(screen.queryAllByText("cm")).toHaveLength(4)
    })

    it("calls the mutation with the correct values", async () => {
      relay.commitMutation = mockCommitMutation((_, { onCompleted }) => {
        onCompleted!(
          {
            updateConsignmentSubmission: {
              consignmentSubmission: {
                internalID: "submission-id",
              },
            },
          },
          null
        )
        return { dispose: jest.fn() }
      }) as any

      renderWithSubmitArtworkWrapper({
        props: { currentStep: "FrameInformation" },
        component: <SubmitArtworkFrameInformation />,
        injectedFormikProps: {
          artwork: {
            internalID: "some-id",
            isFramed: null,
            framedMetric: null,
            framedWidth: null,
            framedHeight: null,
            framedDepth: null,
          },
        },
      })

      expect(screen.getByText("Is the work framed?")).toBeOnTheScreen()
      fireEvent(screen.getByText("Yes"), "onPress")

      fireEvent.changeText(screen.getByText("Height"), "40")
      fireEvent.changeText(screen.getByText("Width"), "20")
      fireEvent.changeText(screen.getByText("Depth"), "3")
      fireEvent(screen.getByText("cm"), "onPress")

      await flushPromiseQueue()

      fireEvent(screen.getByText("Continue"), "onPress")

      expect(relay.commitMutation).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          variables: {
            input: {
              artworkId: "some-id",
              framedDepth: "3",
              framedHeight: "40",
              framedMetric: "cm",
              framedWidth: "20",
              isFramed: true,
            },
          },
        })
      )

      await flushPromiseQueue()

      expect(mockNavigate).toHaveBeenCalledWith("AdditionalDocuments")
    })
  })
})
