import { color } from "@artsy/palette"
import fonts from "lib/data/fonts"
import React from "react"
import { View } from "react-native"
import styled from "styled-components/native"

const Title = styled.Text`
  color: white;
  font-family: "${fonts["avant-garde-regular"]}";
  font-size: 11;
  letter-spacing: 0.75;
  width: 24;
  text-align: center;
`

const Background = styled.TouchableHighlight`
  height: 34;
  border-radius: 16;
  border-color: black;
  border-width: 1;
  align-items: center;
  width: 64;
`

const TextBackground = styled.View`
  justify-content: space-between;
  flex-direction: row;
  margin-top: 9;
  margin-left: 8;
  margin-right: 8;
`

const WhiteCircle = styled.View`
  width: 24;
  height: 24;
  border-radius: 12;
  background-color: white;
  border-color: black;
  border-width: 1;
`

const CircleSpacer = styled.View`
  position: absolute;
  top: 4;
  left: 6;
  right: 6;
`

interface ToggleProps {
  selected: boolean
  left: string
  right: string
  onPress?: () => void
}

const render = (props: ToggleProps) => {
  const { selected } = props
  const mainBGColor = "white"
  const leftTextColor = "black"
  const rightTextColor = "black"
  const dotDirection = selected ? "row-reverse" : "row"
  const dotBorder = "black"
  const Circle = WhiteCircle

  return (
    <Background style={{ backgroundColor: mainBGColor }} onPress={props.onPress} underlayColor={color("white100")}>
      <View>
        <TextBackground>
          <Title style={{ color: leftTextColor }}>{selected ? props.left : ""}</Title>
          <Title style={{ color: rightTextColor }}>{selected ? "" : props.right}</Title>
        </TextBackground>
        <CircleSpacer style={{ flexDirection: dotDirection }}>
          <Circle style={{ borderColor: dotBorder }} />
        </CircleSpacer>
      </View>
    </Background>
  )
}

export default class Toggle extends React.Component<ToggleProps, null> {
  render() {
    return render(this.props)
  }
}
