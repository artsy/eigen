import { Plugin, PluginType, SegmentEvent } from "@segment/analytics-react-native"

export class AddAppNamePlugin extends Plugin {
  type = PluginType.enrichment

  async execute(event: SegmentEvent) {
    event.context = event.context || {}
    event.context.app = event.context.app || {}
    event.context.app.name = "eigen"
    return event
  }
}
