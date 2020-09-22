/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleHeader_sale = {
    readonly name: string | null;
    readonly internalID: string;
    readonly liveStartAt: string | null;
    readonly endAt: string | null;
    readonly startAt: string | null;
    readonly timeZone: string | null;
    readonly coverImage: {
        readonly url: string | null;
    } | null;
    readonly " $refType": "SaleHeader_sale";
};
export type SaleHeader_sale$data = SaleHeader_sale;
export type SaleHeader_sale$key = {
    readonly " $data"?: SaleHeader_sale$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleHeader_sale">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SaleHeader_sale",
  "type": "Sale",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
      "name": "internalID",
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
      "name": "endAt",
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
      "kind": "LinkedField",
      "alias": null,
      "name": "coverImage",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "url",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '66df36bdd9b7a8fd3c7cdbd90da7a8dd';
export default node;
