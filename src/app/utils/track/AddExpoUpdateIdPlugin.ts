import { Plugin, PluginType, SegmentEvent } from "@segment/analytics-react-native"
import * as Updates from "expo-updates"

export class AddExpoUpdateIdPlugin extends Plugin {
  type = PluginType.enrichment

  async execute(event: SegmentEvent) {
    if (Updates.isEmbeddedLaunch || !Updates.updateId) {
      return event
    }

    event.context = event.context || {}
    const app = { ...(event.context.app || {}), expoUpdateId: Updates.updateId }
    event.context.app = app

    return event
  }
}
