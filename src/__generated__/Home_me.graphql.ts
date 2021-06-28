/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Home_me = {
    readonly " $fragmentRefs": FragmentRefs<"EmailConfirmationBanner_me" | "SaleArtworksHomeRail_me" | "AuctionResultsRail_me">;
    readonly " $refType": "Home_me";
};
export type Home_me$data = Home_me;
export type Home_me$key = {
    readonly " $data"?: Home_me$data;
    readonly " $fragmentRefs": FragmentRefs<"Home_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Home_me",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "EmailConfirmationBanner_me"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SaleArtworksHomeRail_me"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "AuctionResultsRail_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '628b099479983f109a233b2f3ba92048';
export default node;
