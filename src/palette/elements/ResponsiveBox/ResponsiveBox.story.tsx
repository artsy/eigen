import { storiesOf } from "@storybook/react"
import React, { useEffect, useRef, useState } from "react"
import { Box } from "../Box"
import { Text } from "../Text"
import {
  ResponsiveBox,
  ResponsiveBoxAspectDimensions,
  ResponsiveBoxMaxDimensions,
  ResponsiveBoxProps,
} from "./ResponsiveBox"

const Measure: React.FC<ResponsiveBoxProps> = props => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const ref = useRef<null | HTMLDivElement>(null)

  const check = () => {
    if (!ref.current) return
    setDimensions({
      width: ref.current.offsetWidth,
      height: ref.current.offsetHeight,
    })
  }

  useEffect(() => {
    check()
    window.addEventListener("resize", check)
    return () => {
      window.removeEventListener("resize", check)
    }
  })

  return (
    <Box width="100%" height="100%" p={0.5} ref={ref as any}>
      <Text variant="small" color="white100">
        {props.aspectWidth}:{props.aspectHeight}
        <br />
        {("maxWidth" in props || "maxHeight" in props) && (
          <>
            with max dimensions of{" "}
            {[(props as any).maxHeight || 0, (props as any).maxWidth || 0].join(
              " × "
            )}
            <br />
          </>
        )}
        Renders @ {dimensions.width} × {dimensions.height}
      </Text>
    </Box>
  )
}

const EXAMPLE_ASPECTS: ResponsiveBoxAspectDimensions[] = [
  { aspectWidth: 300, aspectHeight: 400 },
  { aspectWidth: 400, aspectHeight: 300 },
]

const EXAMPLE_MAXIMUMS: ResponsiveBoxMaxDimensions[] = [
  { maxHeight: 200, maxWidth: 200 },
  { maxHeight: 400, maxWidth: 400 },
  { maxHeight: 400 },
  { maxWidth: 400 },
  { maxHeight: 600, maxWidth: 600 },
  { maxHeight: 100, maxWidth: 600 },
  { maxHeight: 1024, maxWidth: 1024 },
]

storiesOf("Components/ResponsiveBox", module)
  .add("Basic", () => {
    return (
      <>
        {EXAMPLE_ASPECTS.map((aspect, i) =>
          EXAMPLE_MAXIMUMS.map((maximum, j) => {
            return (
              <ResponsiveBox
                key={[i, j].join(".")}
                {...aspect}
                {...maximum}
                bg="purple100"
                my={2}
              >
                <Measure {...aspect} {...maximum} />
              </ResponsiveBox>
            )
          })
        )}
      </>
    )
  })
  .add("maxWidth: 100%", () => {
    return (
      <>
        {EXAMPLE_ASPECTS.map((aspect, i) => {
          return (
            <ResponsiveBox
              key={i}
              {...aspect}
              maxWidth="100%"
              bg="purple100"
              my={2}
            >
              <Measure {...aspect} maxWidth="100%" />
            </ResponsiveBox>
          )
        })}
      </>
    )
  })
