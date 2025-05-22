import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

import { EmailConfirmationBannerFragmentContainer } from "./EmailConfirmationBanner"

const originalError = console.error

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

  it("does not render a banner when the user's email is already confirmed", () => {
    renderWithRelay({ Me: () => ({ canRequestEmailConfirmation: false }) })

    expect(screen.queryByText("Tap here to verify your email address")).not.toBeOnTheScreen()
  })

  it("renders a banner when the user's email is not confirmed", () => {
    renderWithRelay({ Me: () => ({ canRequestEmailConfirmation: true }) })

    expect(screen.getByText("Tap here to verify your email address")).toBeOnTheScreen()
  })

  it("dismisses the banner when the x button is tapped", () => {
    renderWithRelay({ Me: () => ({ canRequestEmailConfirmation: true }) })

    expect(screen.getByText("Tap here to verify your email address")).toBeOnTheScreen()

    fireEvent.press(screen.getByTestId("closeButton"))

    expect(screen.queryByText("Tap here to verify your email address")).not.toBeOnTheScreen()
  })

  it("shows a message for a loading state after tapping", () => {
    renderWithRelay({ Me: () => ({ canRequestEmailConfirmation: true }) })

    expect(screen.getByText("Tap here to verify your email address")).toBeOnTheScreen()

    fireEvent.press(screen.getByTestId("confirmEmailButton"))

    expect(screen.getByText("Sending a confirmation email...")).toBeOnTheScreen()
  })

  it("shows a successful message when the request is successful", async () => {
    const { mockResolveLastOperation } = renderWithRelay({
      Me: () => ({ canRequestEmailConfirmation: true }),
    })

    fireEvent.press(screen.getByTestId("confirmEmailButton"))

    mockResolveLastOperation({
      SendConfirmationEmailMutationSuccess: () => ({
        unconfirmedEmail: "i.am.unconfirmed@gmail.com",
      }),
    })

    await waitFor(() => {
      expect(screen.getByText("Email sent to i.am.unconfirmed@gmail.com")).toBeOnTheScreen()
    })
  })

  it("shows an error message when the email is already confirmed", async () => {
    const { env } = renderWithRelay({
      Me: () => ({ canRequestEmailConfirmation: true }),
    })

    fireEvent.press(screen.getByTestId("confirmEmailButton"))

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

    await waitFor(() => {
      expect(screen.getByText("Your email is already confirmed")).toBeOnTheScreen()
    })
  })

  it("shows an error message when an error is thrown after tapping", async () => {
    console.error = jest.fn()

    const { mockRejectLastOperation } = renderWithRelay({
      Me: () => ({ canRequestEmailConfirmation: true }),
    })

    fireEvent.press(screen.getByTestId("confirmEmailButton"))

    mockRejectLastOperation(new Error("failed to fetch"))

    await waitFor(() => {
      expect(screen.getByText("Something went wrong. Try again?")).toBeOnTheScreen()
    })
  })
})
