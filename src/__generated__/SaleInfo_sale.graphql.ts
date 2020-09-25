/* tslint:disable */
/* eslint-disable */

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
  "kind": "Fragment",
  "name": "SaleInfo_sale",
  "type": "Sale",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "description",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "endAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "liveStartAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "startAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "timeZone",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "RegisterToBidButton_sale",
      "args": null
    }
  ]
};
(node as any).hash = '49d90df48b3cc485465b24b02cf6640b';
export default node;
