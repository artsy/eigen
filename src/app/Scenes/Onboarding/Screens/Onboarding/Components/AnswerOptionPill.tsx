import { Flex, Text } from "@artsy/palette-mobile"
import { MotiPressable } from "moti/interactions"
import { useMemo, useState } from "react"

interface AnswerOptionPillProps {
  label: string
  selected: boolean
  onPress: () => void
}

export const AnswerOptionPill: React.FC<AnswerOptionPillProps> = ({ label, selected, onPress }) => {
  const [isMultiline, setIsMultiline] = useState(false)

  const animate = useMemo(() => {
    return ({ hovered, pressed }: { hovered: boolean; pressed: boolean }) => {
      "worklet"
      return { opacity: hovered || pressed ? 0.5 : 1 }
    }
  }, [])

  return (
    <MotiPressable onPress={onPress} animate={animate}>
      <Flex
        alignSelf="flex-start"
        alignItems="center"
        justifyContent="center"
        borderRadius={20}
        borderWidth={1}
        borderColor={selected ? "blue100" : "mono60"}
        backgroundColor={selected ? "blue100" : undefined}
        px="15px"
        py="10px"
      >
        <Text
          variant="xs"
          color="mono0"
          textAlign={isMultiline ? "left" : "center"}
          onTextLayout={(event) => setIsMultiline(event.nativeEvent.lines.length > 1)}
        >
          {label}
        </Text>
      </Flex>
    </MotiPressable>
  )
}
