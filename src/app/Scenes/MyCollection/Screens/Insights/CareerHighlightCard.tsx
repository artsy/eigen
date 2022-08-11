import { navigate, popToRoot } from "app/navigation/navigate"
import { Tab } from "app/Scenes/MyProfile/MyProfileHeaderMyCollectionAndSavedWorks"
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
  careerHighlightsAvailableTypes: CareerHighlightKind[]
}

export const CareerHighlightsCard: React.FC<CareerHighlightsCardProps> = ({
  count,
  type,
  careerHighlightsAvailableTypes,
}) => {
  if (count === 0) {
    return null
  }

  const { label, Icon } = getCareerHiglight(type, count)

  return (
    <Touchable
      haptic
      onPress={() => {
        navigate("/my-collection/career-highlights", {
          passProps: { type, careerHighlightsAvailableTypes },
        })
      }}
      testID="career-highlight-card-item"
    >
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

export const CareerHighlightPromotionalCard: React.FC = () => {
  return (
    <Touchable
      haptic
      onPress={() => {
        navigate("my-collection/artworks/new", {
          passProps: {
            mode: "add",
            source: Tab.insights,
            onSuccess: popToRoot,
          },
        })
      }}
    >
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
          <Button size="small">Upload Artwork</Button>
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

  switch (type) {
    case "BIENNIAL":
      label = `${pl ? "Artists were" : "Artist was"} included in a major biennial${pl ? "s" : ""}.`
      Icon = FairIcon
      break
    case "COLLECTED":
      label = `${pl ? "Artists are" : "Artist is"} collected by a major institution${
        pl ? "s" : ""
      }.`
      Icon = MuseumIcon
      break
    case "GROUP_SHOW":
      label = `${pl ? "Artists were" : "Artist was"} in a group show at a major institution${
        pl ? "s" : ""
      }.`
      Icon = GroupIcon
      break
    case "REVIEWED":
      label = `${pl ? "Artists were" : "Artist was"} reviewed by a major art publication${
        pl ? "s" : ""
      }.`
      Icon = PublicationIcon
      break

    case "SOLO_SHOW":
      label = `${pl ? "Artists" : "Artist"} had a solo show at a major institution${pl ? "s" : ""}.`
      Icon = SoloIcon
      break
    /*
    case "": // TODO: Collected by artists
      label = `${pl ? "Artists are" : "Artist is"} collected by a major private collector${
        pl ? "s" : ""
      }.`
      Icon = ArtworkIcon
      break
    case "": // TODO: Major prize - TBD
      label = `${pl ? "Artists were" : "Artist was"} awarded a major prize${pl ? "s" : ""}.`
      Icon = CertificateIcon
      break
    */
  }

  return { label, Icon }
}
