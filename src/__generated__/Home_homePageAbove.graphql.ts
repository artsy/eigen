/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Home_homePageAbove = {
    readonly followedArtistsArtworkModule: {
        readonly id: string;
        readonly " $fragmentRefs": FragmentRefs<"ArtworkRail_rail">;
    } | null;
    readonly activeBidsArtworkModule: {
        readonly id: string;
        readonly " $fragmentRefs": FragmentRefs<"ArtworkRail_rail">;
    } | null;
    readonly salesModule: {
        readonly " $fragmentRefs": FragmentRefs<"SalesRail_salesModule">;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"HomeHero_homePage">;
    readonly " $refType": "Home_homePageAbove";
};
export type Home_homePageAbove$data = Home_homePageAbove;
export type Home_homePageAbove$key = {
    readonly " $data"?: Home_homePageAbove$data;
    readonly " $fragmentRefs": FragmentRefs<"Home_homePageAbove">;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "id",
    "storageKey": null
  },
  {
    "args": null,
    "kind": "FragmentSpread",
    "name": "ArtworkRail_rail"
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
  "name": "Home_homePageAbove",
  "selections": [
    {
      "alias": "followedArtistsArtworkModule",
      "args": [
        {
          "kind": "Literal",
          "name": "key",
          "value": "FOLLOWED_ARTISTS"
        }
      ],
      "concreteType": "HomePageArtworkModule",
      "kind": "LinkedField",
      "name": "artworkModule",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": "artworkModule(key:\"FOLLOWED_ARTISTS\")"
    },
    {
      "alias": "activeBidsArtworkModule",
      "args": [
        {
          "kind": "Literal",
          "name": "key",
          "value": "ACTIVE_BIDS"
        }
      ],
      "concreteType": "HomePageArtworkModule",
      "kind": "LinkedField",
      "name": "artworkModule",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": "artworkModule(key:\"ACTIVE_BIDS\")"
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "HomePageSalesModule",
      "kind": "LinkedField",
      "name": "salesModule",
      "plural": false,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "SalesRail_salesModule"
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
(node as any).hash = 'a0678d231be4029852f0a6690d182107';
export default node;
