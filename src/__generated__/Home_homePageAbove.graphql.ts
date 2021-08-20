/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Home_homePageAbove = {
    readonly artworkModules: ReadonlyArray<{
        readonly id: string;
        readonly " $fragmentRefs": FragmentRefs<"ArtworkRail_rail">;
    } | null> | null;
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
  "ACTIVE_BIDS",
  "FOLLOWED_ARTISTS",
  "RECENTLY_VIEWED_WORKS"
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
          "value": 2
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
      ],
      "storageKey": "artworkModules(include:[\"ACTIVE_BIDS\",\"FOLLOWED_ARTISTS\",\"RECENTLY_VIEWED_WORKS\"],maxFollowedGeneRails:-1,maxRails:2,order:[\"ACTIVE_BIDS\",\"FOLLOWED_ARTISTS\",\"RECENTLY_VIEWED_WORKS\"])"
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
(node as any).hash = 'fbc3b790f1ff3ff2765d6d87ae35dee4';
export default node;
