/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkHistory_artwork = {
    readonly provenance: string | null;
    readonly exhibitionHistory: string | null;
    readonly literature: string | null;
    readonly " $refType": "ArtworkHistory_artwork";
};
export type ArtworkHistory_artwork$data = ArtworkHistory_artwork;
export type ArtworkHistory_artwork$key = {
    readonly " $data"?: ArtworkHistory_artwork$data | undefined;
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
      "alias": null,
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
(node as any).hash = '0cde93b94926cb77be4875a37b911854';
export default node;
