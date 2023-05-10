import { MoreIcon } from "@artsy/palette-mobile"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { goBack } from "app/system/navigation/navigate"

const EditHeaderButton = () => <MoreIcon fill="black100" width={24} height={24} />

export const ArtworkListHeader = () => {
  return (
    <FancyModalHeader
      onLeftButtonPress={goBack}
      renderRightButton={EditHeaderButton}
      onRightButtonPress={() => console.log("ALARM")}
      hideBottomDivider
    />
  )
}
