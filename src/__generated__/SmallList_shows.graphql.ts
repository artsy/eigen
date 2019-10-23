/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SmallList_shows = ReadonlyArray<{
    readonly " $fragmentRefs": FragmentRefs<"ArtistShow_show">;
    readonly " $refType": "SmallList_shows";
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
      "kind": "FragmentSpread",
      "name": "ArtistShow_show",
      "args": null
    }
  ]
};
(node as any).hash = 'abd963551ffe3b4b5c864508bd74e6ba';
export default node;
