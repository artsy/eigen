import {
  Flex,
  FlexProps,
  TextProps,
  useColor,
  useScreenDimensions,
  useSpace,
  useTheme,
} from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { merge } from "lodash"
import RenderHtml, { MixedStyleRecord } from "react-native-render-html"

interface HTMLProps extends FlexProps {
  html: string
  onLinkPress?: (href: string) => void
  tagStyles?: MixedStyleRecord
  variant?: TextProps["variant"]
}

export const FONTS = {
  regular: "Unica77LL-Regular",
  italic: "Unica77LL-Italic",
  medium: "Unica77LL-Medium",
  mediumItalic: "Unica77LL-MediumItalic",
}

export const HTML: React.FC<HTMLProps> = ({
  html,
  onLinkPress,
  tagStyles = {},
  variant = "sm",
  ...flexProps
}) => {
  const color = useColor()
  const space = useSpace()
  const { width } = useScreenDimensions()
  const { theme } = useTheme()

  const variantStyles = theme.textTreatments[variant]
  const contentWidth = width - space(4)

  return (
    <Flex {...flexProps} width={contentWidth}>
      <RenderHtml
        contentWidth={contentWidth}
        source={{ html }}
        systemFonts={[FONTS.regular, FONTS.italic, FONTS.medium, FONTS.mediumItalic]}
        renderersProps={{
          a: {
            onPress: (event, href) => {
              event.preventDefault()

              // External callback
              if (onLinkPress) {
                onLinkPress(href)
              }

              // Override default behavior to ensure we use our internal router
              // to navigate internal or external
              navigate(href)
            },
          },
        }}
        tagsStyles={merge(
          {
            a: {
              textDecorationLine: "underline",
              textDecorationColor: color("mono100"),
              color: color("mono100"),
              textDecorationStyle: "solid",
            },
            p: {
              fontFamily: FONTS.regular,
              color: color("mono100"),
              ...variantStyles,
            },
            em: {
              fontFamily: FONTS.italic,
              color: color("mono100"),
            },
            h2: {
              fontFamily: FONTS.medium,
              fontWeight: "normal",
              color: color("mono100"),
            },
            h3: {
              fontFamily: FONTS.regular,
              fontWeight: "normal",
              color: color("mono100"),
            },
          },
          tagStyles
        )}
      />
    </Flex>
  )
}
