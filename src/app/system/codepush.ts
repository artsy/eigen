import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { Platform } from "react-native"
import codePush from "react-native-code-push"
import Config from "react-native-config"

const codePushCanaryKey =
  Platform.OS == "ios"
    ? Config.CODE_PUSH_IOS_CANARY_DEPLOYMENT_KEY
    : Config.CODE_PUSH_ANDROID_CANARY_DEPLOYMENT_KEY
const codePushStagingKey =
  Platform.OS == "ios"
    ? Config.CODE_PUSH_IOS_STAGING_DEPLOYMENT_KEY
    : Config.CODE_PUSH_ANDROID_STAGING_DEPLOYMENT_KEY
const codePushProdKey =
  Platform.OS == "ios"
    ? Config.CODE_PUSH_IOS_PRODUCTION_DEPLOYMENT_KEY
    : Config.CODE_PUSH_ANDROID_PRODUCTION_DEPLOYMENT_KEY

export const stagingKey = codePushStagingKey ?? "Staging_Key"
export const productionKey = codePushProdKey ?? "Production_Key"
export const canaryKey = codePushCanaryKey ?? "Canary_Key"

/**
 * CodePush options documented here: https://learn.microsoft.com/en-us/appcenter/distribution/codepush/rn-api-ref
 * We could for example show an update alert to the user when an update is available in betas.
 */

const options = () => {
  if (__TEST__) {
    return {}
  } else if (ArtsyNativeModule.isBetaOrDev) {
    return {
      deploymentKey: stagingKey,
      checkFrequency: codePush.CheckFrequency.MANUAL,
    }
  } else {
    return { deploymentKey: productionKey }
  }
}

export const codePushOptions = options()
