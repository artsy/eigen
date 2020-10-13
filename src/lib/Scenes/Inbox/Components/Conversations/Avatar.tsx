import React from "react"

import colors from "lib/data/colors"
import fonts from "lib/data/fonts"
import styled from "styled-components/native"

const BackgroundCircle = styled.View`
  background-color: ${colors["gray-regular"]};
  height: 46;
  width: 46;
  border-radius: 22;
`

interface NameProps {
  user: boolean
}

const Name = styled.Text`
  color: ${(props: NameProps) => (props.user ? "white" : colors["gray-semibold"])};
  font-family: ${fonts["avant-garde-regular"]};
  font-size: 12;
  align-self: center;
  margin-top: 14;
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
