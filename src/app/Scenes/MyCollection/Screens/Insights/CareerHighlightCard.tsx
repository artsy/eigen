import {
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
  useSpace,
} from "palette"
import { Fragment, FunctionComponent } from "react"

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
  const space = useSpace()

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
    <Touchable
      haptic
      flex={1}
      style={{
        backgroundColor: color("white100"),
        borderColor: color("black10"),
        borderWidth: 1,
        height: 135,
        width: 205,
        padding: space(1),
      }}
    >
      <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
        <Flex backgroundColor={color("blue100")} px={0.5}>
          {!!isNew && (
            // margin top to align the spacing in the box
            <Text mt="-2px" fontSize={11} lineHeight={16} color="white100">
              New
            </Text>
          )}
        </Flex>
        <Flex
          alignSelf="flex-end"
          width={26}
          height={26}
          alignItems="center"
          justifyContent="center"
          style={{ borderWidth: 1, borderRadius: 24, borderColor: color("black100") }}
        >
          <Icon fill="black100" width={18} height={18} />
        </Flex>
      </Flex>
      <Flex justifyContent="flex-end" flex={1}>
        <Text variant="xl" color="blue100">
          {artistsNum}
        </Text>
        <Text variant="xs" color="black100">
          {label}
        </Text>
      </Flex>
    </Touchable>
  )
}
