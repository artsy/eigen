import { HomeHero_homePage } from "__generated__/HomeHero_homePage.graphql"
import { Trove_trove } from "__generated__/Trove_trove.graphql"
import { isPad } from "app/utils/hardware"
import { useScreenDimensions } from "app/utils/useScreenDimensions"
import { Flex, Text, Touchable, useColor } from "palette"
import React, { useState } from "react"
import { View } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import OpaqueImageView from "../OpaqueImageView/OpaqueImageView"

type UnitType = NonNullable<
  NonNullable<HomeHero_homePage["heroUnits"] | Trove_trove["heroUnits"]>[0]
>

interface Props {
  unit: UnitType
  onPress: () => void
  isTrove?: boolean
}

const useHeroDimensions = () => {
  const { width, height: screenHeight } = useScreenDimensions()
  // component height is either 480 or 60% of screen height, whichever is lower
  const height = Math.floor(Math.min(480, screenHeight * 0.6))
  return { width, height }
}

export const HeroUnit: React.FC<Props> = ({ unit, onPress, isTrove = false }) => {
  const color = useColor()
  const [hasLoaded, setHasLoaded] = useState(false)

  const { width, height } = useHeroDimensions()

  const linkText = (unit as any)?.linkText

  return (
    <Touchable haptic activeOpacity={0.9} onPress={onPress}>
      <Flex
        height={height}
        justifyContent="flex-end"
        p="2"
        style={{ backgroundColor: color("black30") }}
      >
        <OpaqueImageView
          style={{ width, height, position: "absolute" }}
          imageURL={unit.backgroundImageURL}
          onLoad={() => setHasLoaded(true)}
        />
        {!!isTrove && (
          <LinearGradient
            colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.12)"]}
            locations={[0.4, 1]}
            style={{ width, height, position: "absolute" }}
          />
        )}
        <Flex maxWidth={isPad() ? "65%" : undefined}>
          <Text variant="xl" color="white">
            {unit.title}
          </Text>
          {!!unit.subtitle && (
            <Text variant="sm" color="white" mt={0.5}>
              {unit.subtitle}
            </Text>
          )}
          {!!linkText && (
            <Text variant="sm" color="white" weight="medium" mt={0.5}>
              {linkText}
            </Text>
          )}
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
            <Text variant="xs" color="white">
              {unit.creditLine}
            </Text>
          </View>
        ) : null}
      </Flex>
    </Touchable>
  )
}
