/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleInfo_sale = {
    readonly description: string | null;
    readonly endAt: string | null;
    readonly liveStartAt: string | null;
    readonly name: string | null;
    readonly startAt: string | null;
    readonly timeZone: string | null;
    readonly " $fragmentRefs": FragmentRefs<"RegisterToBidButton_sale">;
    readonly " $refType": "SaleInfo_sale";
};
export type SaleInfo_sale$data = SaleInfo_sale;
export type SaleInfo_sale$key = {
    readonly " $data"?: SaleInfo_sale$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleInfo_sale">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SaleInfo_sale",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "liveStartAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "startAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "timeZone",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "RegisterToBidButton_sale"
    }
  ],
  "type": "Sale",
  "abstractKey": null
};
(node as any).hash = '1dae841dcb5cb7920bb0a46a767b8a1e';
export default node;
