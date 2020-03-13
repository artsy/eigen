/* tslint:disable */
/* eslint-disable */

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
  "kind": "Fragment",
  "name": "SmallList_shows",
  "type": "Show",
  "metadata": {
    "plural": true
  },
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtistShow_show",
      "args": null
    }
  ]
};
(node as any).hash = '889650254fc45453af3c0ed2b5498312';
export default node;
