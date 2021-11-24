/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Home_meAbove = {
    readonly " $fragmentRefs": FragmentRefs<"EmailConfirmationBanner_me" | "LotsByFollowedArtistsRail_me" | "NewWorksForYouRail_me">;
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
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'f6c14bf793c54aeb638a3dc4e1c18528';
export default node;
