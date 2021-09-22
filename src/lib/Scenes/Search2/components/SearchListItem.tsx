import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { CloseIcon, Flex, Spacer, Touchable, useSpace } from "palette"
import React from "react"

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
      </Touchable>

      {children}
    </>
  )
}
