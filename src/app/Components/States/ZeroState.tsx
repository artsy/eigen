import { Flex, Text, useColor } from "@artsy/palette-mobile"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

interface ZeroStateProps {
  title?: string
  bigTitle?: string
  subtitle?: string
  separators?: boolean
  image?: JSX.Element
  callToAction?: JSX.Element
  minHeight?: number
  showBorder?: boolean
}

export const ZeroState = (props: ZeroStateProps) => {
  const enableRedesignedSettings = useFeatureFlag("AREnableRedesignedSettings")

  const color = useColor()

  const { title, bigTitle, subtitle, image, callToAction, showBorder, minHeight = 90 } = props

  if (enableRedesignedSettings && showBorder) {
    return (
      <Flex px={2} alignItems="center" mt={2}>
        <Flex borderRadius={20} borderWidth={1} borderColor="mono10" overflow="hidden" mb={2}>
          <Flex pt={2} px={2}>
            {!!title && (
              <Text variant="sm" color="mono100" textAlign="center">
                {title}
              </Text>
            )}

            {!!bigTitle && (
              <Text variant="md" textAlign="center" color={color("mono100")}>
                {bigTitle}
              </Text>
            )}
          </Flex>

          <Flex px={2}>
            {!!subtitle && (
              <Text
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
        </Flex>

        <Flex minHeight={minHeight}>{!!callToAction && <>{callToAction}</>}</Flex>
      </Flex>
    )
  }

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
