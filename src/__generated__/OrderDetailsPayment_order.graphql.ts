/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OrderDetailsPayment_order = {
    readonly creditCard: {
        readonly brand: string;
        readonly lastDigits: string;
    } | null;
    readonly " $refType": "OrderDetailsPayment_order";
};
export type OrderDetailsPayment_order$data = OrderDetailsPayment_order;
export type OrderDetailsPayment_order$key = {
    readonly " $data"?: OrderDetailsPayment_order$data;
    readonly " $fragmentRefs": FragmentRefs<"OrderDetailsPayment_order">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OrderDetailsPayment_order",
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
          "name": "brand",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "lastDigits",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "CommerceOrder",
  "abstractKey": "__isCommerceOrder"
};
(node as any).hash = '0f2c83c831dc032359dd3cc39ea74d75';
export default node;
