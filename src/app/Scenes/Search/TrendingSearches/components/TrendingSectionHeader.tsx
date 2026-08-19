import { Flex, Text, Touchable } from "@artsy/palette-mobile"

interface TrendingSectionHeaderProps {
  title: string
  actionLabel?: string
  onActionPress?: () => void
}

export const TrendingSectionHeader: React.FC<TrendingSectionHeaderProps> = ({
  title,
  actionLabel,
  onActionPress,
}) => {
  return (
    <Flex flexDirection="row" alignItems="center" justifyContent="space-between" mx={2} mb={2}>
      <Text variant="sm-display">{title}</Text>

      {!!actionLabel && !!onActionPress && (
        <Touchable
          accessibilityRole="button"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={onActionPress}
        >
          <Text variant="xs" color="mono60">
            {actionLabel}
          </Text>
        </Touchable>
      )}
    </Flex>
  )
}
