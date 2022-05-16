import { themeGet } from "@styled-system/theme-get"
import { CircleWhiteCheckIcon } from "app/Icons/CircleWhiteCheckIcon"
import { LegacyNativeModules } from "app/NativeModules/LegacyNativeModules"
import { ProvideScreenTracking, Schema } from "app/utils/track"
import { SansV1Props, SerifV1Props } from "palette"
import { Box, Flex, Sans, Separator, Serif } from "palette"
import React, { useEffect, useState } from "react"
import { TouchableOpacity } from "react-native"
import { useScreenDimensions } from "shared/hooks"
import styled from "styled-components/native"
import cities from "../../../../data/cityDataSortedByDisplayPreference.json"
import { BMWSponsorship } from "../City/CityBMWSponsorship"

interface Props {
  selectedCity: string
  sponsoredContentUrl?: string
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
  const { sponsoredContentUrl } = props

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
          <Sans size="3" weight="medium">
            Fairs and Shows by City
          </Sans>
        </Box>
        <Box mx={2}>
          {cityList.map((city, i) => (
            <Box key={i}>
              <TouchableOpacity onPress={() => selectCity(city, i)}>
                <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Serif
                    mt={1}
                    size={dimensions(screenHeight)[size].cityFontSize}
                    lineHeight={dimensions(screenHeight)[size].lineHeight}
                  >
                    {city}
                  </Serif>
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
          <LogoContainer>
            <BMWSponsorship
              url={sponsoredContentUrl}
              logoText="Presented in partnership with BMW"
            />
          </LogoContainer>
        </Box>
      </Overlay>
    </ProvideScreenTracking>
  )
}

const Overlay = styled.ScrollView`
  flex: 1;
  background-color: ${themeGet("colors.white100")};
  margin-top: ${themeGet("space.2")}px;
  margin-left: ${themeGet("space.2")}px;
  margin-right: ${themeGet("space.2")}px;
  flex-direction: column;
`
const LogoContainer = styled(Flex)`
  width: 100%;
  flex: 1;
  margin-top: 25px;
`

type FontSize = SansV1Props["size"] & SerifV1Props["size"]
const dimensions = (size: number) => ({
  small: {
    cityFontSize: "4" as FontSize,
    logoFontSize: "2" as FontSize,
    lineHeight: size / 14,
  },
  standard: {
    cityFontSize: "8" as FontSize,
    logoFontSize: "3" as FontSize,
    lineHeight: size / 12,
  },
  large: {
    cityFontSize: "8" as FontSize,
    logoFontSize: "3" as FontSize,
    lineHeight: size / 11,
  },
})
