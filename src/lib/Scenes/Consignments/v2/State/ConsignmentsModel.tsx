import { ConsignmentsArtworkModel } from "./ConsignmentsArtworkModel"
import { ConsignmentsNavigationModel } from "./ConsignmentsNavigationModel"

export interface ConsignmentsModel {
  artwork: ConsignmentsArtworkModel
  navigation: ConsignmentsNavigationModel
}

export const ConsignmentsModel: ConsignmentsModel = {
  artwork: ConsignmentsArtworkModel,
  navigation: ConsignmentsNavigationModel,
}
