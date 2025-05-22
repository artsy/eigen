import { Box, Flex, Join, Separator, Text, TextProps, useSpace } from "@artsy/palette-mobile"
import { CircleWhiteCheckIcon } from "app/Components/Icons/CircleWhiteCheckIcon"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { useScreenDimensions } from "app/utils/hooks"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import React, { useEffect, useState } from "react"
import { ScrollView, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import cities from "../../../../data/cityDataSortedByDisplayPreference.json"

interface Props {
  selectedCity: string
}

const cityList = cities.map((city) => city.name)

const BORDER_RADIUS = 10

export const CityPicker: React.FC<Props> = (props) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(props.selectedCity)
  const { size } = useScreenDimensions()
  const space = useSpace()
  const insets = useSafeAreaInsets()

  const selectCity = (city: string, index: number) => {
    setSelectedCity(city)
    LegacyNativeModules.ARNotificationsManager.postNotificationName(
      "ARLocalDiscoveryUserSelectedCity",
      {
        cityIndex: index,
      }
    )
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
            {cityList.map((city, i) => (
              <Box key={i}>
                <TouchableOpacity accessibilityRole="button" onPress={() => selectCity(city, i)}>
                  <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Text
                      selectable={false}
                      variant={dimensions(screenHeight)[size].cityFontSize}
                      lineHeight={`${dimensions(screenHeight)[size].lineHeight}px`}
                    >
                      {city}
                    </Text>
                    {selectedCity === city && (
                      <Box mb={2} mt={2}>
                        <CircleWhiteCheckIcon width={26} height={26} />
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
