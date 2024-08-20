import { useIsFocused, useNavigation } from "@react-navigation/native"
import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { SubmitArtworkAdditionalDocuments } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkAdditionalDocuments"
import { renderWithSubmitArtworkWrapper } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/testWrappers"
import { flushPromiseQueue } from "app/utils/tests/flushPromiseQueue"
import relay from "react-relay"

const mockNavigate = jest.fn()

const mockShowActionSheetWithOptions = jest.fn()

const mockCommitMutation = (fn?: typeof relay.commitMutation) =>
  jest.fn<typeof relay.commitMutation, Parameters<typeof relay.commitMutation>>(fn as any)

jest.mock("app/utils/showDocumentsAndPhotosActionSheet", () => ({
  showDocumentsAndPhotosActionSheet: () => {
    return [
      {
        uri: "file:///path/to/file",
        fileCopyUri: "file:///path/to/file",
        name: "file.pdf",
        type: "document/pdf",
        size: 10 * 1024 * 1024,
      },
    ]
  },
  isDocument: () => true,
}))

jest.mock("app/Scenes/SellWithArtsy/SubmitArtwork/UploadPhotos/utils/uploadDocument", () => ({
  uploadDocument: () => {
    return {
      key: "key",
      bucket: "bucket",
    }
  },
}))

jest.mock("@expo/react-native-action-sheet", () => ({
  useActionSheet: () => ({ showActionSheetWithOptions: mockShowActionSheetWithOptions }),
}))

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: jest.fn(),
  useIsFocused: jest.fn(),
}))

describe("SubmitArtworkAdditionalDocuments", () => {
  const useNavigationMock = useNavigation as jest.Mock
  const useIsFocusedMock = useIsFocused as jest.Mock

  beforeEach(() => {
    useIsFocusedMock.mockReturnValue(() => true)
    useNavigationMock.mockReturnValue({
      navigate: mockNavigate,
    })

    jest.clearAllMocks()
  })

  it("renders the list of uploaded documents", async () => {
    relay.commitMutation = mockCommitMutation((_, { onCompleted }) => {
      onCompleted!(
        {
          addAssetToConsignmentSubmission: {
            asset: {
              id: "asset-id",
              submissionID: "submission-id",
            },
          },
        },
        null
      )
      return { dispose: jest.fn() }
    }) as any

    renderWithSubmitArtworkWrapper({
      props: { currentStep: "AdditionalDocuments" },
      component: <SubmitArtworkAdditionalDocuments />,
      injectedFormikProps: {
        submissionId: "submission-id",
        externalId: "external-id",
        additionalDocuments: [],
      },
    })

    fireEvent.press(screen.getByText("Add Documents"))
    // Wait for the actoin sheet to show up
    await flushPromiseQueue()

    expect(relay.commitMutation).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        variables: {
          input: {
            assetType: "additional_file",
            clientMutationId: "random-client-mutation-id",
            externalSubmissionId: "external-id",
            filename: "file.pdf",
            size: "10485760",
            source: { bucket: "bucket", key: "key" },
            submissionID: "submission-id",
          },
        },
      })
    )

    expect(screen.getByText("file.pdf")).toBeOnTheScreen()
    expect(screen.getByText(/10.00/)).toBeOnTheScreen()

    fireEvent(screen.getByText("Continue"), "onPress")

    await flushPromiseQueue()

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("Condition"))
  })
})
