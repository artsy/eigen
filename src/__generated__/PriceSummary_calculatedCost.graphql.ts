/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _PriceSummary_calculatedCost$ref: unique symbol;
export type PriceSummary_calculatedCost$ref = typeof _PriceSummary_calculatedCost$ref;
export type PriceSummary_calculatedCost = {
    readonly buyersPremium: {
        readonly display: string | null;
    } | null;
    readonly subtotal: {
        readonly display: string | null;
    } | null;
    readonly " $refType": PriceSummary_calculatedCost$ref;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "display",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Fragment",
  "name": "PriceSummary_calculatedCost",
  "type": "CalculatedCost",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "buyersPremium",
      "storageKey": null,
      "args": null,
      "concreteType": "BuyersPremiumAmount",
      "plural": false,
      "selections": (v0/*: any*/)
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "subtotal",
      "storageKey": null,
      "args": null,
      "concreteType": "SubtotalAmount",
      "plural": false,
      "selections": (v0/*: any*/)
    }
  ]
};
})();
(node as any).hash = '9c7744edb1c8e9493c18b47100faee78';
export default node;
