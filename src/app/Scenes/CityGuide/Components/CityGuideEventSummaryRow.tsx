import { Flex, Text } from "@artsy/palette-mobile"
import { SectionTitle } from "app/Components/SectionTitle"
import { RouterLink } from "app/system/navigation/RouterLink"
import { pluralize } from "app/utils/pluralize"
import { Image as RNImage } from "react-native"

const IMAGE_SIZE = 44

interface Props {
  title: string
  count: number
  /** Singular noun. Pluralised against `count`. */
  countLabel: string
  /** Appended to the count, for example "+" when the page cap was hit. */
  countSuffix?: string
  /**
   * Shown in place of the count line when `count` is 0. Required in practice: London had zero
   * current fairs when this was measured, and "0 Fairs" is a worse row than a sentence saying
   * nothing is on.
   */
  emptyText?: string
  /** The first few event or partner names, comma joined. One line. */
  subtitle?: string | null
  imageURL?: string | null
  /** Route to navigate to. Also lets the section title prefetch the destination on scroll. */
  href: string
  /**
   * Optional side-effect callback (eg. tracking) fired on press. Must NOT navigate itself —
   * navigation happens via `href`/`RouterLink`, and calling it here as well would navigate twice.
   */
  onPress?: () => void
}

export const CityGuideEventSummaryRow: React.FC<Props> = ({
  title,
  count,
  countLabel,
  countSuffix,
  emptyText,
  subtitle,
  imageURL,
  href,
  onPress,
}) => {
  return (
    <Flex px={2}>
      <SectionTitle title={title} href={href} onPress={() => onPress?.()} />

      <RouterLink
        to={href}
        disablePrefetch
        onPress={() => onPress?.()}
        testID="city-guide-event-summary-row"
        accessibilityRole="button"
      >
        <Flex flexDirection="row" gap={1} alignItems="center">
          {!!imageURL && (
            <RNImage
              source={{ uri: imageURL }}
              width={IMAGE_SIZE}
              height={IMAGE_SIZE}
              resizeMode="cover"
            />
          )}

          <Flex flex={1}>
            <Text variant="sm-display" color={count === 0 && !!emptyText ? "mono60" : undefined}>
              {count === 0 && !!emptyText
                ? emptyText
                : `${count}${countSuffix ?? ""} ${pluralize(countLabel, count)}`}
            </Text>

            {!!subtitle && (
              <Text variant="xs" color="mono60" numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </Flex>
        </Flex>
      </RouterLink>
    </Flex>
  )
}
