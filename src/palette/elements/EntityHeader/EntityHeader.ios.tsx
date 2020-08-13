import React, { SFC } from "react"
import { Avatar } from "../Avatar"
import { Flex } from "../Flex"
import { SpacerProps } from "../Spacer"
import { Sans } from "../Typography"

interface EntityHeaderProps extends SpacerProps {
  smallVariant?: boolean
  href?: string
  imageUrl?: string
  initials?: string
  meta?: string
  name: string
  FollowButton?: JSX.Element
}

/**
 * Component that is used as entity header that is paired with rich information about the entity.
 * Spec: zpl.io/aNoYM6d
 */
export const EntityHeader: SFC<EntityHeaderProps> = ({
  smallVariant,
  href,
  imageUrl,
  initials,
  name,
  meta,
  FollowButton,
  ...remainderProps
}) => {
  const followButton = FollowButton && (
    <Flex
      ml={smallVariant ? 0.3 : 1}
      flexDirection="row"
      alignItems="center"
      justifyContent="flex-end"
    >
      {FollowButton}
    </Flex>
  )

  const headerName = (
    <Sans ellipsizeMode="tail" numberOfLines={1} size="3">
      {name}
    </Sans>
  )

  return (
    <Flex
      flexDirection="row"
      justifyContent="space-between"
      flexWrap="nowrap"
      {...remainderProps}
    >
      {(imageUrl || initials) && (
        <Flex mr={1} justifyContent="center">
          <Avatar size="xs" src={imageUrl} initials={initials} />
        </Flex>
      )}

      {smallVariant ? (
        <Flex
          flexDirection="row"
          justifyContent="flex-start"
          flexGrow={1}
          alignItems="center"
        >
          {headerName}

          <Sans size="3" ml={0.3}>
            •
          </Sans>

          {followButton}
        </Flex>
      ) : (
        <Flex
          justifyContent="space-between"
          width={0}
          flexGrow={1}
          flexDirection="row"
        >
          <Flex>
            {headerName}

            <Sans
              ellipsizeMode="tail"
              numberOfLines={1}
              size="2"
              color="black60"
            >
              {meta ? meta : ""}
            </Sans>
          </Flex>
          {followButton}
        </Flex>
      )}
    </Flex>
  )
}

EntityHeader.displayName = "EntityHeader"
