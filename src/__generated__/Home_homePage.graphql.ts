/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Home_homePage = {
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
    readonly salesModule: {
        readonly " $fragmentRefs": FragmentRefs<"SalesRail_salesModule">;
    } | null;
    readonly marketingCollectionsModule: {
        readonly " $fragmentRefs": FragmentRefs<"CollectionsRail_collectionsModule">;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"HomeHero_homePage">;
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
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "heroImageVersion",
      "type": "HomePageHeroUnitImageVersion",
      "defaultValue": null
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artworkModules",
      "storageKey": "artworkModules(exclude:[\"GENERIC_GENES\",\"LIVE_AUCTIONS\",\"CURRENT_FAIRS\",\"RELATED_ARTISTS\",\"FOLLOWED_GENES\"],maxFollowedGeneRails:-1,maxRails:-1,order:[\"ACTIVE_BIDS\",\"FOLLOWED_ARTISTS\",\"RECENTLY_VIEWED_WORKS\",\"SAVED_WORKS\",\"RECOMMENDED_WORKS\",\"FOLLOWED_GALLERIES\"])",
      "args": [
        {
          "kind": "Literal",
          "name": "exclude",
          "value": [
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
            "ACTIVE_BIDS",
            "FOLLOWED_ARTISTS",
            "RECENTLY_VIEWED_WORKS",
            "SAVED_WORKS",
            "RECOMMENDED_WORKS",
            "FOLLOWED_GALLERIES"
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
      "alias": null,
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
      "alias": null,
      "name": "fairsModule",
      "storageKey": null,
      "args": null,
      "concreteType": "HomePageFairsModule",
      "plural": false,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "FairsRail_fairsModule",
          "args": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "salesModule",
      "storageKey": null,
      "args": null,
      "concreteType": "HomePageSalesModule",
      "plural": false,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "SalesRail_salesModule",
          "args": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "marketingCollectionsModule",
      "storageKey": null,
      "args": null,
      "concreteType": "HomePageMarketingCollectionsModule",
      "plural": false,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "CollectionsRail_collectionsModule",
          "args": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "HomeHero_homePage",
      "args": [
        {
          "kind": "Variable",
          "name": "heroImageVersion",
          "variableName": "heroImageVersion"
        }
      ]
    }
  ]
};
})();
(node as any).hash = '9db2e8b75668eab29e883f1b71ff16b3';
export default node;
