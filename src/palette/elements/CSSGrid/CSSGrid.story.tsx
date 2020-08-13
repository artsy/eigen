import { storiesOf } from "@storybook/react"
import React from "react"
import { Image } from "../Image"
import { CSSGrid } from "./CSSGrid"

storiesOf("Components/CSSGrid", module).add(
  "CSSGrid with responsive props",
  () => {
    return (
      <CSSGrid
        width={[220, 420, 680]}
        gridGap={[2, 3, 4]}
        gridTemplateColumns={[
          "repeat(2, 1fr)",
          "repeat(3, 1fr)",
          "repeat(4, 1fr)",
        ]}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => {
          return (
            <Image
              src="https://picsum.photos/id/1025/140/100/"
              width={[100, 120, 140]}
              key={i}
            />
          )
        })}
      </CSSGrid>
    )
  },
  { chromatic: { delay: 500, diffThreshold: 0.2 } }
)
