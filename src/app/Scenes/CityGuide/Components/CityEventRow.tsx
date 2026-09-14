import { Flex, Text } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"
import { Image as RNImage } from "react-native"

const IMAGE_SIZE = 60

interface Props {
  title: string
  /** Usually the partner name. */
  subtitle?: string | null
  /** Third line. Currently the exhibition period; see the spec on why admission is omitted. */
  meta?: string | null
  imageURL?: string | null
  href?: string | null
  /** A `CityEventShowSaveControl` or `CityEventFairSaveControl`, injected so this row holds no Relay dependency. */
  saveControl?: React.ReactNode
}

export const CityEventRow: React.FC<Props> = ({
  title,
  subtitle,
  meta,
  imageURL,
  href,
  saveControl,
}) => {
  return (
    <Flex testID="city-event-row" flexDirection="row" alignItems="center" gap={1} py={1}>
      <RouterLink to={href ?? undefined} disablePrefetch style={{ flex: 1 }}>
        <Flex flexDirection="row" alignItems="center" gap={1} flex={1}>
          {!!imageURL && (
            <RNImage
              source={{ uri: imageURL }}
              width={IMAGE_SIZE}
              height={IMAGE_SIZE}
              resizeMode="cover"
            />
          )}

          <Flex flex={1}>
            <Text variant="sm-display" numberOfLines={2}>
              {title}
            </Text>

            {!!subtitle && (
              <Text variant="xs" color="mono60" numberOfLines={1}>
                {subtitle}
              </Text>
            )}

            {!!meta && (
              <Text variant="xs" color="mono60" numberOfLines={1}>
                {meta}
              </Text>
            )}
          </Flex>
        </Flex>
      </RouterLink>

      {!!saveControl && <Flex>{saveControl}</Flex>}
    </Flex>
  )
}
