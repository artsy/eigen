import { tappedPromoSpace } from "@artsy/cohesion"
import { HomeHero_homePage } from "__generated__/HomeHero_homePage.graphql"
import { navigate } from "lib/navigation/navigate"
import { isPad } from "lib/utils/hardware"
import { PlaceholderBox } from "lib/utils/placeholders"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { color, Flex, Sans } from "palette"
import React, { useState } from "react"
import { Image, TouchableOpacity, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

const useHeroDimensions = () => {
  const { width, height: screenHeight } = useScreenDimensions()
  const height = Math.floor(Math.min(480, screenHeight * 0.6))
  return { width, height }
}

export const HomeHeroPlaceholder = () => {
  const { width, height } = useHeroDimensions()
  return <PlaceholderBox width={width} height={height} />
}

const HomeHero: React.FC<{ homePage: HomeHero_homePage }> = ({ homePage }) => {
  const tracking = useTracking()
  const [hasLoaded, setHasLoaded] = useState(false)
  const unit = homePage.heroUnits?.[0]
  if (!unit || !unit.backgroundImageURL || !unit.href) {
    return null
  }

  const { width, height } = useHeroDimensions()

  const handlePromoSpaceTap = () => {
    const path = unit.href!
    tracking.trackEvent(tappedPromoSpace({ path, subject: unit.title! }))
    navigate(path)
  }

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={handlePromoSpaceTap}>
      <Flex height={height} justifyContent="flex-end" p="2" style={{ backgroundColor: color("black30") }}>
        <Image
          style={{ width, height, position: "absolute" }}
          source={{ uri: unit.backgroundImageURL }}
          onLoad={() => setHasLoaded(true)}
        />
        <Flex maxWidth={isPad() ? "65%" : undefined}>
          <Sans size="8" color="white">
            {unit.title}
          </Sans>
          {unit.subtitle ? (
            <Sans size="3t" color="white" mt="0.5">
              {unit.subtitle}
            </Sans>
          ) : null}
          {unit.linkText ? (
            <Sans size="3t" color="white" weight="medium" mt="0.5">
              {unit.linkText}
            </Sans>
          ) : null}
        </Flex>
        {hasLoaded && unit.creditLine ? (
          // create a view the same size as the hero unit would be if you rotated it 90 degrees
          // then rotate this view 90 degrees so it overlaps with the hero unit and we get text
          // that reads bottom-to-top.
          <View
            style={{
              position: "absolute",
              top: height / 2 - width / 2,
              left: width / 2 - height / 2,
              width: height,
              height: width,
              transform: [{ rotate: "-90deg" }],
              justifyContent: "flex-end",
              paddingHorizontal: 10,
              paddingBottom: 5,
              opacity: 0.8,
            }}
          >
            <Sans size="2" color="white">
              {unit.creditLine}
            </Sans>
          </View>
        ) : null}
      </Flex>
    </TouchableOpacity>
  )
}

export const HomeHeroContainer = createFragmentContainer(HomeHero, {
  homePage: graphql`
    fragment HomeHero_homePage on HomePage
    @argumentDefinitions(heroImageVersion: { type: "HomePageHeroUnitImageVersion" }) {
      heroUnits(platform: MOBILE) {
        title
        subtitle
        creditLine
        linkText
        href
        backgroundImageURL(version: $heroImageVersion)
      }
    }
  `,
})
