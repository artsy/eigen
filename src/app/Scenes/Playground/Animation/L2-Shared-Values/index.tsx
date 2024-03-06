import { SharedValuesLevel1 } from "app/Scenes/Playground/Animation/L2-Shared-Values/App1"
import { SharedValuesLevel2 } from "app/Scenes/Playground/Animation/L2-Shared-Values/App2"
import { SharedValuesLevel3 } from "app/Scenes/Playground/Animation/L2-Shared-Values/App3"
import { SharedValuesLevel4 } from "app/Scenes/Playground/Animation/L2-Shared-Values/App4"
import { SharedValuesLevel5 } from "app/Scenes/Playground/Animation/L2-Shared-Values/App5"

// eslint-disable-next-line prefer-const
let LEVEL = 1

export const L2SharedValues: React.FC<{}> = () => {
  switch (LEVEL) {
    // Defining the shared value
    case 1:
      return <SharedValuesLevel1 />
    // Updating the shared value (1)
    case 2:
      return <SharedValuesLevel2 />
    // Updating the shared value (2)
    case 3:
      return <SharedValuesLevel3 />
    case 4:
      return <SharedValuesLevel4 />
    case 5:
      return <SharedValuesLevel5 />
    default:
      return null
  }
}
