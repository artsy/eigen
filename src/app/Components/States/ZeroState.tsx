import { Flex, Text, useColor } from "palette"
interface ZeroStateProps {
  title?: string
  subtitle?: string
  separators?: boolean
  callToAction?: JSX.Element
}

export const ZeroState = (props: ZeroStateProps) => {
  const color = useColor()
  return (
    <Flex px={1} alignItems="center" pt={2}>
      <Flex minHeight={30}>
        {!!props.title && (
          <Text variant="sm" lineHeight="20" style={{ maxWidth: "80%" }} color={color("black100")}>
            {props.title}
          </Text>
        )}
      </Flex>

      <Flex minHeight={80}>
        {!!props.subtitle && (
          <Text
            variant="sm"
            style={{ maxWidth: props.title ? "100%" : "80%" }}
            lineHeight="20"
            textAlign="center"
            color={props.title ? color("black60") : color("black100")}
          >
            {props.subtitle}
          </Text>
        )}
      </Flex>

      <Flex minHeight={80}>{!!props.callToAction && <>{props.callToAction}</>}</Flex>
    </Flex>
  )
}
