/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type PaymentMethod_order = {
    readonly creditCard: {
        readonly lastDigits: string;
        readonly expirationMonth: number;
        readonly expirationYear: number;
    } | null;
    readonly " $refType": "PaymentMethod_order";
};
export type PaymentMethod_order$data = PaymentMethod_order;
export type PaymentMethod_order$key = {
    readonly " $data"?: PaymentMethod_order$data;
    readonly " $fragmentRefs": FragmentRefs<"PaymentMethod_order">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PaymentMethod_order",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "CreditCard",
      "kind": "LinkedField",
      "name": "creditCard",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "lastDigits",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "expirationMonth",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "expirationYear",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "CommerceOrder",
  "abstractKey": "__isCommerceOrder"
};
(node as any).hash = 'f023d2534514b24bcebcdf8b363b0e1a';
export default node;
