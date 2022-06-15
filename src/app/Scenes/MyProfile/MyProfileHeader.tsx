import { useNavigation } from "@react-navigation/native"
import { MyProfileHeader_me$key } from "__generated__/MyProfileHeader_me.graphql"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { navigate } from "app/navigation/navigate"
import { setVisualClueAsSeen, useFeatureFlag, useVisualClue } from "app/store/GlobalStore"
import {
  Avatar,
  Box,
  BriefcaseIcon,
  Button,
  Flex,
  Join,
  MapPinIcon,
  Message,
  MuseumIcon,
  Spacer,
  Text,
  useColor,
} from "palette"
import React, { useContext, useEffect, useState } from "react"
import { Image } from "react-native"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import { MyProfileContext } from "./MyProfileProvider"
import { normalizeMyProfileBio } from "./utils"

const ICON_SIZE = 14

export const MyProfileHeader: React.FC<{ me: MyProfileHeader_me$key }> = (props) => {
  const me = useFragment(myProfileHeaderFragment, props.me)

  const color = useColor()
  const navigation = useNavigation()
  const { showVisualClue } = useVisualClue()

  const enableCompleteProfileMessage = useFeatureFlag("AREnableCompleteProfileMessage")

  const { localImage } = useContext(MyProfileContext)

  const userProfileImagePath = localImage || me?.icon?.url

  const [showCompleteCollectorProfileMessage, setShowCompleteCollectorProfileMessage] = useState(
    showVisualClue("CompleteCollectorProfileMessage")
  )

  useEffect(() => {
    setVisualClueAsSeen("CompleteCollectorProfileMessage")
  }, [])

  const isCollectorProfileCompleted = !!(
    me.bio &&
    me.icon &&
    me.profession &&
    me.otherRelevantPositions
  )

  const showCompleteProfileMessage =
    enableCompleteProfileMessage &&
    !isCollectorProfileCompleted &&
    showCompleteCollectorProfileMessage

  return (
    <>
      <FancyModalHeader
        rightButtonText="Settings"
        hideBottomDivider
        onRightButtonPress={() => {
          navigate("/my-profile/settings")
        }}
      />
      {showCompleteProfileMessage && (
        <Flex mb={2}>
          <Message
            variant="default"
            title="Why complete your Collector Profile?"
            text="A complete profile helps you build a relationship with sellers. Select “Edit Profile” to see which details are shared when you contact sellers."
            showCloseButton
            onClose={() => setShowCompleteCollectorProfileMessage(false)}
          />
        </Flex>
      )}

      <Flex flexDirection="row" alignItems="center" px={2}>
        <Box
          height="99"
          width="99"
          borderRadius="50"
          backgroundColor={color("black10")}
          justifyContent="center"
          alignItems="center"
        >
          {!!userProfileImagePath ? (
            <Avatar src={userProfileImagePath} size="md" />
          ) : (
            <Image source={require("images/profile_placeholder_avatar.webp")} />
          )}
        </Box>
        <Box px={2} flexShrink={1}>
          <Text variant="xl" color={color("black100")}>
            {me?.name}
          </Text>
          {!!me?.createdAt && (
            <Text variant="xs" color={color("black60")}>{`Member since ${new Date(
              me?.createdAt
            ).getFullYear()}`}</Text>
          )}
        </Box>
      </Flex>

      <Flex px={2} mt={2}>
        <Join separator={<Spacer mb={0.5} />}>
          {!!me?.location?.display && (
            <Flex flexDirection="row" alignItems="center">
              <MapPinIcon width={ICON_SIZE} height={ICON_SIZE} />
              <Text variant="xs" color={color("black100")} px={0.5}>
                {me.location.display}
              </Text>
            </Flex>
          )}

          {!!me?.profession && (
            <Flex flexDirection="row" alignItems="center">
              <BriefcaseIcon width={ICON_SIZE} height={ICON_SIZE} />
              <Text variant="xs" color={color("black100")} px={0.5}>
                {me.profession}
              </Text>
            </Flex>
          )}

          {!!me?.otherRelevantPositions && (
            <Flex flexDirection="row" alignItems="center">
              <MuseumIcon width={ICON_SIZE} height={ICON_SIZE} />
              <Text variant="xs" color={color("black100")} px={0.5}>
                {me?.otherRelevantPositions}
              </Text>
            </Flex>
          )}
        </Join>
      </Flex>
      {!!me?.bio && (
        <Text variant="xs" color={color("black100")} px={2} pt={1}>
          {normalizeMyProfileBio(me?.bio)}
        </Text>
      )}
      <Flex p={2}>
        <Button
          variant="outline"
          size="small"
          flex={1}
          onPress={() => {
            navigation.navigate("MyProfileEditForm")
          }}
        >
          Edit Profile
        </Button>
      </Flex>
    </>
  )
}

const myProfileHeaderFragment = graphql`
  fragment MyProfileHeader_me on Me {
    name
    bio
    location {
      display
    }
    otherRelevantPositions
    profession
    icon {
      url(version: "thumbnail")
    }
    createdAt
  }
`
