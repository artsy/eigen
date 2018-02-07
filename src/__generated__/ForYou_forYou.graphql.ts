/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type ForYou_forYou = {
    readonly artwork_modules: ReadonlyArray<({
            readonly __id: string;
        }) | null> | null;
    readonly artist_modules: ReadonlyArray<({
            readonly __id: string;
        }) | null> | null;
    readonly fairs_module: ({
    }) | null;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "ForYou_forYou",
  "type": "HomePage",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artwork_modules",
      "storageKey": "artwork_modules(exclude:[\"FOLLOWED_ARTISTS\"],max_followed_gene_rails:-1,max_rails:-1,order:[\"ACTIVE_BIDS\",\"RECOMMENDED_WORKS\",\"FOLLOWED_ARTISTS\",\"RELATED_ARTISTS\",\"FOLLOWED_GALLERIES\",\"SAVED_WORKS\",\"LIVE_AUCTIONS\",\"CURRENT_FAIRS\",\"FOLLOWED_GENES\",\"GENERIC_GENES\"])",
      "args": [
        {
          "kind": "Literal",
          "name": "exclude",
          "value": [
            "FOLLOWED_ARTISTS"
          ],
          "type": "[HomePageArtworkModuleTypes]"
        },
        {
          "kind": "Literal",
          "name": "max_followed_gene_rails",
          "value": -1,
          "type": "Int"
        },
        {
          "kind": "Literal",
          "name": "max_rails",
          "value": -1,
          "type": "Int"
        },
        {
          "kind": "Literal",
          "name": "order",
          "value": [
            "ACTIVE_BIDS",
            "RECOMMENDED_WORKS",
            "FOLLOWED_ARTISTS",
            "RELATED_ARTISTS",
            "FOLLOWED_GALLERIES",
            "SAVED_WORKS",
            "LIVE_AUCTIONS",
            "CURRENT_FAIRS",
            "FOLLOWED_GENES",
            "GENERIC_GENES"
          ],
          "type": "[HomePageArtworkModuleTypes]"
        }
      ],
      "concreteType": "HomePageArtworkModule",
      "plural": true,
      "selections": [
        v0,
        {
          "kind": "FragmentSpread",
          "name": "ArtworkCarousel_rail",
          "args": null
        }
      ],
      "idField": "__id"
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artist_modules",
      "storageKey": null,
      "args": null,
      "concreteType": "HomePageArtistModule",
      "plural": true,
      "selections": [
        v0,
        {
          "kind": "FragmentSpread",
          "name": "ArtistRail_rail",
          "args": null
        }
      ],
      "idField": "__id"
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "fairs_module",
      "storageKey": null,
      "args": null,
      "concreteType": "HomePageFairsModule",
      "plural": false,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "FairsRail_fairs_module",
          "args": null
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'c3546ea7aa3d522db8cb254838ab3898';
export default node;
