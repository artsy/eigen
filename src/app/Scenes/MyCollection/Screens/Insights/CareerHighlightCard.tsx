import themeGet from "@styled-system/theme-get"
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
  useColor,
} from "palette"
import { Fragment, FunctionComponent } from "react"
import { Image } from "react-native"
import styled from "styled-components/native"

type CareerHighlightKind =
  | "SOLO_SHOW"
  | "GROUP_SHOW"
  | "COLLECTED"
  | "REVIEWED"
  | "BIENNIAL"
  | "ACTIVE_SECONDARY_MARKET"

interface CareerHighlightsCardProps {
  artistsNum: number
  type: CareerHighlightKind
  isNew?: boolean
}

export const CareerHighlightsCard: React.FC<CareerHighlightsCardProps> = ({
  artistsNum,
  type,
  isNew,
}) => {
  const color = useColor()

  let label: string = ""
  let Icon: FunctionComponent<IconProps> = Fragment

  // plural
  const pl = artistsNum > 1

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

  return (
    <Touchable haptic>
      <CareerHighlightCard p={1}>
        <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
          <Flex backgroundColor={color("blue100")} px={0.5}>
            {!!isNew && (
              // margin top to align the spacing in the box
              <Text mt="-2px" fontSize={11} lineHeight={16} color="white100">
                New
              </Text>
            )}
          </Flex>
          <IconContainer>
            <Icon fill="black100" width={18} height={18} />
          </IconContainer>
        </Flex>
        <Flex justifyContent="flex-end" flex={1}>
          <Text variant="xl" color="blue100">
            {artistsNum}
          </Text>
          <Text variant="xs" color="black100">
            {label}
          </Text>
        </Flex>
      </CareerHighlightCard>
    </Touchable>
  )
}

export const CareerHighlightPromotionalCard: React.FC = () => {
  return (
    <Flex ml={2} width={200} height={135} backgroundColor="white100" flexDirection="row">
      <Flex p={1} flex={1}>
        <Flex flex={1} justifyContent="center">
          <Text variant="xs">Discover career highlights for your artists.</Text>
        </Flex>
        <Button
          size="small"
          testID="career-highlight-promo-card-button"
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
          Upload Artwork
        </Button>
      </Flex>

      <Image source={require("images/career-highlights-promo-background-image.webp")} />
    </Flex>
  )
}

const CareerHighlightCard = styled(Flex)`
  background: ${themeGet("colors.white100")};
  border: 1px solid ${themeGet("colors.black10")};
  height: 135;
  width: 205;
`
const IconContainer = styled(Flex)`
  width: 26;
  height: 26;
  align-self: flex-end;
  align-items: center;
  justify-content: center;
  border: 1px solid ${themeGet("colors.black100")};
  border-radius: 24px;
`
