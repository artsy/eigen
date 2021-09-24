import { isPad } from "lib/utils/hardware"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Flex, Text, useColor } from "palette"
import React, { useState } from "react"
import { Image, TouchableOpacity, View } from "react-native"
import LinearGradient from "react-native-linear-gradient"

interface Props {
  unit: any
  onPress: () => void
  isTrove?: boolean
}

const useHeroDimensions = () => {
  const { width, height: screenHeight } = useScreenDimensions()
  const height = Math.floor(Math.min(480, screenHeight * 0.6))
  return { width, height }
}

export const HeroUnit: React.FC<Props> = ({ unit, onPress, isTrove = false }) => {
  const color = useColor()
  const [hasLoaded, setHasLoaded] = useState(false)

  const { width, height } = useHeroDimensions()

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <Flex height={height} justifyContent="flex-end" p="2" style={{ backgroundColor: color("black30") }}>
        <Image
          style={{ width, height, position: "absolute" }}
          source={{ uri: unit.backgroundImageURL }}
          onLoad={() => setHasLoaded(true)}
        />
        {!!isTrove && (
          <LinearGradient
            colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.12)"]}
            locations={[0.4, 1]}
            style={{
              position: "absolute",
              width,
              height,
            }}
          />
        )}
        <Flex maxWidth={isPad() ? "65%" : undefined}>
          <Text size="xl" color="white">
            {unit.title}
          </Text>
          {unit.subtitle ? (
            <Text size="sm" color="white" mt={0.5}>
              {unit.subtitle}
            </Text>
          ) : null}
          {unit.linkText ? (
            <Text size="sm" color="white" weight="medium" mt={0.5}>
              {unit.linkText}
            </Text>
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
            <Text size="xs" color="white">
              {unit.creditLine}
            </Text>
          </View>
        ) : null}
      </Flex>
    </TouchableOpacity>
  )
}
