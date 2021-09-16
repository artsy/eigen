import { Echo } from "lib/store/config/EchoModel"
import appJsonFile from "../../../app.json"
import echoLaunchJsonFile from "../../../data/EchoNew.json"

export const appJson = () => appJsonFile
export const echoLaunchJson = (): Echo => echoLaunchJsonFile
