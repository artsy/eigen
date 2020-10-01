/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkHistory_artwork = {
    readonly provenance: string | null;
    readonly exhibition_history: string | null;
    readonly literature: string | null;
    readonly " $refType": "ArtworkHistory_artwork";
};
export type ArtworkHistory_artwork$data = ArtworkHistory_artwork;
export type ArtworkHistory_artwork$key = {
    readonly " $data"?: ArtworkHistory_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkHistory_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtworkHistory_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "provenance",
      "storageKey": null
    },
    {
      "alias": "exhibition_history",
      "args": null,
      "kind": "ScalarField",
      "name": "exhibitionHistory",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "literature",
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = 'b561cdd312ffb04041aa29c255b52d2b';
export default node;
