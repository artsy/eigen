import { dimensions, screen } from "lib/data/ScreenSizes/screenSizes"
import { CircleWhiteCheckIcon } from "lib/Icons/CircleWhiteCheckIcon"
import { LegacyNativeModules } from "lib/NativeModules/LegacyNativeModules"
import { ProvideScreenTracking, Schema } from "lib/utils/track"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, color, Flex, Sans, Separator, Serif, space } from "palette"
import React, { useEffect, useState } from "react"
import { TouchableOpacity } from "react-native"
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

  const selectCity = (city: string, index: number) => {
    setSelectedCity(city)
    LegacyNativeModules.ARNotificationsManager.postNotificationName("ARLocalDiscoveryUserSelectedCity", {
      cityIndex: index,
    })
  }

  useEffect(() => {
    if (selectedCity === null) {
      return
    }
    setSelectedCity(null)
  }, [selectedCity])

  const handleCityList = (scrnHeight: number, city: string) => {
    return (
      <Serif
        mt="1"
        size={dimensions(scrnHeight)[screen(scrnHeight)].cityFontSize}
        lineHeight={dimensions(scrnHeight)[screen(scrnHeight)].lineHeight}
      >
        {city}
      </Serif>
    )
  }

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
        <Box ml="2">
          <Sans size="3" weight="medium">
            Fairs and Shows by City
          </Sans>
        </Box>
        <Box mx="2">
          {cityList.map((city, i) => (
            <Box key={i}>
              <TouchableOpacity onPress={() => selectCity(city, i)}>
                <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
                  {handleCityList(screenHeight, city)}
                  {selectedCity === city && (
                    <Box mb="2" mt="2">
                      <CircleWhiteCheckIcon width={26} height={26} />
                    </Box>
                  )}
                </Flex>
              </TouchableOpacity>
              <Separator />
            </Box>
          ))}
          <LogoContainer>
            <BMWSponsorship url={sponsoredContentUrl} logoText="Presented in partnership with BMW" />
          </LogoContainer>
        </Box>
      </Overlay>
    </ProvideScreenTracking>
  )
}

const Overlay = styled.ScrollView`
  flex: 1;
  background-color: ${color("white100")};
  margin-top: ${space(2)};
  margin-left: ${space(2)};
  margin-right: ${space(2)};
  flex-direction: column;
`
const LogoContainer = styled(Flex)`
  width: 100%;
  flex: 1;
  margin-top: 25px;
`
