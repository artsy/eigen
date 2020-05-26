import { Theme } from "@artsy/palette"
import React from "react"
import { graphql } from "react-relay"

import { EmailConfirmationBannerTestsQuery } from "__generated__/EmailConfirmationBannerTestsQuery.graphql"
import { renderRelayTree } from "lib/tests/renderRelayTree"

import { TouchableWithoutFeedback } from "react-native"
import { EmailConfirmationBannerFragmentContainer as EmailConfirmationBanner } from "../EmailConfirmationBanner"

jest.unmock("react-relay")
const originalError = console.error

describe("EmailConfirmationBanner", () => {
  const getWrapper = async ({ mockData, mockMutationResults }: any) => {
    return await renderRelayTree({
      Component: (props: any) => {
        return (
          <Theme>
            <EmailConfirmationBanner {...props} />
          </Theme>
        )
      },
      query: graphql`
        query EmailConfirmationBannerTestsQuery @raw_response_type {
          me {
            ...EmailConfirmationBanner_me
          }
        }
      `,
      mockData: mockData as EmailConfirmationBannerTestsQuery,
      mockMutationResults,
    })
  }

  afterEach(() => {
    console.error = originalError
  })

  it("does not render a banner when the user's email is already confirmed", async () => {
    const component = await getWrapper({ mockData: { me: { canRequestEmailConfirmation: false } } })

    expect(component.text()).toBeNull()
  })

  it("renders a banner when the user's email is not confirmed", async () => {
    const component = await getWrapper({ mockData: { me: { canRequestEmailConfirmation: true } } })

    expect(component.text()).toEqual("Tap here to verify your email address")
  })

  it("dismisses the banner when the x button is tapped", async () => {
    const component = await getWrapper({ mockData: { me: { canRequestEmailConfirmation: true } } })

    await component
      .find(TouchableWithoutFeedback)
      .at(1)
      .props()
      .onPress()

    expect(component.text()).toBeNull()
  })

  it("shows a message for a loading state after tapping", async () => {
    const component = await getWrapper({
      mockData: {
        me: {
          canRequestEmailConfirmation: true,
        },
      },
      mockMutationResults: {
        sendConfirmationEmail: {
          confirmationOrError: {
            __typename: "SendConfirmationEmailMutationSuccess",
            unconfirmedEmail: "i.am.unconfirmed@gmail.com",
          },
        },
      },
    })

    // Do not use async here so we can test a loading state.
    component
      .find(TouchableWithoutFeedback)
      .at(0)
      .props()
      .onPress()

    expect(component.text()).toEqual("Sending an confirmation email...")
  })

  it("shows a successful message when the request is successful", async () => {
    const component = await getWrapper({
      mockData: {
        me: {
          canRequestEmailConfirmation: true,
        },
      },
      mockMutationResults: {
        sendConfirmationEmail: {
          confirmationOrError: {
            __typename: "SendConfirmationEmailMutationSuccess",
            unconfirmedEmail: "i.am.unconfirmed@gmail.com",
          },
        },
      },
    })

    await component
      .find(TouchableWithoutFeedback)
      .at(0)
      .props()
      .onPress()

    expect(component.text()).toEqual("Email sent to i.am.unconfirmed@gmail.com")
  })

  it("should not be clickable after a successful response", async () => {
    const component = await getWrapper({
      mockData: {
        me: {
          canRequestEmailConfirmation: true,
        },
      },
      mockMutationResults: {
        sendConfirmationEmail: {
          confirmationOrError: {
            __typename: "SendConfirmationEmailMutationSuccess",
            unconfirmedEmail: "i.am.unconfirmed@gmail.com",
          },
        },
      },
    })

    await component
      .find(TouchableWithoutFeedback)
      .at(0)
      .props()
      .onPress()

    component.update()

    expect(
      component
        .find(TouchableWithoutFeedback)
        .at(0)
        .props().onPress
    ).toBeUndefined()
  })

  it("shows an error message when the email is already confirmed", async () => {
    const component = await getWrapper({
      mockData: {
        me: {
          canRequestEmailConfirmation: true,
        },
      },
      mockMutationResults: {
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
    })

    await component
      .find(TouchableWithoutFeedback)
      .at(0)
      .props()
      .onPress()

    expect(component.text()).toEqual("Your email is already confirmed")

    component.update()

    expect(
      component
        .find(TouchableWithoutFeedback)
        .at(0)
        .props().onPress
    ).toBeUndefined()
  })

  it("shows an error message when an error is thrown after tapping", async () => {
    console.error = jest.fn()

    const component = await getWrapper({
      mockData: {
        me: {
          canRequestEmailConfirmation: true,
        },
      },
      mockMutationResults: {
        sendConfirmationEmail: () => {
          return Promise.reject(new Error("failed to fetch"))
        },
      },
    })

    await component
      .find(TouchableWithoutFeedback)
      .at(0)
      .props()
      .onPress()

    expect(component.text()).toEqual("Something went wrong. Try again?")

    component.update()

    expect(
      component
        .find(TouchableWithoutFeedback)
        .at(0)
        .props().onPress
    ).not.toBeUndefined()
  })
})
