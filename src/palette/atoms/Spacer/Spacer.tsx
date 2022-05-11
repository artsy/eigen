import { HeightProps, SpaceProps, WidthProps } from "styled-system"
import { Box } from "../../elements/Box"

export interface SpacerProps extends SpaceProps, WidthProps, HeightProps {
  x?: SpaceProps["ml"]
  y?: SpaceProps["mt"]
}

/** A component used to inject space where it's needed */
export const Spacer: React.FC<SpacerProps & { id?: string }> = ({ x, y, ...props }) => {
  return <Box ml={x ?? props.ml} mt={y ?? props.mt} {...props} />
}

Spacer.displayName = "Spacer"
