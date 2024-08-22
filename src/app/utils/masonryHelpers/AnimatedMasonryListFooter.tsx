import { Flex, Spinner } from "@artsy/palette-mobile"
import { motify } from "moti"

interface MasonryListFooterComponentProps {
  shouldDisplaySpinner: boolean
}

const MotiFlex = motify(Flex)()

export const AnimatedMasonryListFooter: React.FC<MasonryListFooterComponentProps> = ({
  shouldDisplaySpinner,
}) => {
  return (
    <MotiFlex
      my={4}
      flexDirection="row"
      justifyContent="center"
      from={{ opacity: shouldDisplaySpinner ? 1 : 0 }}
    >
      <Spinner />
    </MotiFlex>
  )
}
