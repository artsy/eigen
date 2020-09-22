import { Fair2Header_fair } from "__generated__/Fair2Header_fair.graphql"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { Box, Flex, Sans } from "palette"
import React, { useRef } from "react"
import { Dimensions } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

interface Fair2HeaderProps {
  fair: Fair2Header_fair
}

export const Fair2Header: React.FC<Fair2HeaderProps> = ({ fair }) => {
  const screenWidth = Dimensions.get("screen").width
  const profileImageUrl = fair.profile.icon.url

  const { name, slug, about, image, tagline, location, ticketsLink, hours, links, contact, summary, tickets } = fair

  const canShowMoreInfoLink =
    !!about ||
    !!tagline ||
    !!location?.summary ||
    !!ticketsLink ||
    !!hours ||
    !!links ||
    !!contact ||
    !!summary ||
    !!tickets

  const navRef = useRef<any>()
  const handleNavigation = (fairSlug: string) => {
    return SwitchBoard.presentNavigationViewController(navRef.current, `/fair2/${fairSlug}/info`)
  }

  return (
    <Box>
      <Flex alignItems="center" justifyContent="center" style={{ position: "relative" }}>
        <OpaqueImageView width={screenWidth} height={screenWidth / image.aspectRatio} imageURL={image.url} />
        <Flex
          alignItems="center"
          justifyContent="center"
          bg="white100"
          width={80}
          height={60}
          px={1}
          position="absolute"
          bottom={0}
          left={2}
        >
          <OpaqueImageView width={60} height={40} imageURL={profileImageUrl} />
        </Flex>
      </Flex>
      <Box px={2}>
        <Sans size="8" pt={3} pb={2}>
          {name}
        </Sans>
        <Sans size="3t">{summary || about}</Sans>
        {!!canShowMoreInfoLink && (
          <Sans size="3t" onPress={() => handleNavigation(slug)}>
            More info
          </Sans>
        )}
      </Box>
    </Box>
  )
}

export const Fair2HeaderFragmentContainer = createFragmentContainer(Fair2Header, {
  fair: graphql`
    fragment Fair2Header_fair on Fair {
      about
      summary
      name
      slug
      profile {
        icon {
          url
        }
      }
      image {
        url
        aspectRatio
      }
      # Used to figure out if we should render the More info link
      tagline
      location {
        summary
      }
      ticketsLink
      hours(format: HTML)
      links(format: HTML)
      tickets(format: HTML)
      contact(format: HTML)
    }
  `,
})
