import { ActionType, ContextModule, OwnerType, TappedConsignmentInquiry } from "@artsy/cohesion"
import { Flex, Spacer, Text, useColor, useSpace } from "@artsy/palette-mobile"
import { SPECIALISTS, Specialty } from "app/Scenes/SellWithArtsy/utils/specialistsData"
import { Button, Pill } from "palette"
import { useState } from "react"
import { FlatList, ImageBackground, ScrollView } from "react-native"
import LinearGradient from "react-native-linear-gradient"

interface PillData {
  type: Specialty
  title: string
}

const pills: PillData[] = [
  {
    type: "auctions",
    title: "Auctions",
  },
  {
    type: "priveteSalesAndAdvisory",
    title: "Private Sales & Advisory",
  },
  {
    type: "collectorServices",
    title: "Collector Services",
  },
]

export const MeetTheSpecialists: React.FC<{
  onInquiryPress: (trackingargs?: TappedConsignmentInquiry) => void
}> = ({ onInquiryPress }) => {
  const color = useColor()
  const space = useSpace()

  const initialSpecialty: Specialty = "auctions"
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty>(initialSpecialty)
  const specialistsToDisplay = SPECIALISTS.filter((i) => i.specialty === selectedSpecialty)

  return (
    <Flex>
      <Text variant="lg-display" mx={2}>
        Meet the specialists
      </Text>
      <Text variant="xs" mb={2} mx={2}>
        Our in-house experts cover Post-War and Contemporary Art, Prints and Multiples, Street Art
        and Photographs.
      </Text>
      <ScrollView
        contentContainerStyle={{ marginHorizontal: space(2) }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {pills.map((pill) => (
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
          const imgHeightToWidthRatio = 1.511 // based on designs
          const imgWidth = 250
          return (
            <ImageBackground
              source={item.image}
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
                    onInquiryPress(tracks.consignmentInquiryTapped(buttonText))
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
          Not sure which of our experts is the right fit for your work? Get in touch and we'll
          connect you.
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
