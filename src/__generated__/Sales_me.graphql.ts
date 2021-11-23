/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Sales_me = {
    readonly " $fragmentRefs": FragmentRefs<"SaleArtworksHomeRail_me">;
    readonly " $refType": "Sales_me";
};
export type Sales_me$data = Sales_me;
export type Sales_me$key = {
    readonly " $data"?: Sales_me$data;
    readonly " $fragmentRefs": FragmentRefs<"Sales_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Sales_me",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SaleArtworksHomeRail_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'f9607c04e58fb2228babefe4920bdfa3';
export default node;
