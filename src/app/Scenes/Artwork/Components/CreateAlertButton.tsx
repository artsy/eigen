import { Button } from "palette"

export const CreateAlertButton = () => {
  return (
    <Button block onPress={() => console.log("[debug] CreateAlertButton")}>
      Create Alert
    </Button>
  )
}
