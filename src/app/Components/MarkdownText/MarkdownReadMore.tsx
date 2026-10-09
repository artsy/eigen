import { Color, Flex, LinkText, TextProps } from "@artsy/palette-mobile"
import { MarkdownText } from "app/Components/MarkdownText/MarkdownText"
import { Schema } from "app/utils/track"
import React, { useEffect, useState } from "react"
import { LayoutAnimation, LayoutChangeEvent } from "react-native"
import { useTracking } from "react-tracking"

type TextVariant = NonNullable<TextProps["variant"]>

// Rough number of characters that fit on one line of a phone-width column, used to translate the
// legacy `maxChars` prop into a line clamp when no explicit `numberOfLines` is given.
const CHARS_PER_LINE: Partial<Record<TextVariant, number>> = { xs: 55, sm: 45, md: 35 }

export const linesFromMaxChars = (maxChars: number, variant: TextVariant) => {
  return Math.max(2, Math.ceil(maxChars / (CHARS_PER_LINE[variant] ?? 45)))
}

export interface MarkdownReadMoreProps {
  content: string
  maxChars: number
  numberOfLines?: number
  presentLinksModally?: boolean
  contextModule?: string
  trackingFlow?: string
  color?: Color
  testID?: string
  showReadLessButton?: boolean
  textVariant?: TextVariant
  linkTextVariant?: TextVariant
  onExpand?: (isExpanded: boolean) => void
}

/**
 * Line-clamped replacement for the character-truncating `ReadMore`, rendered with
 * react-native-enriched-markdown. "Read more" is only shown when the content overflows the clamp,
 * which we detect by comparing the clamped height with the height of the full content.
 */
export const MarkdownReadMore: React.FC<MarkdownReadMoreProps> = ({
  content,
  maxChars,
  numberOfLines,
  presentLinksModally = false,
  contextModule,
  trackingFlow,
  color = "mono100",
  testID,
  showReadLessButton = false,
  textVariant = "xs",
  linkTextVariant = "xs",
  onExpand,
}) => {
  const tracking = useTracking()
  const [isExpanded, setIsExpanded] = useState(false)
  const [fullHeight, setFullHeight] = useState<number | null>(null)
  const [clampedHeight, setClampedHeight] = useState<number | null>(null)

  const lines = numberOfLines ?? linesFromMaxChars(maxChars, textVariant)

  useEffect(() => {
    setFullHeight(null)
    setClampedHeight(null)
  }, [content, lines])

  const isTruncated =
    fullHeight !== null && clampedHeight !== null && fullHeight > clampedHeight + 1

  const setExpanded = (expanded: boolean) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setIsExpanded(expanded)
    onExpand?.(expanded)
  }

  const onExpandPress = () => {
    tracking.trackEvent({
      action_name: Schema.ActionNames.ReadMore,
      action_type: Schema.ActionTypes.Tap,
      context_module: contextModule ? contextModule : null,
      flow: trackingFlow ? trackingFlow : null,
    })
    setExpanded(true)
  }

  const markdownProps = {
    markdown: content,
    variant: textVariant,
    // The legacy ReadMore applied `color` to every node, including links and emphasis
    color,
    emphasisColor: color,
    linkColor: color,
    presentLinksModally,
  }

  return (
    <Flex testID={testID}>
      {/* Invisible, unclamped copy used to measure whether the clamped content overflows */}
      {!isExpanded && fullHeight === null && (
        <Flex
          position="absolute"
          width="100%"
          opacity={0}
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          onLayout={(event: LayoutChangeEvent) => setFullHeight(event.nativeEvent.layout.height)}
          testID="read-more-measure"
        >
          <MarkdownText {...markdownProps} />
        </Flex>
      )}

      <Flex
        onLayout={(event: LayoutChangeEvent) => {
          if (!isExpanded) {
            setClampedHeight(event.nativeEvent.layout.height)
          }
        }}
        testID="read-more-content"
      >
        <MarkdownText {...markdownProps} numberOfLines={isExpanded ? undefined : lines} />
      </Flex>

      {!isExpanded && !!isTruncated && (
        <LinkText
          mt={0.5}
          accessibilityRole="button"
          accessibilityLabel="Read More"
          onPress={onExpandPress}
          variant={linkTextVariant}
          color={color}
        >
          Read more
        </LinkText>
      )}

      {!!isExpanded && !!showReadLessButton && (
        <LinkText
          mt={0.5}
          mb={1}
          accessibilityRole="button"
          onPress={() => setExpanded(false)}
          variant={linkTextVariant}
          color={color}
        >
          Read Less
        </LinkText>
      )}
    </Flex>
  )
}
