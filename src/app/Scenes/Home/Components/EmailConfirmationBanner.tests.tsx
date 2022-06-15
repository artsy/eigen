import { Sans } from "palette"
import React from "react"
import { TouchableWithoutFeedback } from "react-native"
import { graphql, QueryRenderer } from "react-relay"
import { ReactTestRenderer } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"

import { EmailConfirmationBanner_me$data } from "__generated__/EmailConfirmationBanner_me.graphql"
import { EmailConfirmationBannerTestsQuery } from "__generated__/EmailConfirmationBannerTestsQuery.graphql"
import { flushPromiseQueue } from "app/tests/flushPromiseQueue"
import { renderWithWrappers } from "app/tests/renderWithWrappers"
import { CleanRelayFragment } from "app/utils/relayHelpers"
import { EmailConfirmationBannerFragmentContainer } from "./EmailConfirmationBanner"

jest.unmock("react-relay")
const originalError = console.error

describe("EmailConfirmationBanner", () => {
  let env: ReturnType<typeof createMockEnvironment>

  const TestRenderer = () => (
    <QueryRenderer<EmailConfirmationBannerTestsQuery>
      environment={env}
      query={graphql`
        query EmailConfirmationBannerTestsQuery @raw_response_type {
          me {
            ...EmailConfirmationBanner_me
          }
        }
      `}
      variables={{}}
      render={({ props, error }) => {
        if (props) {
          return <EmailConfirmationBannerFragmentContainer {...(props as any)} />
        } else if (error) {
          console.log(error)
        }
      }}
    />
  )

  const mount = (data: { me: CleanRelayFragment<EmailConfirmationBanner_me$data> }) => {
    const component = renderWithWrappers(<TestRenderer />)
    env.mock.resolveMostRecentOperation({ data, errors: [] })
    return component
  }

  const extractText = (component: ReactTestRenderer) => {
    return component.root.findByType(Sans).props.children
  }

  const getSubmitButton = (component: ReactTestRenderer) => {
    return component.root.findAllByType(TouchableWithoutFeedback)[0]
  }

  const getCloseButton = (component: ReactTestRenderer) => {
    return component.root.findAllByType(TouchableWithoutFeedback)[1]
  }

  beforeEach(() => {
    env = createMockEnvironment()
  })

  afterEach(() => {
    console.error = originalError
  })

  it("does not render a banner when the user's email is already confirmed", () => {
    const component = mount({ me: { canRequestEmailConfirmation: false } })

    expect(component.toJSON()).toBeNull()
  })

  it("renders a banner when the user's email is not confirmed", () => {
    const component = mount({ me: { canRequestEmailConfirmation: true } })

    expect(extractText(component)).toEqual("Tap here to verify your email address")
  })

  it("dismisses the banner when the x button is tapped", () => {
    const component = mount({ me: { canRequestEmailConfirmation: true } })

    getCloseButton(component).props.onPress()

    expect(component.toJSON()).toBeNull()
  })

  it("shows a message for a loading state after tapping", async () => {
    const component = mount({ me: { canRequestEmailConfirmation: true } })

    getSubmitButton(component).props.onPress()

    expect(extractText(component)).toEqual("Sending a confirmation email...")
  })

  it("shows a successful message when the request is successful", async () => {
    const component = mount({ me: { canRequestEmailConfirmation: true } })

    getSubmitButton(component).props.onPress()

    env.mock.resolveMostRecentOperation({
      data: {
        sendConfirmationEmail: {
          confirmationOrError: {
            __typename: "SendConfirmationEmailMutationSuccess",
            unconfirmedEmail: "i.am.unconfirmed@gmail.com",
          },
        },
      },
      errors: [],
    })

    await flushPromiseQueue()

    expect(extractText(component)).toEqual("Email sent to i.am.unconfirmed@gmail.com")
  })

  it("should not be clickable after a successful response", async () => {
    const component = mount({ me: { canRequestEmailConfirmation: true } })

    getSubmitButton(component).props.onPress()

    env.mock.resolveMostRecentOperation({
      data: {
        sendConfirmationEmail: {
          confirmationOrError: {
            __typename: "SendConfirmationEmailMutationSuccess",
            unconfirmedEmail: "i.am.unconfirmed@gmail.com",
          },
        },
      },
      errors: [],
    })

    await flushPromiseQueue()

    expect(getSubmitButton(component).props.onPress).toBeUndefined()
  })

  it("shows an error message when the email is already confirmed", async () => {
    const component = mount({ me: { canRequestEmailConfirmation: true } })

    getSubmitButton(component).props.onPress()

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

    await flushPromiseQueue()
    expect(extractText(component)).toEqual("Your email is already confirmed")
    expect(getSubmitButton(component).props.onPress).toBeUndefined()
  })

  it("shows an error message when an error is thrown after tapping", async () => {
    console.error = jest.fn()

    const component = mount({ me: { canRequestEmailConfirmation: true } })

    getSubmitButton(component).props.onPress()

    env.mock.rejectMostRecentOperation(new Error("failed to fetch"))

    await flushPromiseQueue()
    expect(extractText(component)).toEqual("Something went wrong. Try again?")
    expect(getSubmitButton(component).props.onPress).toBeDefined()
  })
})
