/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Home_me = {
    readonly " $fragmentRefs": FragmentRefs<"EmailConfirmationBanner_me" | "SaleArtworksHomeRail_me">;
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
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'a9efa75edd44c67e47e726506bc83e6d';
export default node;
