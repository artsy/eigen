import { themeGet } from "@styled-system/theme-get"
import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { ArtworkIcon, AuctionIcon, Box, CloseIcon, Flex, Sans, Spacer, Touchable, useSpace } from "palette"
import React from "react"
import { Pressable, ScrollView } from "react-native"
import styled from "styled-components/native"

export const SearchListItem: React.FC<any> = ({
  onPress,
  imageURL,
  categoryName,
  Info,
  onDelete,
  showNavigationButtons,
}) => {
  const space = useSpace()

  return (
    <>
      <Touchable onPress={onPress}>
        <Flex py={space(1)} px={space(2)} flexDirection="row" alignItems="center">
          <OpaqueImageView
            imageURL={imageURL}
            style={{ width: 40, height: 40, borderRadius: categoryName === "Artist" ? 20 : 0, overflow: "hidden" }}
          />
          <Spacer ml={1} />
          <Flex style={{ flex: 1 }}>
            <Info />
          </Flex>
          {!!onDelete && (
            <Touchable
              onPress={onDelete}
              hitSlop={{
                bottom: 20,
                top: 20,
                left: 10,
                right: 20,
              }}
            >
              <Flex pl={1}>
                <CloseIcon fill="black60" />
              </Flex>
            </Touchable>
          )}
        </Flex>
      </Touchable>

      {showNavigationButtons && (
        <>
          <Spacer m={0.5} />

          <Flex flexDirection="row" alignItems="center">
            <ScrollView
              horizontal
              contentContainerStyle={{ paddingHorizontal: space(1) }}
              showsHorizontalScrollIndicator={false}
            >
              <Spacer ml={1} />

              <Pressable onPress={() => onPress({ artistTab: "Artworks" })}>
                {({ pressed }) => (
                  <QuickNavigationButton>
                    <Box mr={0.5}>
                      <ArtworkIcon fill={pressed ? "blue100" : "black100"} />
                    </Box>
                    <Sans size="3" color={pressed ? "blue100" : "black100"}>
                      Artworks
                    </Sans>
                  </QuickNavigationButton>
                )}
              </Pressable>

              <Spacer ml={1} />

              <Pressable onPress={() => onPress({ artistTab: "Insights" })}>
                {({ pressed }) => (
                  <QuickNavigationButton>
                    <Box mr={0.5}>
                      <AuctionIcon fill={pressed ? "blue100" : "black100"} />
                    </Box>
                    <Sans size="3" color={pressed ? "blue100" : "black100"}>
                      Auction Results
                    </Sans>
                  </QuickNavigationButton>
                )}
              </Pressable>
            </ScrollView>
          </Flex>
        </>
      )}
    </>
  )
}

const QuickNavigationButton = styled(Flex)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2px 10px;
  border: 1px solid ${themeGet("colors.black30")};
  border-radius: 20;
`
