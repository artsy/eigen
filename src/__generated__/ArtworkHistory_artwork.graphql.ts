/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type ArtworkHistory_artwork = {
    readonly provenance: string | null;
    readonly exhibition_history: string | null;
    readonly literature: string | null;
    readonly " $refType": "ArtworkHistory_artwork";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtworkHistory_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "provenance",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "exhibition_history",
      "name": "exhibitionHistory",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "literature",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'b561cdd312ffb04041aa29c255b52d2b';
export default node;
