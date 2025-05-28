import { Flex, Box, Text, TextProps, Separator, Join } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import { CircleWhiteCheckIcon } from "app/Components/Icons/CircleWhiteCheckIcon"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { useScreenDimensions } from "app/utils/hooks"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import React, { useEffect, useState } from "react"
import { ScrollView, TouchableOpacity } from "react-native"
import styled from "styled-components/native"
import cities from "../../../../data/cityDataSortedByDisplayPreference.json"

interface Props {
  selectedCity: string
}

const cityList = cities.map((city) => city.name)

export const CityPicker: React.FC<Props> = (props) => {
  const [selectedCity, setSelectedCity] = useState<string | null>(props.selectedCity)
  const { size } = useScreenDimensions()

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
    setSelectedCity(null)
  }, [selectedCity])

  const { height: screenHeight } = useScreenDimensions()

  // @TODO: Implement test for this component https://artsyproduct.atlassian.net/browse/LD-562
  return (
    <ProvideScreenTracking
      info={{
        context_screen: Schema.PageNames.CityPicker,
        context_screen_owner_type: Schema.OwnerEntityTypes.CityGuide,
      }}
    >
      <Overlay bounces={false} showsVerticalScrollIndicator={false}>
        <Box ml={2}>
          <Text variant="sm" weight="medium">
            Fairs and Shows by City
          </Text>
        </Box>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
          <Join separator={<Separator />}>
            {cityList.map((city, i) => (
              <Box key={i}>
                <TouchableOpacity accessibilityRole="button" onPress={() => selectCity(city, i)}>
                  <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Text
                      mt={1}
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
                <Separator />
              </Box>
            ))}
          </Join>
        </ScrollView>
      </Overlay>
    </ProvideScreenTracking>
  )
}

const Overlay = styled.ScrollView`
  flex: 1;
  background-color: ${themeGet("colors.background")};
  padding-top: ${themeGet("space.2")};
  padding-left: ${themeGet("space.2")};
  padding-right: ${themeGet("space.2")};
  border-radius: 10;
  flex-direction: column;
`

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
