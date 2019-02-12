import { color, Serif } from "@artsy/palette"
import colors from "lib/data/colors"
import fonts from "lib/data/fonts"
import { BucketKey, BucketResults } from "lib/Scenes/Map/Bucket";
import React from "react"
import styled from "styled-components/native"

export interface Props {
  currentBucket: BucketKey
  buckets: BucketResults
}

export const AllEvents: React.SFC<Props> = () => {
  return (
    <>
      <MarginContainer>
        <Divider />
        <Placeholder>BMW Sponsorship view</Placeholder>
        <Placeholder>Saved items view</Placeholder>
        <Placeholder tall>
          <Title size="8">Fairs</Title>
        </Placeholder>
        <Divider />
        <Placeholder tall>
          <Title size="8">Gallery shows</Title>
        </Placeholder>
        <Divider />
        <Placeholder tall>
          <Title size="8">Museum shows</Title>
        </Placeholder>
        <Divider />
        <Placeholder tall>
          <Title size="8">BMW Art Guide</Title>
        </Placeholder>
        <Divider />
        <Placeholder tall>
          <Title size="8">Closing this week</Title>
        </Placeholder>
        <Divider />
        <Placeholder tall>
          <Title size="8">Opening this week</Title>
        </Placeholder>
      </MarginContainer>
    </>
  )
}

const Title = styled(Serif)`
  width: auto;
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 700px;
`

export const Placeholder = styled.Text<{ tall?: boolean }>`
  z-index: -1;
  color: ${colors["gray-semibold"]};
  font-family: "${fonts["garamond-regular"]}";
  font-size: 20;
  margin-top: 5px;
  margin-bottom: 5px;
  width: 100%;
  background-color: #ffcccc;
  ${props => (props.tall ? "height: 200px;" : "")}
`

export const MarginContainer = styled.View`
  margin-left: 15px;
  margin-right: 15px;
  width: auto;
`

export const Divider = styled.View`
  width: 100%;
  border: 1px;
  border-color: ${color("black30")};
  border-bottom-width: 0;
  margin-bottom: 15px;
`
