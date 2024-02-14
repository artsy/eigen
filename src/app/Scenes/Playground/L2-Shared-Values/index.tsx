import App1 from "app/Scenes/Playground/L2-Shared-Values/App1"
import App2 from "app/Scenes/Playground/L2-Shared-Values/App2"
import App3 from "app/Scenes/Playground/L2-Shared-Values/App3"
import App4 from "app/Scenes/Playground/L2-Shared-Values/App4"
import App5 from "app/Scenes/Playground/L2-Shared-Values/App5"

// eslint-disable-next-line prefer-const
let LEVEL = 5

export default function App() {
  switch (LEVEL) {
    // Defining the shared value
    case 1:
      return <App1 />
    // Updating the shared value (1)
    case 2:
      return <App2 />
    // Updating the shared value (2)
    case 3:
      return <App3 />
    case 4:
      return <App4 />
    case 5:
      return <App5 />
    default:
      return null
  }
}
