/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleInfo_sale = {
    readonly description: string | null;
    readonly slug: string;
    readonly internalID: string;
    readonly endAt: string | null;
    readonly liveStartAt: string | null;
    readonly name: string | null;
    readonly startAt: string | null;
    readonly registrationEndsAt: string | null;
    readonly timeZone: string | null;
    readonly isWithBuyersPremium: boolean | null;
    readonly buyersPremium: ReadonlyArray<{
        readonly amount: string | null;
        readonly percent: number | null;
    } | null> | null;
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
      "name": "slug",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
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
      "name": "registrationEndsAt",
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
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isWithBuyersPremium",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "BuyersPremium",
      "kind": "LinkedField",
      "name": "buyersPremium",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "amount",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "percent",
          "storageKey": null
        }
      ],
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
(node as any).hash = 'cfdad82aa72dea8ea33c489659e22efa';
export default node;
