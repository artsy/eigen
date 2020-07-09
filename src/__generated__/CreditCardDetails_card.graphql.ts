/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CreditCardDetails_card = {
    readonly brand: string;
    readonly lastDigits: string;
    readonly expirationMonth: number;
    readonly expirationYear: number;
    readonly " $refType": "CreditCardDetails_card";
};
export type CreditCardDetails_card$data = CreditCardDetails_card;
export type CreditCardDetails_card$key = {
    readonly " $data"?: CreditCardDetails_card$data;
    readonly " $fragmentRefs": FragmentRefs<"CreditCardDetails_card">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "CreditCardDetails_card",
  "type": "CreditCard",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "brand",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "lastDigits",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "expirationMonth",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "expirationYear",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'f516a1b2212bb240ad55c0079df37eb9';
export default node;
