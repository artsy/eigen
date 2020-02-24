import React from "react"

import colors from "lib/data/colors"
import fonts from "lib/data/fonts"
import styled from "styled-components/native"

const BackgroundCircle = styled.View`
  background-color: ${colors["gray-regular"]};
  height: 30;
  width: 30;
  border-radius: 15;
`

interface NameProps {
  user: boolean
}

const Name = styled.Text`
  color: ${(props: NameProps) => (props.user ? "white" : colors["gray-semibold"])};
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
    return (
      <BackgroundCircle>
        <Name user={this.props.isUser}>{initials}</Name>
      </BackgroundCircle>
    )
  }
}
