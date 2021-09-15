/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Home_homePageBelow = {
    readonly artworkModules: ReadonlyArray<{
        readonly id: string;
        readonly " $fragmentRefs": FragmentRefs<"ArtworkRail_rail">;
    } | null> | null;
    readonly artistModules: ReadonlyArray<{
        readonly id: string;
        readonly " $fragmentRefs": FragmentRefs<"ArtistRail_rail">;
    } | null> | null;
    readonly fairsModule: {
        readonly " $fragmentRefs": FragmentRefs<"FairsRail_fairsModule">;
    } | null;
    readonly marketingCollectionsModule: {
        readonly " $fragmentRefs": FragmentRefs<"CollectionsRail_collectionsModule">;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"HomeHero_homePage">;
    readonly " $refType": "Home_homePageBelow";
};
export type Home_homePageBelow$data = Home_homePageBelow;
export type Home_homePageBelow$key = {
    readonly " $data"?: Home_homePageBelow$data;
    readonly " $fragmentRefs": FragmentRefs<"Home_homePageBelow">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "heroImageVersion"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "Home_homePageBelow",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "exclude",
          "value": [
            "ACTIVE_BIDS",
            "FOLLOWED_ARTISTS",
            "FOLLOWED_GALLERIES",
            "SAVED_WORKS",
            "GENERIC_GENES",
            "LIVE_AUCTIONS",
            "CURRENT_FAIRS",
            "RELATED_ARTISTS",
            "FOLLOWED_GENES"
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
            "RECOMMENDED_WORKS",
            "FOLLOWED_GALLERIES",
            "RECENTLY_VIEWED_WORKS"
          ]
        }
      ],
      "concreteType": "HomePageArtworkModule",
      "kind": "LinkedField",
      "name": "artworkModules",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ArtworkRail_rail"
        }
      ],
      "storageKey": "artworkModules(exclude:[\"ACTIVE_BIDS\",\"FOLLOWED_ARTISTS\",\"FOLLOWED_GALLERIES\",\"SAVED_WORKS\",\"GENERIC_GENES\",\"LIVE_AUCTIONS\",\"CURRENT_FAIRS\",\"RELATED_ARTISTS\",\"FOLLOWED_GENES\"],maxFollowedGeneRails:-1,maxRails:-1,order:[\"RECOMMENDED_WORKS\",\"FOLLOWED_GALLERIES\",\"RECENTLY_VIEWED_WORKS\"])"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "HomePageArtistModule",
      "kind": "LinkedField",
      "name": "artistModules",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ArtistRail_rail"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "HomePageFairsModule",
      "kind": "LinkedField",
      "name": "fairsModule",
      "plural": false,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "FairsRail_fairsModule"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "HomePageMarketingCollectionsModule",
      "kind": "LinkedField",
      "name": "marketingCollectionsModule",
      "plural": false,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "CollectionsRail_collectionsModule"
        }
      ],
      "storageKey": null
    },
    {
      "args": [
        {
          "kind": "Variable",
          "name": "heroImageVersion",
          "variableName": "heroImageVersion"
        }
      ],
      "kind": "FragmentSpread",
      "name": "HomeHero_homePage"
    }
  ],
  "type": "HomePage",
  "abstractKey": null
};
})();
(node as any).hash = '41a192c881370261c77d305716f7f080';
export default node;
