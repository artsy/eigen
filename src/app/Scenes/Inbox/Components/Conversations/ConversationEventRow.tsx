import { IconProps } from "@artsy/icons/native"
import { Color, Flex, FlexProps, LinkText, Text } from "@artsy/palette-mobile"

interface ConversationEventRowProps extends FlexProps {
  Icon: React.FC<IconProps>
  iconFill: Color
  message: string
  textColor: Color
  action?: { label?: string; onPress?: () => void }
}

/**
 * The shared presentational row for an event line in a conversation thread: a
 * centered icon followed by a short status message (and an optional inline
 * action link). Used by both order/offer events (OrderUpdate) and partner
 * offers (ConversationPartnerOfferUpdate), which derive their icon, color, and
 * message from different data sources.
 */
export const ConversationEventRow: React.FC<ConversationEventRowProps> = ({
  Icon,
  iconFill,
  message,
  textColor,
  action,
  ...flexProps
}) => {
  return (
    <Flex px={2} justifyContent="center" flexDirection="row" {...flexProps}>
      <Flex flexDirection="row">
        <Icon mt="1px" fill={iconFill} />
        <Flex flexDirection="column" pl={1}>
          <Text color={textColor} variant="xs">
            {message}
            {!!action?.label && !!action?.onPress && (
              <>
                {". "}
                <LinkText variant="xs" onPress={action.onPress}>
                  {action.label}.
                </LinkText>
              </>
            )}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}
