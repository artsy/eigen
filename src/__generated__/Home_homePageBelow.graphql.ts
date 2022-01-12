/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Home_homePageBelow = {
    readonly recentlyViewedWorksArtworkModule: {
        readonly id: string;
        readonly " $fragmentRefs": FragmentRefs<"ArtworkHomeRail_rail">;
    } | null;
    readonly similarToRecentlyViewedArtworkModule: {
        readonly id: string;
        readonly " $fragmentRefs": FragmentRefs<"ArtworkHomeRail_rail">;
    } | null;
    readonly popularArtistsArtistModule: {
        readonly id: string;
        readonly " $fragmentRefs": FragmentRefs<"ArtistRail_rail">;
    } | null;
    readonly fairsModule: {
        readonly " $fragmentRefs": FragmentRefs<"FairsRail_fairsModule">;
    } | null;
    readonly marketingCollectionsModule: {
        readonly " $fragmentRefs": FragmentRefs<"CollectionsRail_collectionsModule">;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"HomeHero_homePage" | "Trove_trove">;
    readonly " $refType": "Home_homePageBelow";
};
export type Home_homePageBelow$data = Home_homePageBelow;
export type Home_homePageBelow$key = {
    readonly " $data"?: Home_homePageBelow$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"Home_homePageBelow">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  (v0/*: any*/),
  {
    "args": null,
    "kind": "FragmentSpread",
    "name": "ArtworkHomeRail_rail"
  }
],
v2 = [
  {
    "kind": "Variable",
    "name": "heroImageVersion",
    "variableName": "heroImageVersion"
  }
];
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
      "alias": "recentlyViewedWorksArtworkModule",
      "args": [
        {
          "kind": "Literal",
          "name": "key",
          "value": "RECENTLY_VIEWED_WORKS"
        }
      ],
      "concreteType": "HomePageArtworkModule",
      "kind": "LinkedField",
      "name": "artworkModule",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": "artworkModule(key:\"RECENTLY_VIEWED_WORKS\")"
    },
    {
      "alias": "similarToRecentlyViewedArtworkModule",
      "args": [
        {
          "kind": "Literal",
          "name": "key",
          "value": "SIMILAR_TO_RECENTLY_VIEWED"
        }
      ],
      "concreteType": "HomePageArtworkModule",
      "kind": "LinkedField",
      "name": "artworkModule",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": "artworkModule(key:\"SIMILAR_TO_RECENTLY_VIEWED\")"
    },
    {
      "alias": "popularArtistsArtistModule",
      "args": [
        {
          "kind": "Literal",
          "name": "key",
          "value": "POPULAR"
        }
      ],
      "concreteType": "HomePageArtistModule",
      "kind": "LinkedField",
      "name": "artistModule",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ArtistRail_rail"
        }
      ],
      "storageKey": "artistModule(key:\"POPULAR\")"
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
      "args": (v2/*: any*/),
      "kind": "FragmentSpread",
      "name": "HomeHero_homePage"
    },
    {
      "args": (v2/*: any*/),
      "kind": "FragmentSpread",
      "name": "Trove_trove"
    }
  ],
  "type": "HomePage",
  "abstractKey": null
};
})();
(node as any).hash = 'e18561e4a92f34ff80fab7d671cece1c';
export default node;
