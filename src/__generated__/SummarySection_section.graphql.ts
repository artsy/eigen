/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SummarySection_section = {
    readonly buyerTotal: string | null;
    readonly taxTotal: string | null;
    readonly shippingTotal: string | null;
    readonly totalListPrice: string | null;
    readonly lineItems: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly selectedShippingQuote: {
                    readonly displayName: string;
                } | null;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "SummarySection_section";
};
export type SummarySection_section$data = SummarySection_section;
export type SummarySection_section$key = {
    readonly " $data"?: SummarySection_section$data;
    readonly " $fragmentRefs": FragmentRefs<"SummarySection_section">;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "precision",
    "value": 2
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SummarySection_section",
  "selections": [
    {
      "alias": null,
      "args": (v0/*: any*/),
      "kind": "ScalarField",
      "name": "buyerTotal",
      "storageKey": "buyerTotal(precision:2)"
    },
    {
      "alias": null,
      "args": (v0/*: any*/),
      "kind": "ScalarField",
      "name": "taxTotal",
      "storageKey": "taxTotal(precision:2)"
    },
    {
      "alias": null,
      "args": (v0/*: any*/),
      "kind": "ScalarField",
      "name": "shippingTotal",
      "storageKey": "shippingTotal(precision:2)"
    },
    {
      "alias": null,
      "args": (v0/*: any*/),
      "kind": "ScalarField",
      "name": "totalListPrice",
      "storageKey": "totalListPrice(precision:2)"
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 1
        }
      ],
      "concreteType": "CommerceLineItemConnection",
      "kind": "LinkedField",
      "name": "lineItems",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "CommerceLineItemEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "CommerceLineItem",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "CommerceShippingQuote",
                  "kind": "LinkedField",
                  "name": "selectedShippingQuote",
                  "plural": false,
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "kind": "ScalarField",
                      "name": "displayName",
                      "storageKey": null
                    }
                  ],
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "lineItems(first:1)"
    }
  ],
  "type": "CommerceOrder",
  "abstractKey": "__isCommerceOrder"
};
})();
(node as any).hash = 'da9d714038b81677364c2b56750bcb6c';
export default node;
