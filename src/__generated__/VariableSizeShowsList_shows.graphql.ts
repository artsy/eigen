/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type VariableSizeShowsList_shows = ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentRefs": FragmentRefs<"ArtistShow_show">;
    readonly " $refType": "VariableSizeShowsList_shows";
}>;
export type VariableSizeShowsList_shows$data = VariableSizeShowsList_shows;
export type VariableSizeShowsList_shows$key = ReadonlyArray<{
    readonly " $data"?: VariableSizeShowsList_shows$data;
    readonly " $fragmentRefs": FragmentRefs<"VariableSizeShowsList_shows">;
}>;



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "VariableSizeShowsList_shows",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtistShow_show"
    }
  ],
  "type": "Show",
  "abstractKey": null
};
(node as any).hash = 'eb42c123093e9a3a8eddd7f902a02673';
export default node;
