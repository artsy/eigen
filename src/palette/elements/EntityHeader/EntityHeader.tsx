import { Avatar } from "palette/elements/Avatar"
import { Flex, FlexProps } from "palette/elements/Flex"
import { Text } from "palette/elements/Text"
import { bullet } from "palette/helpers"

interface EntityHeaderProps extends FlexProps {
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
  imageUrl,
  initials,
  name,
  meta,
  FollowButton,
  ...remainderProps
}) => {
  const followButton = FollowButton && (
    <Flex
      ml={smallVariant ? "0.5" : "1"}
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

          <Text variant="sm" ml="0.5">
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
