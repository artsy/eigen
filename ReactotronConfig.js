import AsyncStorage from "@react-native-async-storage/async-storage"
import Reactotron, {
  networking,
  openInEditor,
  trackGlobalErrors,
  asyncStorage,
} from "reactotron-react-native"

Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure() // controls connection & communication settings
  .useReactNative() // add all built-in react native plugins
  .use(networking())
  .use(openInEditor())
  .use(trackGlobalErrors())
  .use(asyncStorage())
  .connect() // let's connect!
