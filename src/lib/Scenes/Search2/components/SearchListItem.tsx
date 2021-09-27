import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { CloseIcon, Flex, Spacer, Touchable } from "palette"
import React from "react"

const IMAGE_SIZE = 40

interface SearchListItemProps {
  categoryName: string
  imageURL: string | null
  onPress: () => void
  onDelete?: () => void
  InfoComponent: React.ComponentType<any>
}

export const SearchListItem: React.FC<SearchListItemProps> = ({
  categoryName,
  imageURL,
  onPress,
  onDelete,
  InfoComponent,
  children,
}) => {
  return (
    <>
      <Touchable onPress={onPress}>
        <Flex height={IMAGE_SIZE} flexDirection="row" alignItems="center">
          <OpaqueImageView
            imageURL={imageURL}
            style={{
              width: IMAGE_SIZE,
              height: IMAGE_SIZE,
              borderRadius: categoryName === "Artist" ? 20 : 0,
              overflow: "hidden",
            }}
          />
          <Spacer ml={1} />
          <Flex flex={1}>
            <InfoComponent />
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

        {!!children && <Spacer mb={1} />}
      </Touchable>

      {children}
    </>
  )
}
