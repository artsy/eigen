/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ArtistRail_rail$ref } from "./ArtistRail_rail.graphql";
import { ArtworkCarousel_rail$ref } from "./ArtworkCarousel_rail.graphql";
import { FairsRail_fairs_module$ref } from "./FairsRail_fairs_module.graphql";
declare const _ForYou_forYou$ref: unique symbol;
export type ForYou_forYou$ref = typeof _ForYou_forYou$ref;
export type ForYou_forYou = {
    readonly artwork_modules: ReadonlyArray<({
        readonly __id: string;
        readonly " $fragmentRefs": ArtworkCarousel_rail$ref;
    }) | null> | null;
    readonly artist_modules: ReadonlyArray<({
        readonly __id: string;
        readonly " $fragmentRefs": ArtistRail_rail$ref;
    }) | null> | null;
    readonly fairs_module: ({
        readonly " $fragmentRefs": FairsRail_fairs_module$ref;
    }) | null;
    readonly " $refType": ForYou_forYou$ref;
};



const node: ReaderFragment = (function(){
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
      "storageKey": "artwork_modules(exclude:[\"FOLLOWED_ARTISTS\"],max_followed_gene_rails:-1,max_rails:-1,order:[\"ACTIVE_BIDS\",\"RECENTLY_VIEWED_WORKS\",\"RECOMMENDED_WORKS\",\"FOLLOWED_ARTISTS\",\"RELATED_ARTISTS\",\"FOLLOWED_GALLERIES\",\"SAVED_WORKS\",\"LIVE_AUCTIONS\",\"CURRENT_FAIRS\",\"FOLLOWED_GENES\",\"GENERIC_GENES\"])",
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
            "RECENTLY_VIEWED_WORKS",
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
        (v0/*: any*/),
        {
          "kind": "FragmentSpread",
          "name": "ArtworkCarousel_rail",
          "args": null
        }
      ]
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
        (v0/*: any*/),
        {
          "kind": "FragmentSpread",
          "name": "ArtistRail_rail",
          "args": null
        }
      ]
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
(node as any).hash = '99fc1da2b9295af0f99d8960f0ca78e6';
export default node;
