import { Flex, Sans } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema } from "lib/utils/track"
import React, { useRef } from "react"
import { TouchableOpacity } from "react-native"
import { useTracking } from "react-tracking"
import styled from "styled-components/native"

interface BMWSponsorshipProps {
  url?: string
  logoText: string
  pressable?: boolean
}
export const BMWSponsorship: React.SFC<BMWSponsorshipProps> = props => {
  const { logoText, url, pressable = true } = props
  const navRef = useRef<any>()
  const tracking = useTracking()

  const view = (
    <Flex flexDirection="row" alignItems="center">
      <Logo source={require("../../../../images/BMW_Grey-Colour_RGB.png")} />
      <Sans size="3t" weight="medium" ml={1}>
        {logoText}
      </Sans>
    </Flex>
  )

  if (!pressable) {
    return view
  }

  return (
    <TouchableOpacity
      onPress={() => {
        SwitchBoard.presentNavigationViewController(
          navRef.current,
          url || "https://www.bmw-arts-design.com/bmw_art_guide"
        )

        tracking.trackEvent({
          action_name: Schema.ActionNames.BMWLogo,
          action_type: Schema.ActionTypes.Tap,
        })
      }}
      ref={navRef}
    >
      {view}
    </TouchableOpacity>
  )
}

export const Logo = styled.Image`
  height: 32;
  width: 32;
`
