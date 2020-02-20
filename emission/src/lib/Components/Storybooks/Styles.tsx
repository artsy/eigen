import colors from "lib/data/colors"
import fonts from "lib/data/fonts"
import styled from "styled-components/native"

export const Title = styled.Text`
  font-family: "${fonts["garamond-regular"]}";
  font-size: 30;
  padding-top: 20;
  padding-left: 60;
`

export const BodyText = styled.Text`
  font-family: "${fonts["garamond-regular"]}";
  font-size: 18;
  padding-top: 18;
  padding-bottom: 16;
  padding-left: 20;
  padding-right: 20;
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
