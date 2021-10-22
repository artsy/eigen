/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RecentlyViewedWorksRail_homePage = {
    readonly artworkModules: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"ArtworkRail_rail">;
    } | null> | null;
    readonly " $refType": "RecentlyViewedWorksRail_homePage";
};
export type RecentlyViewedWorksRail_homePage$data = RecentlyViewedWorksRail_homePage;
export type RecentlyViewedWorksRail_homePage$key = {
    readonly " $data"?: RecentlyViewedWorksRail_homePage$data;
    readonly " $fragmentRefs": FragmentRefs<"RecentlyViewedWorksRail_homePage">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RecentlyViewedWorksRail_homePage",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "include",
          "value": [
            "RECENTLY_VIEWED_WORKS"
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
        }
      ],
      "concreteType": "HomePageArtworkModule",
      "kind": "LinkedField",
      "name": "artworkModules",
      "plural": true,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ArtworkRail_rail"
        }
      ],
      "storageKey": "artworkModules(include:[\"RECENTLY_VIEWED_WORKS\"],maxFollowedGeneRails:-1,maxRails:-1)"
    }
  ],
  "type": "HomePage",
  "abstractKey": null
};
(node as any).hash = 'fac429a61873bc7c7b66e255f01cfc9e';
export default node;
