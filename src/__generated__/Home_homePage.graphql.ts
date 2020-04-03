/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Home_homePage = {
    readonly artwork_modules: ReadonlyArray<{
        readonly id: string;
        readonly " $fragmentRefs": FragmentRefs<"ArtworkRail_rail">;
    } | null> | null;
    readonly artist_modules: ReadonlyArray<{
        readonly id: string;
        readonly " $fragmentRefs": FragmentRefs<"ArtistRail_rail">;
    } | null> | null;
    readonly fairs_module: {
        readonly " $fragmentRefs": FragmentRefs<"FairsRail_fairs_module">;
    } | null;
    readonly " $refType": "Home_homePage";
};
export type Home_homePage$data = Home_homePage;
export type Home_homePage$key = {
    readonly " $data"?: Home_homePage$data;
    readonly " $fragmentRefs": FragmentRefs<"Home_homePage">;
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
  "name": "Home_homePage",
  "type": "HomePage",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": "artwork_modules",
      "name": "artworkModules",
      "storageKey": "artworkModules(exclude:[\"GENERIC_GENES\"],maxFollowedGeneRails:-1,maxRails:-1,order:[\"ACTIVE_BIDS\",\"RECENTLY_VIEWED_WORKS\",\"RECOMMENDED_WORKS\",\"FOLLOWED_ARTISTS\",\"RELATED_ARTISTS\",\"FOLLOWED_GALLERIES\",\"SAVED_WORKS\",\"LIVE_AUCTIONS\",\"CURRENT_FAIRS\",\"FOLLOWED_GENES\"])",
      "args": [
        {
          "kind": "Literal",
          "name": "exclude",
          "value": [
            "GENERIC_GENES"
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
            "FOLLOWED_GENES"
          ]
        }
      ],
      "concreteType": "HomePageArtworkModule",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        {
          "kind": "FragmentSpread",
          "name": "ArtworkRail_rail",
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
(node as any).hash = 'f7b5e14765605c53a686225bc95fed33';
export default node;
