/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Home_meAbove = {
    readonly " $fragmentRefs": FragmentRefs<"EmailConfirmationBanner_me" | "SaleArtworksHomeRail_me">;
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
      "name": "SaleArtworksHomeRail_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'ba2bef8742264c9f4908f79dc3546752';
export default node;
