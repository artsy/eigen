import { Flex, Text, useColor } from "palette"

interface ZeroStateProps {
  title?: string
  bigTitle?: string
  subtitle?: string
  separators?: boolean
  image?: JSX.Element
  callToAction?: JSX.Element
}

export const ZeroState = (props: ZeroStateProps) => {
  const color = useColor()
  const { title, bigTitle, subtitle, image, callToAction } = props

  return (
    <Flex px={1} alignItems="center" pt={2}>
      <Flex minHeight={30}>
        {!!title && (
          <Text variant="sm" lineHeight="20" style={{ maxWidth: "80%" }} color={color("black100")}>
            {title}
          </Text>
        )}
        {!!bigTitle && (
          <Text variant="md" style={{ textAlign: "center" }} color={color("black100")}>
            {bigTitle}
          </Text>
        )}
      </Flex>

      <Flex minHeight={image ? undefined : 80}>
        {!!subtitle && (
          <Text
            variant="sm"
            style={{ maxWidth: title || bigTitle ? "100%" : "80%" }}
            lineHeight="20"
            textAlign="center"
            color={title || bigTitle ? color("black60") : color("black100")}
          >
            {subtitle}
          </Text>
        )}
      </Flex>

      {!!image && image}

      <Flex minHeight={80}>{!!callToAction && <>{callToAction}</>}</Flex>
    </Flex>
  )
}
