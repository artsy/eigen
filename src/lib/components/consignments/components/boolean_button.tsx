import * as React from "react"
import { View } from "react-native"
import styled from "styled-components/native"
import fonts from "../../../../data/fonts"

const Title = styled.Text`
  color: white;
  font-family: "${fonts["avant-garde-regular"]}";
  font-size: 11;
`

const Background = styled.TouchableHighlight`
  background-color: green;
  height: 34;
  border-radius: 16;
  border-color: white;
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

const BlackCircle = styled.View`
  width: 24;
  height: 24;
  border-radius: 12;
  background-color: black;
  border-color: black;
  border-width: 1;
`

const WhiteCircle = styled.View`
  width: 24;
  height: 24;
  border-radius: 12;
  background-color: black;
  border-color: white;
  border-width: 1;
`

const CircleSpacer = styled.View`
  position: absolute;
  top: 4;
  left: 0;
  right: 0;
`

interface BooleanButton {
  selected: boolean
  left: string
  right: string
  onPress?: () => void
}

const render = (props: BooleanButton) => {
  const { selected } = props
  const mainBGColor = selected ? "white" : "black"
  const leftTextColor = selected ? "black" : "white"
  const rightTextColor = selected ? "black" : "white"
  const dotDirection = selected ? "row-reverse" : "row"
  const dotBorder = selected ? "white" : "white"
  const Circle = selected ? BlackCircle : WhiteCircle

  return (
    <Background style={{ backgroundColor: mainBGColor }} onPress={props.onPress}>
      <View>
        <TextBackground>
          <Title style={{ color: leftTextColor }}>{props.left}</Title>
          <Title style={{ textAlign: "right", color: rightTextColor }}>{props.right}</Title>
        </TextBackground>
        <CircleSpacer style={{ flexDirection: dotDirection }}>
          <Circle style={{ borderColor: dotBorder }} />
        </CircleSpacer>
      </View>
    </Background>
  )
}

// Export a pure component version
export default class ConsignmentTODO extends React.PureComponent<BooleanButton, null> {
  render() {
    return render(this.props)
  }
}
