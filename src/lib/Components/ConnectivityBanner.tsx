import { themeGet } from "@styled-system/theme-get"
import React from "react"
import styled from "styled-components/native"

// @ts-ignore
const Container = styled.View`
  height: 30;
  background-color: ${themeGet("colors.yellow10")};
  justify-content: center;
  align-items: center;
`

const ConnectivityMessage = styled.Text`
  color: ${themeGet("colors.yellow100")};
  text-align: center;
  font-family: "ReactNativeAGaramondPro-Regular";
  font-size: 16;
  padding-top: 5;
`

export default class ConnectivityBanner extends React.Component<any, any> {
  render() {
    return (
      <Container>
        <ConnectivityMessage> No Internet Connection</ConnectivityMessage>
      </Container>
    )
  }
}
