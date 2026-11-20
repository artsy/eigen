import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { EmailConfirmationBannerFragmentContainer } from "app/Scenes/HomeView/Components/EmailConfirmationBanner"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"
import { MockPayloadGenerator } from "relay-test-utils"

const originalError = console.error

// While the confirmation mutation is in flight, the `act` inside `fireEvent.press` does not
// settle (React keeps the act scope open until the pending Relay work resolves). So we start
// the press, resolve or reject the mutation with the mock environment, and only then await it.

describe("EmailConfirmationBanner", () => {
  const { renderWithRelay } = setupTestWrapper({
    Component: EmailConfirmationBannerFragmentContainer,
    query: graphql`
      query EmailConfirmationBannerTests2Query @relay_test_operation @raw_response_type {
        me {
          ...EmailConfirmationBanner_me
        }
      }
    `,
  })

  afterAll(() => {
    console.error = originalError
  })

  it("does not render a banner when the user's email is already confirmed", async () => {
    await renderWithRelay({ Me: () => ({ canRequestEmailConfirmation: false }) })

    expect(screen.queryByText("Tap here to verify your email address")).not.toBeOnTheScreen()
  })

  it("renders a banner when the user's email is not confirmed", async () => {
    await renderWithRelay({ Me: () => ({ canRequestEmailConfirmation: true }) })

    expect(screen.getByText("Tap here to verify your email address")).toBeOnTheScreen()
  })

  it("dismisses the banner when the x button is tapped", async () => {
    await renderWithRelay({ Me: () => ({ canRequestEmailConfirmation: true }) })

    expect(screen.getByText("Tap here to verify your email address")).toBeOnTheScreen()

    await fireEvent.press(screen.getByTestId("closeButton"))

    expect(screen.queryByText("Tap here to verify your email address")).not.toBeOnTheScreen()
  })

  it("shows a message for a loading state after tapping", async () => {
    const { env } = await renderWithRelay({ Me: () => ({ canRequestEmailConfirmation: true }) })

    expect(screen.getByText("Tap here to verify your email address")).toBeOnTheScreen()

    const press = fireEvent.press(screen.getByTestId("confirmEmailButton"))

    await waitFor(() => {
      expect(screen.getByText("Sending a confirmation email...")).toBeOnTheScreen()
    })

    env.mock.resolveMostRecentOperation({ data: { sendConfirmationEmail: null } })
    await press
  })

  it("shows a successful message when the request is successful", async () => {
    const { env } = await renderWithRelay({
      Me: () => ({ canRequestEmailConfirmation: true }),
    })

    const press = fireEvent.press(screen.getByTestId("confirmEmailButton"))

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "verifyEmailMutation"
    )
    env.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        SendConfirmationEmailMutationSuccess: () => ({
          unconfirmedEmail: "i.am.unconfirmed@gmail.com",
        }),
      })
    )
    await press

    await waitFor(() => {
      expect(screen.getByText("Email sent to i.am.unconfirmed@gmail.com")).toBeOnTheScreen()
    })
  })

  it("shows an error message when the email is already confirmed", async () => {
    const { env } = await renderWithRelay({
      Me: () => ({ canRequestEmailConfirmation: true }),
    })

    const press = fireEvent.press(screen.getByTestId("confirmEmailButton"))

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "verifyEmailMutation"
    )
    env.mock.resolveMostRecentOperation({
      data: {
        sendConfirmationEmail: {
          confirmationOrError: {
            __typename: "SendConfirmationEmailMutationFailure",
            mutationError: {
              error: null,
              message: "email is already confirmed",
            },
          },
        },
      },
      errors: [],
    })
    await press

    await waitFor(() => {
      expect(screen.getByText("Your email is already confirmed")).toBeOnTheScreen()
    })
  })

  it("shows an error message when an error is thrown after tapping", async () => {
    console.error = jest.fn()

    const { env } = await renderWithRelay({
      Me: () => ({ canRequestEmailConfirmation: true }),
    })

    const press = fireEvent.press(screen.getByTestId("confirmEmailButton"))

    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe(
      "verifyEmailMutation"
    )
    env.mock.rejectMostRecentOperation(new Error("failed to fetch"))
    await press

    await waitFor(() => {
      expect(screen.getByText("Something went wrong. Try again?")).toBeOnTheScreen()
    })
  })
})
