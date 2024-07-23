import { useIsFocused, useNavigation } from "@react-navigation/native"
import { fireEvent, screen } from "@testing-library/react-native"
import { SubmitArtworkCondition } from "app/Scenes/SellWithArtsy/ArtworkForm/Components/SubmitArtworkCondition"
import { renderWithSubmitArtworkWrapper } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/testWrappers"
import { SubmissionModel } from "app/Scenes/SellWithArtsy/ArtworkForm/Utils/validation"
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

describe("SubmitArtworkCondition", () => {
  const useNavigationMock = useNavigation as jest.Mock
  const useIsFocusedMock = useIsFocused as jest.Mock

  beforeEach(() => {
    useIsFocusedMock.mockReturnValue(() => true)
    useNavigationMock.mockReturnValue({
      navigate: mockNavigate,
    })
  })

  it("renders the default artwork condition properly", async () => {
    renderWithSubmitArtworkWrapper({
      props: { currentStep: "Condition" },
      component: <SubmitArtworkCondition />,
      injectedFormikProps: {
        artwork: {
          ...defaultArtworkFixutre,
          condition: "FAIR",
          conditionDescription: "Pretty fair",
        },
      },
    })

    expect(screen.getByText("Fair")).toBeOnTheScreen()
    expect(screen.getByDisplayValue("Pretty fair")).toBeOnTheScreen()
  })

  it("calls the mutation with the new condition details", async () => {
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
      props: { currentStep: "Condition" },
      component: <SubmitArtworkCondition />,
      injectedFormikProps: {
        artwork: {
          ...defaultArtworkFixutre,
        },
      },
    })

    const conditionSelect = screen.getByTestId("ConditionSelect")
    fireEvent(conditionSelect, "onPress")

    // Wait for the select modal to show up
    await flushPromiseQueue()
    fireEvent.press(screen.getByText("Fair"))

    // Wait for the select modal to show up
    await flushPromiseQueue()

    // The value is going to be rendered twice because it's also available in the Select component
    expect(screen.getAllByText("Fair")).toHaveLength(2)

    fireEvent(screen.getByText("Add Additional Condition Details"), "onChangeText", "Pretty fair")

    fireEvent(screen.getByText("Continue"), "onPress")

    expect(relay.commitMutation).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        variables: {
          input: { artworkId: "some-id", condition: "FAIR", conditionDescription: "Pretty fair" },
        },
      })
    )

    await flushPromiseQueue()

    expect(mockNavigate).toHaveBeenCalledWith("CompleteYourSubmission")
  })
})

const defaultArtworkFixutre: SubmissionModel["artwork"] = {
  internalID: "some-id",
  framedDepth: null,
  framedHeight: null,
  framedMetric: null,
  framedWidth: null,
  isFramed: null,
  condition: null,
  conditionDescription: null,
}
