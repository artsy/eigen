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
var v0 = [
  "POPULAR_ARTISTS",
  "RECENTLY_VIEWED_WORKS",
  "SIMILAR_TO_RECENTLY_VIEWED"
],
v1 = {
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
          "name": "include",
          "value": (v0/*: any*/)
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
          "value": (v0/*: any*/)
        }
      ],
      "concreteType": "HomePageArtworkModule",
      "kind": "LinkedField",
      "name": "artworkModules",
      "plural": true,
      "selections": [
        (v1/*: any*/),
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ArtworkRail_rail"
        }
      ],
      "storageKey": "artworkModules(include:[\"POPULAR_ARTISTS\",\"RECENTLY_VIEWED_WORKS\",\"SIMILAR_TO_RECENTLY_VIEWED\"],maxFollowedGeneRails:-1,maxRails:-1,order:[\"POPULAR_ARTISTS\",\"RECENTLY_VIEWED_WORKS\",\"SIMILAR_TO_RECENTLY_VIEWED\"])"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "HomePageArtistModule",
      "kind": "LinkedField",
      "name": "artistModules",
      "plural": true,
      "selections": [
        (v1/*: any*/),
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
(node as any).hash = 'cdf201bd5c4d13902db851e3c40ca4f1';
export default node;
