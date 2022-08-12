import {
  Button,
  FairIcon,
  Flex,
  GroupIcon,
  IconProps,
  MuseumIcon,
  PublicationIcon,
  SoloIcon,
  Text,
  Touchable,
} from "palette"
import { Fragment, FunctionComponent } from "react"
import { Image } from "react-native"

export type CareerHighlightKind =
  | "SOLO_SHOW"
  | "GROUP_SHOW"
  | "COLLECTED"
  | "REVIEWED"
  | "BIENNIAL"
  | "ACTIVE_SECONDARY_MARKET"

interface CareerHighlightsCardProps {
  count: number
  type: CareerHighlightKind
  onPress: () => void
}

export const CareerHighlightsCard: React.FC<CareerHighlightsCardProps> = ({
  count,
  type,
  onPress,
}) => {
  if (count === 0) {
    return null
  }

  const { label, Icon } = getCareerHiglight(type, count)

  return (
    <Touchable haptic onPress={onPress} testID="career-highlight-card-item">
      <Flex p={1} height={135} width={205} background="white" border={1} borderColor="black10">
        <Flex flexDirection="row" alignItems="center" justifyContent="flex-end">
          <Flex
            width={26}
            height={26}
            alignSelf="flex-end"
            alignItems="center"
            justifyContent="center"
            border={1}
            borderColor="black100"
            borderRadius={24}
          >
            <Icon fill="black100" width={21} height={21} />
          </Flex>
        </Flex>
        <Flex justifyContent="flex-end" flex={1}>
          <Text variant="xl" color="blue100">
            {count}
          </Text>
          <Text variant="xs" color="black100">
            {label}
          </Text>
        </Flex>
      </Flex>
    </Touchable>
  )
}

interface CareerHighlightPromotionalCardProps {
  onPress: () => void
  onButtonPress: () => void
}
export const CareerHighlightPromotionalCard: React.FC<CareerHighlightPromotionalCardProps> = ({
  onPress,
  onButtonPress,
}) => {
  return (
    <Touchable haptic onPress={onPress}>
      <Flex
        width={200}
        height={135}
        backgroundColor="white100"
        flexDirection="row"
        border={1}
        borderColor="black10"
      >
        <Flex p={1} flex={1}>
          <Flex flex={1} justifyContent="center">
            <Text variant="xs">Discover career highlights for your artists.</Text>
          </Flex>
          <Button onPress={onButtonPress} size="small">
            Upload Artwork
          </Button>
        </Flex>

        <Image source={require("images/career-highlights-promo-background-image.webp")} />
      </Flex>
    </Touchable>
  )
}

export const getCareerHiglight = (type: CareerHighlightKind, count: number) => {
  let label: string = ""
  let Icon: FunctionComponent<IconProps> = Fragment

  // plural
  const pl = count > 1
  const ending = pl ? "s" : ""
  const article = pl ? "" : "a "

  switch (type) {
    case "BIENNIAL":
      label = `${pl ? "Artists were" : "Artist was"} included in ${article}major biennial${ending}.`
      Icon = FairIcon
      break
    case "COLLECTED":
      label = `${
        pl ? "Artists are" : "Artist is"
      } collected by ${article}major institution${ending}.`
      Icon = MuseumIcon
      break
    case "GROUP_SHOW":
      label = `${
        pl ? "Artists were" : "Artist was"
      } in a group show at ${article}major institution${ending}.`
      Icon = GroupIcon
      break
    case "REVIEWED":
      label = `${
        pl ? "Artists were" : "Artist was"
      } reviewed by ${article}major art publication${ending}.`
      Icon = PublicationIcon
      break

    case "SOLO_SHOW":
      label = `${
        pl ? "Artists" : "Artist"
      } had a solo show at ${article}major institution${ending}.`
      Icon = SoloIcon
      break
    /*
    case "": // TODO: Collected by artists
      label = `${pl ? "Artists are" : "Artist is"} collected by ${article}major private collector${ending}.`
      Icon = ArtworkIcon
      break
    case "": // TODO: Major prize - TBD
      label = `${pl ? "Artists were" : "Artist was"} awarded ${article}major prize${ending}.`
      Icon = CertificateIcon
      break
    */
  }

  return { label, Icon }
}
