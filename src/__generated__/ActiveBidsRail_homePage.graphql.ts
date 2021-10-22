/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ActiveBidsRail_homePage = {
    readonly artworkModules: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"ArtworkRail_rail">;
    } | null> | null;
    readonly " $refType": "ActiveBidsRail_homePage";
};
export type ActiveBidsRail_homePage$data = ActiveBidsRail_homePage;
export type ActiveBidsRail_homePage$key = {
    readonly " $data"?: ActiveBidsRail_homePage$data;
    readonly " $fragmentRefs": FragmentRefs<"ActiveBidsRail_homePage">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ActiveBidsRail_homePage",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "include",
          "value": [
            "ACTIVE_BIDS"
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
      "storageKey": "artworkModules(include:[\"ACTIVE_BIDS\"],maxFollowedGeneRails:-1,maxRails:-1)"
    }
  ],
  "type": "HomePage",
  "abstractKey": null
};
(node as any).hash = 'd141a0f30e6287b23c1ba57006ce8c7c';
export default node;
