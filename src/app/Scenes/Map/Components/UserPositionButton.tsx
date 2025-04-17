import { Flex, Box } from "@artsy/palette-mobile"
import Crosshair from "app/Components/Icons/Crosshair"
import { Component } from "react"
import { TouchableOpacity } from "react-native"
import styled from "styled-components/native"

// The types in both the styled-components-ts plugin and
// the typescroipt definitions for Background don't include
// these options, so we're using the as any escape hatch to
// let it through
const shadowDetails: any = {
  shadowRadius: 6,
  shadowColor: "black",
  shadowOpacity: 0.3,
  shadowOffset: { height: 0, width: 0 },
  alignSelf: "flex-end",
}

const Background = styled(Flex)`
  background: white;
  height: 40px;
  width: 40px;
  border-radius: 20px;
  align-content: center;
  align-self: flex-end;
`

interface Props {
  onPress?: () => void
  highlight?: boolean
}

export class UserPositionButton extends Component<Props> {
  render() {
    const { highlight, onPress } = this.props
    return (
      <TouchableOpacity onPress={onPress}>
        <Background flexDirection="row" alignItems="center" style={shadowDetails}>
          <Box style={{ marginLeft: "auto", marginRight: "auto" }}>
            <Crosshair color={highlight ? "blue100" : "mono100"} />
          </Box>
        </Background>
      </TouchableOpacity>
    )
  }
}
