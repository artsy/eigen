import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import codePush from "react-native-code-push"
import Config from "react-native-config"

/**
 * CodePush options documented here: https://learn.microsoft.com/en-us/appcenter/distribution/codepush/rn-api-ref
 * We could for example show an update alert to the user when an update is available in betas.
 */
export const codePushOptions = ArtsyNativeModule.isBetaOrDev
  ? {
      deploymentKey: Config.CODE_PUSH_STAGING_DEPLOYMENT_KEY,
      checkFrequency: codePush.CheckFrequency.MANUAL,
    }
  : { deploymentKey: Config.CODE_PUSH_PRODUCTION_DEPLOYMENT_KEY }
