import { __globalStoreTestUtils__ } from "lib/store/GlobalStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Button } from "palette"
import React from "react"
import { TextInput } from "react-native"
import { TouchableWithoutFeedback } from "react-native"

jest.unmock("react-tracking")
jest.unmock("react-relay")

import Composer from "../Composer"

it("renders without throwing a error", () => {
  renderWithWrappers(<Composer />)
})

describe("regarding the send button", () => {
  it("disables it even if it contains text if the disabled prop is true", () => {
    const overrideText = "History repeats itself, first as tragedy, second as farce."
    // We're using 'dive' here to only fetch the component we want to test
    // This is because the component is wrapped by react-tracking, which changes the tree structure
    const tree = renderWithWrappers(<Composer value={overrideText} disabled={true} />)

    expect(tree.root.findByType(Button).props.disabled).toBeTruthy()
  })

  it("calls onSubmit with the text when send button is pressed", () => {
    const onSubmit = jest.fn()
    // We're using 'dive' here to only fetch the component we want to test
    // This is because the component is wrapped by react-tracking, which changes the tree structure
    const tree = renderWithWrappers(<Composer onSubmit={onSubmit} />)
    const text = "Don't trust everything you see, even salt looks like sugar"
    tree.root.findByType(TextInput).props.onChangeText(text)
    tree.root.findByType(TouchableWithoutFeedback).props.onPress()
    expect(onSubmit).toBeCalledWith(text)
  })
})

describe("regarding the make offer button", () => {
  it("renders the inquiry make offer button if inquiry checkout flag is true, artwork ID is not null, and isOfferableFromInquiry is true", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsInquiryCheckout: true })
    const tree = renderWithWrappers(<Composer artworkID="12234" isOfferableFromInquiry={true} />)
    expect(tree.root.findAllByType(Button).length).toEqual(2)
  })

  it("renders the inquiry make offer button if inquiry checkout flag is true but artwork ID is null", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsInquiryCheckout: true })
    const tree = renderWithWrappers(<Composer artworkID={null} />)
    expect(tree.root.findAllByType(Button).length).toEqual(1)
  })

  it("doesn't render the inquiry make offer button if inquiry item is not an artwork", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsInquiryCheckout: false })
    const tree = renderWithWrappers(<Composer />)
    expect(tree.root.findAllByType(Button).length).toEqual(1)
  })

  it("doesn't render the inquiry make offer button if the artwork is not offerable", () => {
    __globalStoreTestUtils__?.injectFeatureFlags({ AROptionsInquiryCheckout: true })
    const tree = renderWithWrappers(<Composer artworkID="123456" isOfferableFromInquiry={false} />)
    expect(tree.root.findAllByType(Button).length).toEqual(1)
  })
})
