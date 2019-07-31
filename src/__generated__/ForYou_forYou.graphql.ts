/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ArtistRail_rail$ref } from "./ArtistRail_rail.graphql";
import { ArtworkCarousel_rail$ref } from "./ArtworkCarousel_rail.graphql";
import { FairsRail_fairs_module$ref } from "./FairsRail_fairs_module.graphql";
declare const _ForYou_forYou$ref: unique symbol;
export type ForYou_forYou$ref = typeof _ForYou_forYou$ref;
export type ForYou_forYou = {
    readonly artwork_modules: ReadonlyArray<{
        readonly id: string;
        readonly " $fragmentRefs": ArtworkCarousel_rail$ref;
    } | null> | null;
    readonly artist_modules: ReadonlyArray<{
        readonly id: string;
        readonly " $fragmentRefs": ArtistRail_rail$ref;
    } | null> | null;
    readonly fairs_module: {
        readonly " $fragmentRefs": FairsRail_fairs_module$ref;
    } | null;
    readonly " $refType": ForYou_forYou$ref;
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
  "name": "ForYou_forYou",
  "type": "HomePage",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": "artwork_modules",
      "name": "artworkModules",
      "storageKey": "artworkModules(exclude:[\"FOLLOWED_ARTISTS\"],maxFollowedGeneRails:-1,maxRails:-1,order:[\"ACTIVE_BIDS\",\"RECENTLY_VIEWED_WORKS\",\"RECOMMENDED_WORKS\",\"FOLLOWED_ARTISTS\",\"RELATED_ARTISTS\",\"FOLLOWED_GALLERIES\",\"SAVED_WORKS\",\"LIVE_AUCTIONS\",\"CURRENT_FAIRS\",\"FOLLOWED_GENES\",\"GENERIC_GENES\"])",
      "args": [
        {
          "kind": "Literal",
          "name": "exclude",
          "value": [
            "FOLLOWED_ARTISTS"
          ]
        },
        {
          "kind": "Literal",
          "name": "maxFollowedGeneRails",
          "value": -1
        },
        {
          "kind": "Literal",
          "name": "maxRails",
          "value": -1
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
          ]
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
      "alias": "artist_modules",
      "name": "artistModules",
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
      "alias": "fairs_module",
      "name": "fairsModule",
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
(node as any).hash = 'b9a9ff5a72a7c5ec937a3dda72678564';
export default node;
