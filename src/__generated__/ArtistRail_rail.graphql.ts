/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { ArtistCard_artist$ref } from "./ArtistCard_artist.graphql";
declare const _ArtistRail_rail$ref: unique symbol;
export type ArtistRail_rail$ref = typeof _ArtistRail_rail$ref;
export type ArtistRail_rail = {
    readonly id: string;
    readonly key: string | null;
    readonly results: ReadonlyArray<({
        readonly internalID: string;
        readonly id: string;
        readonly " $fragmentRefs": ArtistCard_artist$ref;
    }) | null> | null;
    readonly " $refType": ArtistRail_rail$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": "__id",
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
    v0,
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
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "internalID",
          "args": null,
          "storageKey": null
        },
        v0,
        {
          "kind": "FragmentSpread",
          "name": "ArtistCard_artist",
          "args": null
        },
        v1
      ]
    },
    v1
  ]
};
})();
(node as any).hash = '834ab0d3fd94bf2132231c51d2b699cb';
export default node;
