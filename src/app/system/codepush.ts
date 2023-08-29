import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import codePush from "react-native-code-push"
import Config from "react-native-config"

export const codePushOptions = ArtsyNativeModule.isBetaOrDev
  ? {
      deploymentKey: Config.CODE_PUSH_STAGING_DEPLOYMENT_KEY,
      checkFrequency: codePush.CheckFrequency.MANUAL,
    }
  : { deploymentKey: Config.CODE_PUSH_PRODUCTION_DEPLOYMENT_KEY }
