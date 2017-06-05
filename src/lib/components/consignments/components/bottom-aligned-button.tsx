import * as React from "react"
import { Button, View } from "react-native"

import styled from "styled-components/native"
import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"

const Title = styled.Text`
  color: white
  font-family: "${fonts["avant-garde-regular"]}"
  flex: 1
`

const Subtitle = styled.Text`
  color: white
  font-family: "${fonts["garamond-regular"]}"
  padding-top: 6
  flex: 1
  text-align: right
`

const ImageDarkener = styled.View`
  background-color: rgba(0, 0, 0, 0.5)
  flex: 1
  width: 38
  justify-content: center
  align-items: center
  padding-top: 2
`
const Separator = styled.View`
  background-color: ${colors["gray-regular"]}
  height: 1
`

export interface BottomAlignedProps {
  onPress: () => void,
  children: any[]
}

const render = (props: BottomAlignedProps) =>
  <View>
    {props.children}
    <Separator />
    <View style={{ backgroundColor: "black", color: "white", height: 40 }}>
      <Button title="DONE" onPress={props.onPress} />
    </View>
  </View>

// Export a pure component version
export default class BottomAlignedButton extends React.PureComponent<BottomAlignedProps, null> {
  render() { return render(this.props) }
}
