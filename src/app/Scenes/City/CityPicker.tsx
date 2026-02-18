import { CheckmarkStrokeIcon } from "@artsy/icons/native"
import { Box, Flex, Join, Separator, Text, TextProps, useSpace } from "@artsy/palette-mobile"
import { ACCESSIBLE_DEFAULT_ICON_SIZE } from "app/Components/constants"
import { useScreenDimensions } from "app/utils/hooks"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import React, { useEffect, useState } from "react"
import { ScrollView, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import expandedCities from "../../../../data/cityDataSortedByDisplayPreference-expanded.json"
import originalCities from "../../../../data/cityDataSortedByDisplayPreference.json"

export type CityData = {
  slug: string
  name: string
  coordinates: {
    lat: number
    lng: number
  }
  maxBounds: {
    sw: {
      lat: number
      lng: number
    }
    ne: {
      lat: number
      lng: number
    }
  }
}
interface Props {
  selectedCity: string
  onSelectCity: (city: CityData) => void
}

const BORDER_RADIUS = 10

export const CityPicker: React.FC<Props> = (props) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(props.selectedCity)
  const { size } = useScreenDimensions()
  const space = useSpace()
  const insets = useSafeAreaInsets()
  const enabledExpandedList = useFeatureFlag("AREnableExpandedCityGuide")

  const cities = enabledExpandedList ? expandedCities : originalCities

  const selectCity = (city: CityData) => {
    setSelectedCity(city.name)
    props.onSelectCity(city)
  }

  useEffect(() => {
    if (selectedCity === null) {
      return
    }
  }, [selectedCity])

  const { height: screenHeight } = useScreenDimensions()

  // @TODO: Implement test for this component https://artsyproduct.atlassian.net/browse/LD-562

  return (
    <Flex
      position="absolute"
      zIndex={1000}
      style={{
        marginTop: insets.top + space(6),
      }}
      backgroundColor="mono0"
      borderRadius={BORDER_RADIUS}
      maxHeight="80%"
      minWidth="90%"
      alignSelf="center"
    >
      <ProvideScreenTracking
        info={{
          context_screen: Schema.PageNames.CityPicker,
          context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
        }}
      >
        <ScrollView contentContainerStyle={{ padding: space(2) }}>
          <Box>
            <Text variant="sm" weight="medium">
              Fairs and Shows by City
            </Text>
          </Box>
          <Join separator={<Separator />}>
            {cities.map((city, i) => (
              <Box key={i}>
                <TouchableOpacity accessibilityRole="button" onPress={() => selectCity(city)}>
                  <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Text
                      selectable={false}
                      variant={dimensions(screenHeight)[size].cityFontSize}
                      lineHeight={`${dimensions(screenHeight)[size].lineHeight}px`}
                    >
                      {city.name}
                    </Text>
                    {selectedCity === city.name && (
                      <Box mb={2} mt={2}>
                        <CheckmarkStrokeIcon
                          width={ACCESSIBLE_DEFAULT_ICON_SIZE}
                          height={ACCESSIBLE_DEFAULT_ICON_SIZE}
                        />
                      </Box>
                    )}
                  </Flex>
                </TouchableOpacity>
              </Box>
            ))}
          </Join>
        </ScrollView>
      </ProvideScreenTracking>
    </Flex>
  )
}

const dimensions = (
  size: number
): Record<
  string,
  { cityFontSize: TextProps["variant"]; logoFontSize: TextProps["variant"]; lineHeight: number }
> => ({
  small: {
    cityFontSize: "md",
    logoFontSize: "xs",
    lineHeight: size / 14,
  },
  standard: {
    cityFontSize: "lg",
    logoFontSize: "sm",
    lineHeight: size / 12,
  },
  large: {
    cityFontSize: "lg",
    logoFontSize: "sm",
    lineHeight: size / 11,
  },
})
