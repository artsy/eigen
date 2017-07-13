import styled from "styled-components/native"
import colors from "../../../data/colors"
import fonts from "../../../data/fonts"

export const Title = styled.Text`
  font-family: "${fonts["garamond-regular"]}";
  font-size: 30;
  padding-top: 20;
  padding-left: 60;
`

export const BodyText = styled.Text`
  font-family: "${fonts["garamond-regular"]}";
  font-size: 18;
  padding: 18 20 16;
`

export const Background = styled.View`
  background-color: white;
  flex: 1;
  padding-bottom: 20;
`

export const Separator = styled.View`
  background-color: ${colors["gray-regular"]};
  height: 1;
`
