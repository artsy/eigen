import { ArtsyNativeModule } from "app/NativeModules/ArtsyNativeModule"
import { appJson } from "app/utils/jsonFiles"
import { compact } from "lodash"
import DeviceInfo from "react-native-device-info"

const getVersion = (
  options: { includeBuildMetadata: boolean } = { includeBuildMetadata: false }
) => {
  let version = appJson().version || DeviceInfo.getVersion()

  if (ArtsyNativeModule.isBetaOrDev) {
    version = `${version}-beta`
  }

  if (options.includeBuildMetadata) {
    return compact([version, buildMetadata()]).join("+")
  } else {
    return version
  }
}

const buildMetadata = () => {
  const buildNumber: string = DeviceInfo.getBuildNumber()
  const shortCommitSha: string = ArtsyNativeModule.gitCommitShortHash

  if (!!buildNumber) {
    return `build.${buildNumber}`
  } else if (!!shortCommitSha) {
    return `sha.${ArtsyNativeModule.gitCommitShortHash}`
  }
}

export default {
  getVersion,
}
