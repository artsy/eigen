import { Flex, useColor } from "@artsy/palette-mobile"
import { MotiView } from "moti"

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

interface PaginationDotProps {
  active: boolean
}

const PaginationDot: React.FC<PaginationDotProps> = (props) => {
  const color = useColor()
  const { active } = props
  const diameter = 5

  return (
    <MotiView
      accessibilityLabel="Image Pagination Indicator"
      animate={{ opacity: active ? 1 : 0.1 }}
      style={{
        backgroundColor: color("black100"),
        borderRadius: diameter / 2,
        height: diameter,
        marginHorizontal: diameter * 0.8,
        width: diameter,
      }}
    />
  )
}
