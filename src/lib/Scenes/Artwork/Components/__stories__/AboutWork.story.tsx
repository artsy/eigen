import { Flex, Join, Sans, Spacer } from "@artsy/palette"
import { storiesOf } from "@storybook/react-native"
import React from "react"
import { AboutWork } from "../AboutWork"

const additionalInformation =
  "Warhol Mao at Castelli Gallery New York 1972:\nRare original Mao Tse-Tung Leo Castelli Invitation Card, 1972. Published in 1972 to announce the exhibit and sale of Warhol's iconic Mao screen-prints/silkscreens. \n\nOffset Print on smooth wove light cream paper\n7 x 7 inches (Overall size when opened: 6 7/8 x 13 3/4 in.).\nFine condition: folded as issued. Only minor signs of handling. \n\nOffered by Lot 180 New York. Worldwide shipping available."

const description =
  "Andy Warhol modeled his now-iconic portraits of Mao Zedong off of the official state portrait of the Chinese Communist leader. Using silkscreen printing, Warhol was able to produce many versions of the portrait, changing only the color palette. Warhol’s _Mao_ transformed a serious portrait of a world leader into a provocatively playful and colorful image, with some renditions depicting Mao wearing eyeshadow, blush, or lipstick. It was Warhol’s longtime dealer, Bruno Bischofberger, who first suggested that he create a portrait of the most important figure of the 20th century. Fascinated by fame and celebrity culture, Warhol had recently read in _Life_ magazine that Mao Zedong was the most famous person in the world, making him an appealing subject. _Mao_ is among Warhol’s most popular portraits: The auction record for the work is $47.5 million, sold at Sotheby’s in 2015."

storiesOf("Artwork/Components").add("About this Work", () => {
  return (
    <Join separator={<Spacer mb={2} />}>
      <Flex>
        <Sans size="3t" weight="medium" color="purple100" mb={2}>
          About the work (All info present)
        </Sans>
        <AboutWork artwork={{ additional_information: additionalInformation, description, " $refType": null }} />
      </Flex>
      <Flex>
        <Sans size="3t" weight="medium" color="purple100" mb={2}>
          About the work (Only additional_information present)
        </Sans>
        <AboutWork artwork={{ additional_information: additionalInformation, description: null, " $refType": null }} />
      </Flex>
      <Flex>
        <Sans size="3t" weight="medium" color="purple100" mb={2}>
          About the work (Only description present)
        </Sans>
        <AboutWork artwork={{ additional_information: null, description, " $refType": null }} />
      </Flex>
    </Join>
  )
})
