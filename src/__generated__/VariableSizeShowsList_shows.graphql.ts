/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type VariableSizeShowsList_shows = ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentRefs": FragmentRefs<"ArtistShow_show">;
    readonly " $refType": "VariableSizeShowsList_shows";
}>;



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "VariableSizeShowsList_shows",
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
(node as any).hash = 'eb42c123093e9a3a8eddd7f902a02673';
export default node;
