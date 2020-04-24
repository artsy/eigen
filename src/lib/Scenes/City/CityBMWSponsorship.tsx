import { Flex, Sans, space } from "@artsy/palette"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Schema } from "lib/utils/track"
import React, { useRef } from "react"
import { TouchableOpacity } from "react-native"
import { useTracking } from "react-tracking"
// @ts-ignore STRICTNESS_MIGRATION
import styled from "styled-components/native"

interface BMWSponsorshipProps {
  url?: string
  logoText: string
  mt: number
  ml: number
}
export const BMWSponsorship: React.SFC<BMWSponsorshipProps> = props => {
  const { logoText, url, mt, ml } = props
  const navRef = useRef<any>()
  const tracking = useTracking()

  const navigateToBMWArtGuide = () => {
    SwitchBoard.presentNavigationViewController(navRef.current, url || "https://www.bmw-arts-design.com/bmw_art_guide")
  }

  return (
    <Flex flexDirection="row" py={1} alignItems="center">
      <TouchableOpacity
        onPress={() => {
          navigateToBMWArtGuide()

          tracking.trackEvent({
            action_name: Schema.ActionNames.BMWLogo,
            action_type: Schema.ActionTypes.Tap,
          })
        }}
        ref={navRef}
      >
        <Flex flexDirection="row">
          <Logo source={require("../../../../images/BMW_Grey-Colour_RGB.png")} />
          <Sans size="3t" weight="medium" ml={ml} mt={mt}>
            {logoText}
          </Sans>
        </Flex>
      </TouchableOpacity>
    </Flex>
  )
}

export const Logo = styled.Image`
  height: 32;
  width: 32;
  margin-top: ${space(0.3)};
`
