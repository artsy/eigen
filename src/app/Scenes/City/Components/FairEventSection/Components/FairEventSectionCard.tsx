import { Box, Flex, Image, Text } from "@artsy/palette-mobile"
import { themeGet } from "@styled-system/theme-get"
import { Fair } from "app/Scenes/Map/types"
import { RouterLink } from "app/system/navigation/RouterLink"
import { Component } from "react"
import { Dimensions } from "react-native"
import styled from "styled-components/native"

interface Props {
  fair: Fair
}

export class FairEventSectionCard extends Component<Props> {
  // @TODO: Implement tests for this component https://artsyproduct.atlassian.net/browse/LD-549
  render() {
    const {
      fair: { image, name, profile, exhibition_period },
    } = this.props

    const width = Dimensions.get("window").width / 2 + 50

    return (
      <RouterLink to={`/fair/${this.props.fair.slug}`}>
        <Container>
          {!!image?.url && (
            <BackgroundImage src={image.url} height={310} width={width} zIndex={1} />
          )}
          <Overlay zIndex={2} />
          <Flex flexDirection="column" px={2} style={{ position: "absolute" }} zIndex={3}>
            {!!profile?.icon?.url ? (
              <Logo src={profile?.icon?.url} width={100} height={100} />
            ) : null}
          </Flex>
          <Box p={2} style={{ position: "absolute", bottom: 0, left: 0 }} zIndex={4}>
            <Flex flexDirection="column" flexGrow={1}>
              <Text variant="sm" weight="medium" color="mono0">
                {name}
              </Text>
              {!!exhibition_period && (
                <Text variant="sm" color="mono0">
                  {exhibition_period}
                </Text>
              )}
            </Flex>
          </Box>
        </Container>
      </RouterLink>
    )
  }
}

const BackgroundImage = styled(Image)`
  background: ${themeGet("colors.mono60")};
`

const Container = styled(Box)`
  width: ${Dimensions.get("window").width / 2 + 50}px;
  height: 310px;
  position: relative;
  overflow: hidden;
  background: ${themeGet("colors.mono60")};
`

// Set background color of overlay based on logo color
const Overlay = styled.View`
  background-color: rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  position: absolute;
`

const Logo = styled(Image)`
  background-color: transparent;
  margin-bottom: ${themeGet("space.1")};
  position: absolute;
  tint-color: white;
`
