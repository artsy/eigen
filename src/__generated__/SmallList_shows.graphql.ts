/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SmallList_shows = ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentRefs": FragmentRefs<"ArtistShow_show">;
    readonly " $refType": "SmallList_shows";
}>;
export type SmallList_shows$data = SmallList_shows;
export type SmallList_shows$key = ReadonlyArray<{
    readonly " $data"?: SmallList_shows$data;
    readonly " $fragmentRefs": FragmentRefs<"SmallList_shows">;
}>;



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "SmallList_shows",
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
(node as any).hash = '889650254fc45453af3c0ed2b5498312';
export default node;
