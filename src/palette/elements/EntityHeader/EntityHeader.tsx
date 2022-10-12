import { bullet } from "palette/helpers"
import { SpacingUnitTheme } from "palette/Theme"
import { SpacerProps } from "../../atoms/Spacer"
import { Avatar } from "../Avatar"
import { Flex, FlexProps } from "../Flex"
import { Text } from "../Text"

interface EntityHeaderProps extends SpacerProps, FlexProps {
  smallVariant?: boolean
  href?: string
  imageUrl?: string
  initials?: string
  meta?: string
  name: string
  FollowButton?: JSX.Element
}

export const EntityHeader: React.FC<EntityHeaderProps> = ({
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
    <Text variant="sm" ellipsizeMode="tail" numberOfLines={1} style={{ flexShrink: 1 }}>
      {name}
    </Text>
  )

  const headerMeta = !!meta && (
    <Text
      variant="xs"
      ellipsizeMode="tail"
      numberOfLines={1}
      color="black60"
      style={{ flexShrink: 1 }}
    >
      {meta}
    </Text>
  )

  return (
    <Flex flexDirection="row" flexWrap="nowrap" {...remainderProps}>
      {!!(imageUrl || initials) && (
        <Flex mr={1} justifyContent="center">
          <Avatar size="xs" src={imageUrl} initials={initials} />
        </Flex>
      )}

      {smallVariant ? (
        <Flex flexDirection="row" justifyContent="flex-start" flexGrow={1} alignItems="center">
          {headerName}

          <Text variant="sm" ml={0.3}>
            {bullet}
          </Text>

          {followButton}
        </Flex>
      ) : (
        <Flex justifyContent="space-between" width={0} flexGrow={1} flexDirection="row">
          <Flex alignSelf="center" flexShrink={1}>
            {headerName}
            {headerMeta}
          </Flex>
          {followButton}
        </Flex>
      )}
    </Flex>
  )
}

EntityHeader.displayName = "EntityHeader"
