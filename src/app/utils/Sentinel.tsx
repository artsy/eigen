import { Flex } from "@artsy/palette-mobile"
import VisibilitySensor from "@svanboxel/visibility-sensor-react-native"

export const Sentinel: React.FC<{ onAppear: (visible: boolean) => void }> = ({ onAppear }) => {
  return (
    <VisibilitySensor onChange={onAppear}>
      <Flex height={0} />
    </VisibilitySensor>
  )
}
