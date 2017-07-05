import * as React from "react"

import { Text, View } from "react-native"

import styled from "styled-components/native"
import colors from "../../../../data/colors"
import fonts from "../../../../data/fonts"

const BackgroundCircle = styled.View`
  background-color: ${colors["gray-regular"]};
  height: 30;
  width: 30;
  border-radius: 15;
`

const Name = styled.Text`
  color: ${props => (props.user ? "white" : colors["gray-semibold"])};
  font-family: ${fonts["avant-garde-regular"]};
  font-size: 10;
  align-self: center;
  margin-top: 8;
`

interface Props {
  initials: string
  isUser: boolean
}

export default class Avatar extends React.Component<Props, any> {
  render() {
    const initials = this.props.initials
    if (this.props.isUser) {
      return <BackgroundCircle><Name user>{initials}</Name></BackgroundCircle>
    } else {
      return <BackgroundCircle><Name>{initials}</Name></BackgroundCircle>
    }
  }
}
