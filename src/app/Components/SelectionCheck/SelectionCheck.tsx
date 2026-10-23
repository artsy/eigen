import { CheckmarkIcon } from "@artsy/icons/native"
import { Flex } from "@artsy/palette-mobile"

const SIZE = 24

interface SelectionCheckProps {
  checked: boolean
}

export const SelectionCheck: React.FC<SelectionCheckProps> = ({ checked }) => {
  return (
    <Flex
      width={SIZE}
      height={SIZE}
      borderRadius={SIZE / 2}
      borderWidth={1}
      borderColor={checked ? "blue100" : "mono30"}
      bg={checked ? "blue100" : "mono0"}
      alignItems="center"
      justifyContent="center"
    >
      {!!checked && <CheckmarkIcon fill="mono0" width={16} height={16} />}
    </Flex>
  )
}
