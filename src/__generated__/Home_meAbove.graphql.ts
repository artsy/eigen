/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Home_meAbove = {
    readonly " $fragmentRefs": FragmentRefs<"EmailConfirmationBanner_me" | "LotsByFollowedArtistsRail_me" | "NewWorksForYouRail_me" | "RecommendedArtistsRail_me">;
    readonly " $refType": "Home_meAbove";
};
export type Home_meAbove$data = Home_meAbove;
export type Home_meAbove$key = {
    readonly " $data"?: Home_meAbove$data;
    readonly " $fragmentRefs": FragmentRefs<"Home_meAbove">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Home_meAbove",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "EmailConfirmationBanner_me"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "LotsByFollowedArtistsRail_me"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "NewWorksForYouRail_me"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "RecommendedArtistsRail_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '2d6c8b21c4beb1e520c7e9b9508a3524';
export default node;
