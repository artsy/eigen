import { Flex, useColor, Text } from "@artsy/palette-mobile"

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
      <Flex>
        {!!title && (
          <Text
            variant="sm"
            lineHeight="20px"
            style={{ maxWidth: "90%" }}
            color={color("mono100")}
            textAlign="center"
          >
            {title}
          </Text>
        )}

        {!!bigTitle && (
          <Text variant="sm-display" textAlign="center" color={color("mono100")}>
            {bigTitle}
          </Text>
        )}
      </Flex>

      <Flex>
        {!!subtitle && (
          <Text
            mt={0.5}
            variant={bigTitle ? "xs" : "sm"}
            style={{ maxWidth: title || bigTitle ? "100%" : "80%" }}
            textAlign="center"
            color={title || bigTitle ? color("mono60") : color("mono100")}
          >
            {subtitle}
          </Text>
        )}
      </Flex>

      {!!image && image}

      <Flex minHeight={90}>{!!callToAction && <>{callToAction}</>}</Flex>
    </Flex>
  )
}
