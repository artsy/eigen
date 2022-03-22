import { Button } from "palette"
import { ButtonProps } from "palette"

export const CTAButton: React.FC<ButtonProps> = (props) => (
  <Button block haptic maxWidth={540} {...props} />
)
