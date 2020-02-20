/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistRail_rail = {
    readonly id: string;
    readonly key: string | null;
    readonly results: ReadonlyArray<{
        readonly id: string;
        readonly internalID: string;
        readonly " $fragmentRefs": FragmentRefs<"ArtistCard_artist">;
    } | null> | null;
    readonly " $refType": "ArtistRail_rail";
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "ArtistRail_rail",
  "type": "HomePageArtistModule",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "key",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "results",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "internalID",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "FragmentSpread",
          "name": "ArtistCard_artist",
          "args": null
        }
      ]
    }
  ]
};
})();
(node as any).hash = '74248d2c9835a7cd34a3222920187bfc';
export default node;
