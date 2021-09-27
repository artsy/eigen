import { themeGet } from "@styled-system/theme-get"
import React from "react"
import styled from "styled-components/native"

const BackgroundCircle = styled.View`
  background-color: ${themeGet("colors.black60")};
  height: 46;
  width: 46;
  border-radius: 22;
`

interface NameProps {
  user: boolean
}

const Name = styled.Text`
  color: ${(props: NameProps) => themeGet(`colors.${props.user ? "white100" : "black60"}`)};
  font-family: "Unica77LL-Regular"; /* this should be taken from the theme, but in here we cant, so until we rework this component, hardcode it. */
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
