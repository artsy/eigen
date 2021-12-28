import { ICON_HEIGHT, ICON_WIDTH } from "lib/Scenes/BottomTabs/BottomTabsIcon"
import { useColor } from "palette"
import React from "react"
import { StyleProp, Text, View, ViewStyle } from "react-native"
import styled from "styled-components"
import { PopIn } from "../../../lib/Components/PopIn"

export const VisualClueText: React.FC<{ style?: StyleProp<ViewStyle> }> = ({ style = {} }) => {
  const size = 6
  const colors = useColor()

  return (
    <Wrapper>
      <View style={{ width: ICON_WIDTH, height: ICON_HEIGHT }}>
        <View
          style={{
            position: "absolute",
            top: 14,
            right: -48,
            ...(style as object),
          }}
        >
          <PopIn>
            <Text
              style={{
                fontSize: 12,
                borderRadius: size / 2,
                color: colors("blue100"),
              }}
            >
              New
            </Text>
          </PopIn>
        </View>
      </View>
    </Wrapper>
  )
}

const Wrapper = styled(View)`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
`
