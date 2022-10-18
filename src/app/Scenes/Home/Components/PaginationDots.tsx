import { Flex } from "palette"
import { Animated } from "react-native"

interface PaginationDotProps {
  active: boolean
}

const PaginationDot: React.FC<PaginationDotProps> = (props) => {
  const { active } = props
  const opacity = active ? 1 : 0.1
  const diameter = 5

  return (
    <Animated.View
      accessibilityLabel="Image Pagination Indicator"
      style={{
        backgroundColor: "black",
        borderRadius: diameter / 2,
        height: diameter,
        marginHorizontal: diameter * 0.8,
        opacity,
        width: diameter,
      }}
    />
  )
}

interface PaginationDotsProps {
  currentIndex: number
  length: number
}

export const PaginationDots: React.FC<PaginationDotsProps> = (props) => {
  const { currentIndex, length } = props

  return (
    <Flex flexDirection="row" justifyContent="center">
      {Array.from(Array(length)).map((_, index) => (
        <PaginationDot active={currentIndex === index} key={index} />
      ))}
    </Flex>
  )
}
