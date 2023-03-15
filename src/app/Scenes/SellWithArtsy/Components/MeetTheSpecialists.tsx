import { ActionType, ContextModule, OwnerType, TappedConsignmentInquiry } from "@artsy/cohesion"
import { Flex, Spacer, Text, useColor, useSpace } from "@artsy/palette-mobile"
import { useExtraLargeWidth } from "app/Components/ArtworkRail/useExtraLargeWidth"
import { useSWALandingPageData } from "app/Scenes/SellWithArtsy/utils/useSWALandingPageData"
import { PlaceholderBox, PlaceholderButton, PlaceholderText } from "app/utils/placeholders"
import { uniqBy } from "lodash"
import { Button, Pill } from "palette"
import { useState } from "react"
import { FlatList, ImageBackground, ScrollView } from "react-native"
import LinearGradient from "react-native-linear-gradient"

export const MeetTheSpecialists: React.FC<{
  onInquiryPress: (
    trackingargs?: TappedConsignmentInquiry,
    recipientEmail?: string,
    recipientName?: string
  ) => void
}> = ({ onInquiryPress }) => {
  const color = useColor()
  const space = useSpace()

  const imgHeightToWidthRatio = 1.511 // based on designs
  const imgWidth = useExtraLargeWidth()

  const initialSpecialty = "auctions"
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(initialSpecialty)

  const {
    data: { specialists },
    loading,
  } = useSWALandingPageData()

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!specialists) {
    return null
  }

  const pillLabels = uniqBy(
    specialists.map((specialist) => {
      // derives the labels from specialists type.
      let titleText = specialist.specialty.replace(/([A-Z])/g, " $1")
      titleText = titleText.replace(/ And /g, " & ")
      const title = titleText.charAt(0).toUpperCase() + titleText.slice(1)
      return {
        type: specialist.specialty,
        title,
      }
    }),
    "title"
  )

  const specialistsToDisplay = specialists.filter((i) => i.specialty === selectedSpecialty)

  return (
    <Flex>
      <Text variant="lg-display" mx={2} mb={1}>
        Meet the specialists
      </Text>
      <Text variant="xs" mb={2} mx={2}>
        Our specialists span today’s most popular collecting categories.
      </Text>
      <ScrollView
        contentContainerStyle={{ marginHorizontal: space(2) }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {pillLabels.map((pill) => (
          <Pill
            key={pill.title}
            rounded
            selected={selectedSpecialty === pill.type}
            onPress={() => {
              setSelectedSpecialty(pill.type)
            }}
            mr={1}
            stateStyle={{
              pressed: {
                textColor: color("white100"),
                backgroundColor: color("black60"),
                borderColor: color("white100"),
              },
              selected: {
                textColor: color("white100"),
                backgroundColor: color("black100"),
                borderColor: color("black100"),
              },
            }}
          >
            {pill.title}
          </Pill>
        ))}
        <Spacer x={2} />
      </ScrollView>
      <Spacer y={2} />
      <FlatList
        contentContainerStyle={{ marginLeft: space(2) }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={specialistsToDisplay}
        renderItem={({ item }) => {
          const buttonText = `Contact ${item.firstName}`
          return (
            <ImageBackground
              source={{ uri: item.image }}
              resizeMode="cover"
              style={{
                width: imgWidth,
                height: imgWidth * imgHeightToWidthRatio,
                marginRight: space(1),
              }}
            >
              <LinearGradient
                colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                }}
              />
              <Flex position="absolute" bottom={0} mx={1} pb={2}>
                <Text variant="lg-display" color={color("white100")} mt={1}>
                  {item.name}
                </Text>
                <Text variant="xs" color={color("white100")}>
                  {item.jobTitle}
                </Text>
                <Text variant="xs" color={color("white100")} mt={1}>
                  {item.bio}
                </Text>
                <Button
                  size="small"
                  mt={1}
                  variant="outlineLight"
                  onPress={() => {
                    onInquiryPress(
                      tracks.consignmentInquiryTapped(buttonText),
                      item.email,
                      item.firstName
                    )
                  }}
                >
                  {buttonText}
                </Button>
              </Flex>
            </ImageBackground>
          )
        }}
        keyExtractor={(item) => item.name}
        ListFooterComponent={() => <Spacer x={4} />}
      />
      <Flex mx={2} mt={2}>
        <Text variant="md" mb={2}>
          Not sure who’s the right fit for your collection? Get in touch and we’ll connect you.
        </Text>

        <Button
          testID="MeetTheSpecialists-inquiry-CTA"
          block
          onPress={() => {
            onInquiryPress(tracks.consignmentInquiryTapped("Get in Touch"))
          }}
        >
          Get in Touch
        </Button>
      </Flex>
    </Flex>
  )
}

const tracks = {
  consignmentInquiryTapped: (subject: string): TappedConsignmentInquiry => ({
    action: ActionType.tappedConsignmentInquiry,
    context_module: ContextModule.sellMeetTheSpecialists,
    context_screen: OwnerType.sell,
    context_screen_owner_type: OwnerType.sell,
    subject,
  }),
}

const LoadingSkeleton = () => {
  const imgHeightToWidthRatio = 1.511 // based on designs
  const imgWidth = useExtraLargeWidth()
  return (
    <Flex>
      <PlaceholderText marginHorizontal={20} width="60%" height={40} />
      <PlaceholderText marginHorizontal={20} />
      <PlaceholderText marginHorizontal={20} />

      <Spacer y={2} />
      <FlatList
        contentContainerStyle={{ marginLeft: 20 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={[1, 2, 3]}
        renderItem={() => {
          return (
            <PlaceholderBox
              width={imgWidth}
              height={imgWidth * imgHeightToWidthRatio}
              marginRight={10}
            />
          )
        }}
        keyExtractor={(item) => item + "yy"}
        ListFooterComponent={() => <Spacer x={4} />}
      />
      <Flex mx={2} mt={2}>
        <PlaceholderText />
        <PlaceholderText />

        <PlaceholderButton />
      </Flex>
    </Flex>
  )
}
