/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ConfirmBid_me$ref: unique symbol;
export type ConfirmBid_me$ref = typeof _ConfirmBid_me$ref;
export type ConfirmBid_me = {
    readonly has_qualified_credit_cards: boolean | null;
    readonly bidders: ReadonlyArray<{
        readonly qualified_for_bidding: boolean | null;
    } | null> | null;
    readonly " $refType": ConfirmBid_me$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ConfirmBid_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "saleID",
      "type": "String"
    }
  ],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "has_qualified_credit_cards",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "bidders",
      "storageKey": null,
      "args": [
        {
          "kind": "Variable",
          "name": "sale_id",
          "variableName": "saleID"
        }
      ],
      "concreteType": "Bidder",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "qualified_for_bidding",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '1b89429657eeb192da84170bb8629c15';
export default node;
