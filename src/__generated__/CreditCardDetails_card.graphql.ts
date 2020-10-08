/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CreditCardDetails_card",
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
  "type": "CreditCard",
  "abstractKey": null
};
(node as any).hash = 'f516a1b2212bb240ad55c0079df37eb9';
export default node;
