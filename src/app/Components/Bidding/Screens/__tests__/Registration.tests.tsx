import { createToken } from "@stripe/stripe-react-native"
import { act, fireEvent, screen, waitFor } from "@testing-library/react-native"
import { Registration_me$data } from "__generated__/Registration_me.graphql"
import { Registration_sale$data } from "__generated__/Registration_sale.graphql"
import { Registration } from "app/Components/Bidding/Screens/Registration"
import { RegistrationStatus } from "app/Components/Bidding/Screens/RegistrationResult"
import { Address } from "app/Components/Bidding/types"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { navigate } from "app/system/navigation/navigate"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import relay from "react-relay"
import { Disposable, MutationConfig, MutationParameters } from "relay-runtime"

const commitMutationMock = (
  fn?: (environment: any, config: MutationConfig<MutationParameters>) => Disposable | null
) => jest.fn(fn)

afterEach(() => {
  jest.clearAllMocks()
})

jest.mock("@stripe/stripe-react-native", () => ({
  createToken: jest.fn(),
}))

const mockNavigator = { navigate: jest.fn() }

const mockPostNotificationName = LegacyNativeModules.ARNotificationsManager.postNotificationName

it("renders properly for a user without a credit card", async () => {
  await renderWithWrappers(<Registration {...initialPropsForUserWithoutCreditCardOrPhone} />)

  expect(screen.getByText("A valid credit card is required.")).toBeOnTheScreen()
})

describe("User does not have a valid phone number", () => {
  it("renders properly for a user without a phone number", async () => {
    await renderWithWrappers(<Registration {...initialPropsForUserWithoutPhone} />)

    expect(screen.getByText("A valid phone number is required.")).toBeOnTheScreen()
  })
})

it("renders properly for a user with a credit card and phone", async () => {
  await renderWithWrappers(<Registration {...initialPropsForUserWithCreditCardAndPhone} />)

  expect(
    screen.getByText(
      "To complete your registration, please confirm that you agree to the Conditions of Sale."
    )
  ).toBeOnTheScreen()
})

it("renders properly for a verified user with a credit card and phone", async () => {
  await renderWithWrappers(
    <Registration
      {...initialProps}
      sale={{ ...sale, requireIdentityVerification: true }}
      me={{
        hasCreditCards: true,
        isIdentityVerified: true,
        phoneNumber: { isValid: true },
      }}
    />
  )

  expect(
    screen.getByText(
      "To complete your registration, please confirm that you agree to the Conditions of Sale."
    )
  ).toBeOnTheScreen()
  expect(screen.queryByText("valid phone number")).not.toBeOnTheScreen()
  expect(screen.queryByText("valid credit card")).not.toBeOnTheScreen()
})

it("shows the credit card form when the user tap the edit text in the credit card row", async () => {
  await renderWithWrappers(<Registration {...initialPropsForUserWithoutCreditCardOrPhone} />)

  await fireEvent.press(screen.getByText("Credit card"))

  expect(mockNavigator.navigate).toHaveBeenCalledWith("CreditCardForm", {
    billingAddress: null,
    onSubmit: expect.any(Function),
  })
})

it("shows the option for entering payment information if the user does not have a credit card on file", async () => {
  await renderWithWrappers(<Registration {...initialPropsForUserWithoutCreditCardOrPhone} />)

  expect(screen.getAllByRole("checkbox")).toHaveLength(1)
  expect(screen.getAllByText("Credit card")).toHaveLength(1)
})

it("shows no option for entering payment information if the user has a credit card on file", async () => {
  await renderWithWrappers(<Registration {...initialPropsForUserWithCreditCardAndPhone} />)

  expect(screen.getAllByRole("checkbox")).toHaveLength(1)
  expect(screen.queryAllByText("Credit card")).toHaveLength(0)
})

describe("when the sale requires identity verification", () => {
  const propsWithIDVSale = {
    ...initialProps,
    sale: {
      ...sale,
      requireIdentityVerification: true,
    },
  }

  it("displays information about IDV if the user is not verified", async () => {
    await renderWithWrappers(
      <Registration {...propsWithIDVSale} me={{ ...me, isIdentityVerified: false } as any} />
    )

    expect(
      screen.getByText("This auction requires Artsy to verify your identity before bidding.")
    ).toBeOnTheScreen()
  })

  it("does not display information about IDV if the user is verified", async () => {
    await renderWithWrappers(
      <Registration {...propsWithIDVSale} me={{ ...me, isIdentityVerified: true } as any} />
    )

    expect(
      screen.queryByText("This auction requires Artsy to verify your identity before bidding.")
    ).not.toBeOnTheScreen()
  })
})

/**
 * Adds a credit card the same way the user would: by tapping the credit card row and
 * submitting the credit card form that gets pushed onto the navigator.
 */
const addCreditCard = async (
  token: any,
  address: Partial<Address> = billingAddress,
  navigator: { navigate: jest.Mock } = mockNavigator
) => {
  await fireEvent.press(screen.getByText("Credit card"))

  const [, { onSubmit }] = navigator.navigate.mock.calls[navigator.navigate.mock.calls.length - 1]

  await act(() => {
    onSubmit(token, address)
  })
}

const pressRegisterButton = async () => {
  await fireEvent.press(screen.getByTestId("register-button"))
}

describe("when pressing register button", () => {
  beforeEach(() => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AREnableEnrichedMarkdown: false })
  })

  it("when a credit card needs to be added, it commits two mutations on button press", async () => {
    relay.commitMutation = commitMutationMock()
      .mockImplementationOnce((_, { onCompleted }) => {
        onCompleted?.(mockRequestResponses.updateMyUserProfile, null)
        return null
      })
      .mockImplementationOnce((_, { onCompleted }) => {
        onCompleted?.(mockRequestResponses.creatingCreditCardSuccess, null)
        return null
      })
      .mockImplementationOnce((_, { onCompleted }) => {
        onCompleted?.(mockRequestResponses.qualifiedBidder, null)
        return null
      }) as any
    ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)

    await renderWithWrappers(<Registration {...initialPropsForUserWithoutCreditCardOrPhone} />)

    await addCreditCard(stripeToken.token)
    await fireEvent.press(screen.getByRole("checkbox"))

    await pressRegisterButton()

    await waitFor(() => expect(relay.commitMutation).toHaveBeenCalledTimes(3))

    expect(relay.commitMutation).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        variables: {
          input: {
            phone: "111 222 333",
          },
        },
      })
    )

    expect(relay.commitMutation).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        variables: {
          input: {
            token: "fake-token",
          },
        },
      })
    )

    expect(relay.commitMutation).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        variables: {
          input: {
            saleID: sale.slug,
          },
        },
      })
    )
  })

  it("when there is a credit card on file, it commits mutation", async () => {
    relay.commitMutation = jest.fn()
    await renderWithWrappers(<Registration {...initialPropsForUserWithCreditCardAndPhone} />)

    await fireEvent.press(screen.getByRole("checkbox"))
    await pressRegisterButton()

    await waitFor(() => expect(relay.commitMutation).toHaveBeenCalled())
  })

  it("disables tap events while a spinner is being shown", async () => {
    const navigator = { navigate: jest.fn() } as any
    relay.commitMutation = jest.fn()

    await renderWithWrappers(
      <Registration {...initialPropsForUserWithoutCreditCardOrPhone} navigation={navigator} />
    )

    await addCreditCard(stripeToken, billingAddress, navigator)
    await fireEvent.press(screen.getByRole("checkbox"))
    navigator.navigate.mockClear()

    await pressRegisterButton()

    await fireEvent.press(screen.getByText("Credit card"))

    expect(navigator.navigate).not.toHaveBeenCalled()
    expect(mockNavigator.navigate).not.toHaveBeenCalled()

    await fireEvent.press(screen.getByText("General Terms and Conditions of Sale"))

    expect(navigate).not.toHaveBeenCalled()
    expect(screen.getByRole("checkbox")).toBeDisabled()
  })

  it("displays the default error message if there are unhandled errors from the updateUserProfile mutation", async () => {
    const errors = [{ message: "malformed error" }]

    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      onCompleted?.({}, errors)
      return null
    }) as any

    await renderWithWrappers(<Registration {...initialPropsForUserWithoutCreditCardOrPhone} />)

    await addCreditCard(stripeToken)
    await fireEvent.press(screen.getByRole("checkbox"))

    await pressRegisterButton()

    expect(
      await screen.findByText("There was a problem processing your phone number, please try again.")
    ).toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Ok"))

    // it dismisses the modal
    expect(
      screen.queryByText("There was a problem processing your phone number, please try again.")
    ).not.toBeOnTheScreen()
  })

  it("displays an error message on a updateUserProfile failure", async () => {
    const errors = [{ message: "There was an error with your request" }]
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      onCompleted?.({}, errors)
      return null
    }) as any

    await renderWithWrappers(<Registration {...initialPropsForUserWithoutCreditCardOrPhone} />)

    await addCreditCard(stripeToken)
    await fireEvent.press(screen.getByRole("checkbox"))

    await pressRegisterButton()

    expect(
      await screen.findByText("There was a problem processing your phone number, please try again.")
    ).toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Ok"))

    expect(
      screen.queryByText("There was a problem processing your phone number, please try again.")
    ).not.toBeOnTheScreen()
  })

  it("displays an error message on a updateUserProfile mutation network failure", async () => {
    relay.commitMutation = jest
      .fn()
      .mockImplementationOnce((_, { onError }) => onError(new TypeError("Network request failed")))

    await renderWithWrappers(<Registration {...initialPropsForUserWithoutCreditCardOrPhone} />)

    await addCreditCard(stripeToken)
    await fireEvent.press(screen.getByRole("checkbox"))

    await pressRegisterButton()

    expect(
      await screen.findByText("There was a problem processing your phone number, please try again.")
    ).toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Ok"))

    expect(
      screen.queryByText("There was a problem processing your phone number, please try again.")
    ).not.toBeOnTheScreen()
  })

  it("displays an error message on a creditCardMutation failure", async () => {
    await renderWithWrappers(<Registration {...initialPropsForUserWithoutCreditCardOrPhone} />)
    console.error = jest.fn() // Silences component logging.
    ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)
    relay.commitMutation = commitMutationMock()
      .mockImplementationOnce((_, { onCompleted }) => {
        onCompleted?.(mockRequestResponses.updateMyUserProfile, null)
        return null
      })
      .mockImplementationOnce((_, { onCompleted }) => {
        onCompleted?.(mockRequestResponses.creatingCreditCardError, null)
        return null
      }) as any

    await addCreditCard(stripeToken)

    // Check the checkbox and press the Register button
    await fireEvent.press(screen.getByRole("checkbox"))
    await fireEvent.press(screen.getByTestId("register-button"))

    // Wait for the error modal to be displayed
    await screen.findByText("Your card's security code is incorrect.")

    // press the dismiss modal button
    await fireEvent.press(screen.getByText("Ok"))

    // error modal is dismissed
    expect(screen.queryByText("Your card's security code is incorrect.")).not.toBeOnTheScreen()
  })

  it("displays the default error message if there are unhandled errors from the createCreditCard mutation", async () => {
    await renderWithWrappers(<Registration {...initialPropsForUserWithoutCreditCardOrPhone} />)

    const errors = [{ message: "malformed error" }]

    console.error = jest.fn() // Silences component logging.
    ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)

    relay.commitMutation = commitMutationMock()
      .mockImplementationOnce((_, { onCompleted }) => {
        onCompleted?.(mockRequestResponses.updateMyUserProfile, null)
        return null
      })
      .mockImplementationOnce((_, { onCompleted }) => {
        onCompleted?.({}, errors)
        return null
      }) as any

    await addCreditCard(stripeToken)

    // Check the checkbox and press the Register button
    await fireEvent.press(screen.getByRole("checkbox"))
    await fireEvent.press(screen.getByTestId("register-button"))

    // Wait for the error modal to be displayed
    await screen.findByText(
      "There was a problem processing your information. Check your payment details and try again."
    )

    // press the dismiss modal button
    await fireEvent.press(screen.getByText("Ok"))

    // error modal is dismissed
    expect(
      screen.queryByText(
        "There was a problem processing your information. Check your payment details and try again."
      )
    ).not.toBeOnTheScreen()
  })

  it("displays an error message on a createCreditCard mutation network failure", async () => {
    await renderWithWrappers(<Registration {...initialPropsForUserWithoutCreditCardOrPhone} />)
    console.error = jest.fn() // Silences component logging.
    ;(createToken as jest.Mock).mockReturnValueOnce(stripeToken)
    relay.commitMutation = commitMutationMock()
      .mockImplementationOnce((_, { onCompleted }) => {
        onCompleted?.(mockRequestResponses.creatingCreditCardSuccess, null)
        return null
      })
      .mockImplementationOnce((_, { onError }) => {
        onError?.(new TypeError("Network request failed"))
        return null
      }) as any

    await addCreditCard(stripeToken)

    // Check the checkbox and press the Register button
    await fireEvent.press(screen.getByRole("checkbox"))
    await fireEvent.press(screen.getByTestId("register-button"))

    // Wait for the error modal to be displayed
    await screen.findByText(
      "There was a problem processing your information. Check your payment details and try again."
    )

    // press the dismiss modal button
    await fireEvent.press(screen.getByText("Ok"))

    // error modal is dismissed
    expect(
      screen.queryByText(
        "There was a problem processing your information. Check your payment details and try again."
      )
    ).not.toBeOnTheScreen()
  })

  it("displays an error message on a bidderMutation failure", async () => {
    const error = {
      message:
        'https://stagingapi.artsy.net/api/v1/bidder?sale_id=leclere-impressionist-and-modern-art - {"error":"Invalid Sale"}',
    }

    relay.commitMutation = jest
      .fn()
      .mockImplementation((_, { onCompleted }) => onCompleted({}, [error]))

    await renderWithWrappers(<Registration {...initialPropsForUserWithCreditCardAndPhone} />)

    await fireEvent.press(screen.getByRole("checkbox"))
    await pressRegisterButton()

    expect(
      await screen.findByText(
        "There was a problem processing your information. Check your payment details and try again."
      )
    ).toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Ok"))

    expect(
      screen.queryByText(
        "There was a problem processing your information. Check your payment details and try again."
      )
    ).not.toBeOnTheScreen()
  })

  it("displays an error message on a network failure", async () => {
    relay.commitMutation = commitMutationMock((_, { onError }) => {
      onError?.(new TypeError("Network request failed"))
      return null
    }) as any

    await renderWithWrappers(<Registration {...initialPropsForUserWithCreditCardAndPhone} />)

    await fireEvent.press(screen.getByRole("checkbox"))
    await pressRegisterButton()

    expect(
      await screen.findByText(
        "There was a problem processing your information. Check your payment details and try again."
      )
    ).toBeOnTheScreen()

    await fireEvent.press(screen.getByText("Ok"))

    expect(
      screen.queryByText(
        "There was a problem processing your information. Check your payment details and try again."
      )
    ).not.toBeOnTheScreen()
  })

  it("displays the pending result when the bidder is not qualified_for_bidding", async () => {
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      onCompleted?.({ createBidder: { bidder: { qualified_for_bidding: false } } }, null)
      return null
    }) as any

    await renderWithWrappers(<Registration {...initialPropsForUserWithCreditCardAndPhone} />)

    await fireEvent.press(screen.getByRole("checkbox"))
    await pressRegisterButton()

    await waitFor(() => expect(mockNavigator.navigate).toHaveBeenCalled())

    expect(mockPostNotificationName).toHaveBeenCalledWith("ARAuctionArtworkRegistrationUpdated", {
      ARAuctionID: "sale-id",
    })

    expect(mockNavigator.navigate).toHaveBeenCalledWith("RegistrationResult", {
      status: RegistrationStatus.RegistrationStatusPending,
      needsIdentityVerification: false,
    })
  })

  it("displays the pending result with needsIdentityVerification: true when the sale requires identity verification", async () => {
    const propsWithIDVSale = {
      ...initialPropsForUserWithCreditCardAndPhone,
      sale: {
        ...sale,
        requireIdentityVerification: true,
      },
    }
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      onCompleted?.({ createBidder: { bidder: { qualified_for_bidding: false } } }, null)
      return null
    }) as any

    await renderWithWrappers(<Registration {...propsWithIDVSale} />)

    await fireEvent.press(screen.getByRole("checkbox"))
    await pressRegisterButton()

    await waitFor(() =>
      expect(mockNavigator.navigate).toHaveBeenCalledWith("RegistrationResult", expect.anything())
    )
    expect(mockNavigator.navigate).toHaveBeenCalledWith("RegistrationResult", {
      status: RegistrationStatus.RegistrationStatusPending,
      needsIdentityVerification: true,
    })
  })

  it("displays the completed result when the bidder is qualified_for_bidding", async () => {
    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      onCompleted?.({ createBidder: { bidder: { qualified_for_bidding: true } } }, null)
      return null
    }) as any

    await renderWithWrappers(<Registration {...initialPropsForUserWithCreditCardAndPhone} />)

    await fireEvent.press(screen.getByRole("checkbox"))
    await pressRegisterButton()

    await waitFor(() => expect(mockNavigator.navigate).toHaveBeenCalled())

    expect(mockPostNotificationName).toHaveBeenCalledWith("ARAuctionArtworkRegistrationUpdated", {
      ARAuctionID: "sale-id",
    })

    expect(mockNavigator.navigate).toHaveBeenCalledWith("RegistrationResult", {
      status: RegistrationStatus.RegistrationStatusComplete,
      needsIdentityVerification: false,
    })
  })

  it("displays the completed result when the bidder is not verified but qualified for bidding", async () => {
    const propsWithIDVSale = {
      ...initialPropsForUserWithCreditCardAndPhone,
      sale: {
        ...sale,
        requireIdentityVerification: true,
      },
    }

    relay.commitMutation = commitMutationMock((_, { onCompleted }) => {
      onCompleted?.({ createBidder: { bidder: { qualified_for_bidding: true } } }, null)
      return null
    }) as any

    await renderWithWrappers(<Registration {...propsWithIDVSale} />)

    await fireEvent.press(screen.getByRole("checkbox"))
    await pressRegisterButton()

    await waitFor(() =>
      expect(mockNavigator.navigate).toHaveBeenCalledWith("RegistrationResult", expect.anything())
    )
    expect(mockNavigator.navigate).toHaveBeenCalledWith("RegistrationResult", {
      needsIdentityVerification: true,
      status: RegistrationStatus.RegistrationStatusComplete,
    })
  })
})

it("shows a checkbox for agreeing to the conditions of sale", async () => {
  await renderWithWrappers(<Registration {...initialPropsForUserWithCreditCardAndPhone} />)

  expect(
    screen.getByText(
      "I agree to Artsy's General Terms and Conditions of Sale. I understand that all bids are binding and may not be retracted."
    )
  ).toBeOnTheScreen()
})

it("navigates to the terms when the user taps the link", async () => {
  jest.mock("app/system/navigation/navigate", () => ({
    ...jest.requireActual("app/system/navigation/navigate"),
    navigate: jest.fn(),
  }))

  await renderWithWrappers(<Registration {...initialPropsForUserWithCreditCardAndPhone} />)

  await fireEvent.press(screen.getByText("General Terms and Conditions of Sale"))

  expect(navigate).toHaveBeenCalledWith("/terms")
})

const billingAddress: Partial<Address> = {
  fullName: "Yuki Stockmeier",
  addressLine1: "401 Broadway",
  addressLine2: "25th floor",
  city: "New York",
  state: "NY",
  postalCode: "10013",
  phoneNumber: "111 222 333",
  country: {
    longName: "United States",
    shortName: "US",
  },
}

const stripeToken = {
  token: {
    id: "fake-token",
    created: "1528229731",
    livemode: 0,
    card: {
      brand: "VISA",
      last4: "4242",
    },
    bankAccount: null,
    extra: null,
  },
}

const sale: Partial<Registration_sale$data> = {
  slug: "sale-id",
  liveStartAt: "2029-06-11T01:00:00+00:00",
  endAt: null,
  name: "Phillips New Now",
  startAt: "2018-06-11T01:00:00+00:00",
  isPreview: true,
  requireIdentityVerification: false,
}

const mockRequestResponses = {
  updateMyUserProfile: {
    updateMyUserProfile: {
      user: {
        phone: "111 222 4444",
      },
    },
  },
  qualifiedBidder: {
    createBidder: {
      bidder: {
        qualified_for_bidding: true,
      },
    },
  },
  creatingCreditCardSuccess: {
    createCreditCard: {
      creditCardOrError: {
        creditCard: {
          id: "new-credit-card",
        },
      },
    },
  },
  creatingCreditCardError: {
    createCreditCard: {
      creditCardOrError: {
        mutationError: {
          detail: "Your card's security code is incorrect.",
          message: "Payment information could not be processed.",
          type: "payment_error",
        },
      },
    },
  },
}

const initialProps = {
  sale,
  relay: { environment: null },
  navigation: mockNavigator,
} as any

const me: Partial<Registration_me$data> = {
  hasCreditCards: false,
  isIdentityVerified: false,
  phoneNumber: {
    isValid: false,
    display: null,
  },
}

const initialPropsForUserWithCreditCardAndPhone = {
  ...initialProps,
  me: {
    ...me,
    hasCreditCards: true,
    phoneNumber: {
      isValid: true,
    },
  },
} as any

const initialPropsForUserWithoutPhone = {
  ...initialPropsForUserWithCreditCardAndPhone,
  me: {
    ...me,
    hasCreditCards: true,
    phoneNumber: { isValid: false },
  },
}

const initialPropsForUserWithoutCreditCardOrPhone = { ...initialProps, me } as any
