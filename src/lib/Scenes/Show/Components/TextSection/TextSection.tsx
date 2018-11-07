import { Serif } from "@artsy/palette"
import React from "react"

interface Props {
  text: string
  title: string
}

export const TextSection: React.SFC<Props> = ({ text, title }) => (
  <>
    <Serif size="4" weight="semibold">
      {title}
    </Serif>
    <Serif size="3">{text}</Serif>
  </>
)
