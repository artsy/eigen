import { metadata, withArtist, withLocation, withMetadata, withOnePhoto, withPhotos } from "./consignmentSetups"

import TODO from "../Components/ArtworkConsignmentTodo"
import { ConsignmentSetup } from "../index"

export const name = "Consignments/TODO Component"
export const component = TODO

interface States {
  [name: string]: ConsignmentSetup
}

const withProvenance: ConsignmentSetup = {
  ...withLocation,
  provenance: "This work has seen many hands.",
}

const longProv = "This is a long long long run on sentence that should break correctly."

export const allStates: States[] = [
  { "Empty Metadata": {} },
  { "With Artist": withArtist },
  { "With Photos": withPhotos },
  { "With Metadata": withMetadata },
  { "With Location": withMetadata },
  { "With Provenance": withProvenance },
  { "With Just Metadata": { metadata } },
  { "With One": withOnePhoto },
  { "With Long": { provenance: longProv } },
]
