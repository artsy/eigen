import { useNetInfo } from "@react-native-community/netinfo"
import { Text } from "palette"
import React from "react"
import { Modal } from "react-native"
import ReactTestRenderer from "react-test-renderer"
import { NetworkAwareProvider } from "../NetworkAwareProvider"

describe("NetworkAwareProvider", () => {
  it('shows "connect to internet" modal when the phone is not connected', () => {
    ;(useNetInfo as jest.Mock).mockReturnValue({
      isConnected: false,
    })

    // tslint:disable-next-line:use-wrapped-components
    const tree = ReactTestRenderer.create(
      <NetworkAwareProvider>
        <Text>Test</Text>
      </NetworkAwareProvider>
    )

    expect(tree.root.findAllByType(Modal)[0].props.visible).toEqual(true)
  })

  it('does not show "connect to internet" modal when the phone is connected', () => {
    ;(useNetInfo as jest.Mock).mockReturnValue({
      isConnected: true,
    })

    // tslint:disable-next-line:use-wrapped-components
    const tree = ReactTestRenderer.create(
      <NetworkAwareProvider>
        <Text>Test</Text>
      </NetworkAwareProvider>
    )

    expect(tree.root.findAllByType(Modal)[0].props.visible).toEqual(false)
  })
})
