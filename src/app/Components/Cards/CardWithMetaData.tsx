import {
  Box,
  Flex,
  Image,
  Screen,
  SkeletonBox,
  SkeletonText,
  Spacer,
  Text,
  useScreenDimensions,
  useTheme,
} from "@artsy/palette-mobile"
import { CARD_WIDTH } from "app/Components/CardRail/CardRailCard"
import { RouterLink } from "app/system/navigation/RouterLink"
import { goBack } from "app/system/navigation/navigate"
import {
  PlaceholderBox,
  ProvidePlaceholderContext,
  RandomWidthPlaceholderText,
} from "app/utils/placeholders"
import { times } from "lodash"
import { FlatList, GestureResponderEvent, useWindowDimensions } from "react-native"
import { isTablet } from "react-native-device-info"

export const CARD_IMAGE_WIDTH = 295
export const CARD_IMAGE_HEIGHT = 230

interface CardWithMetaDataProps {
  isFluid?: boolean
  href: string | null | undefined
  imageURL?: string | null | undefined
  imageComponent?: React.ReactNode
  title: string | null | undefined
  subtitle: string | null | undefined
  tag: string | null | undefined
  onPress?: (event: GestureResponderEvent) => void
  testId?: string
}

export const CardWithMetaData: React.FC<CardWithMetaDataProps> = (props) => {
  const { isFluid, href, imageURL, title, subtitle, tag, onPress, imageComponent } = props
  const numColumns = useNumColumns()

  const { space } = useTheme()
  const { width } = useWindowDimensions()

  const cardWidth = isFluid
    ? width / numColumns - 2 * space(2)
    : imageComponent
      ? CARD_WIDTH
      : CARD_IMAGE_WIDTH

  return (
    <Flex width={cardWidth}>
      <RouterLink onPress={onPress} testID="article-card" to={href}>
        <Flex width={cardWidth} overflow="hidden">
          {!!imageURL ? (
            isFluid ? (
              <Image
                src={imageURL}
                // aspect ratio is fixed to 1.33 to match the old image aspect ratio
                aspectRatio={1.33}
                width={cardWidth}
              />
            ) : (
              <Image src={imageURL} width={CARD_IMAGE_WIDTH} height={CARD_IMAGE_HEIGHT} />
            )
          ) : !!imageComponent ? (
            imageComponent
          ) : (
            <Box height={CARD_IMAGE_HEIGHT} width={CARD_IMAGE_WIDTH} />
          )}

          <Spacer y={1} />

          {!!title && (
            <Text numberOfLines={2} ellipsizeMode="tail" variant="sm-display" mb={0.5}>
              {title}
            </Text>
          )}
          {!!subtitle && (
            <Text color="mono60" variant="xs">
              {subtitle}
            </Text>
          )}
          {!!tag && (
            <Text color="mono100" variant="xs">
              {tag}
            </Text>
          )}
        </Flex>
      </RouterLink>
    </Flex>
  )
}

export const CardWithMetaDataSkeleton: React.FC = () => {
  return (
    <Flex width={CARD_IMAGE_WIDTH} overflow="hidden">
      <SkeletonBox height={CARD_IMAGE_HEIGHT} width={CARD_IMAGE_WIDTH} />
      <Spacer y={1} />
      <SkeletonText variant="sm-display" mb={0.5}>
        Example title
      </SkeletonText>
      <SkeletonText variant="xs">Example subtitle</SkeletonText>
      <SkeletonText variant="xs">Berlin • Oct 8-Nov 9</SkeletonText>
    </Flex>
  )
}

interface CardsWithMetaDataListPlaceholderProps {
  title?: string
  testID?: string
}

export const CardsWithMetaDataListPlaceholder: React.FC<CardsWithMetaDataListPlaceholderProps> = ({
  title = "Artsy Editorial",
  testID,
}) => {
  const numColumns = useNumColumns()

  return (
    <Screen>
      <Screen.AnimatedHeader onBack={goBack} title={title} />
      <Screen.Body fullwidth>
        <ProvidePlaceholderContext>
          <Flex testID={testID} flexDirection="column" justifyContent="space-between" height="100%">
            <FlatList
              numColumns={numColumns}
              key={`${numColumns}`}
              ListHeaderComponent={() => <ListHeader title={title} />}
              data={times(6)}
              keyExtractor={(item) => `${item}-${numColumns}`}
              renderItem={({ item }) => {
                return (
                  <CardWithMetaDataListItem index={item} key={item}>
                    <PlaceholderBox aspectRatio={1.33} width="100%" marginBottom={10} />
                    <RandomWidthPlaceholderText minWidth={50} maxWidth={100} marginTop={1} />
                    <RandomWidthPlaceholderText
                      height={18}
                      minWidth={200}
                      maxWidth={200}
                      marginTop={1}
                    />
                    <RandomWidthPlaceholderText minWidth={100} maxWidth={100} marginTop={1} />
                    <Spacer y={2} />
                  </CardWithMetaDataListItem>
                )
              }}
              ItemSeparatorComponent={() => <Spacer y={4} />}
              onEndReachedThreshold={1}
            />
          </Flex>
        </ProvidePlaceholderContext>
      </Screen.Body>
    </Screen>
  )
}

export const ListHeader = ({ title = "" }) => (
  <Text mx={2} variant="lg-display" mb={2}>
    {title}
  </Text>
)

interface CardWithMetaDataListItemProps {
  index: number
}

export const CardWithMetaDataListItem: React.FC<
  React.PropsWithChildren<CardWithMetaDataListItemProps>
> = ({ children, index }) => {
  const numColumns = useNumColumns()

  if (numColumns === 1) {
    return <Flex mx={2}>{children}</Flex>
  }

  const ml = index % numColumns === 0 ? 2 : 1
  const mr = index % numColumns < numColumns - 1 ? 1 : 2

  return (
    <Flex flex={1 / numColumns} flexDirection="row" ml={ml} mr={mr}>
      <Flex flex={1}>{children}</Flex>
    </Flex>
  )
}

export const useNumColumns = () => {
  const { orientation } = useScreenDimensions()

  if (!isTablet()) {
    return 1
  }

  return orientation === "portrait" ? 2 : 3
}
