/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkInsights_artist = {
    readonly id: string;
    readonly " $refType": "MyCollectionArtworkInsights_artist";
};
export type MyCollectionArtworkInsights_artist$data = MyCollectionArtworkInsights_artist;
export type MyCollectionArtworkInsights_artist$key = {
    readonly " $data"?: MyCollectionArtworkInsights_artist$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkInsights_artist">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MyCollectionArtworkInsights_artist",
  "type": "Artist",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'baeee2685c9aaeef660c270ddf1fdeb7';
export default node;
