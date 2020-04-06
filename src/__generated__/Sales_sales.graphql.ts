/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Sales_sales = {
    readonly edges: ReadonlyArray<{
        readonly node: {
            readonly live_start_at: string | null;
            readonly " $fragmentRefs": FragmentRefs<"SaleListItem_sale">;
        } | null;
    } | null> | null;
    readonly " $refType": "Sales_sales";
};
export type Sales_sales$data = Sales_sales;
export type Sales_sales$key = {
    readonly " $data"?: Sales_sales$data;
    readonly " $fragmentRefs": FragmentRefs<"Sales_sales">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Sales_sales",
  "type": "SaleConnection",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "edges",
      "storageKey": null,
      "args": null,
      "concreteType": "SaleEdge",
      "plural": true,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "node",
          "storageKey": null,
          "args": null,
          "concreteType": "Sale",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": "live_start_at",
              "name": "liveStartAt",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "FragmentSpread",
              "name": "SaleListItem_sale",
              "args": null
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = 'cc3a203ba7ba157f6de5cb954d6c1e6f';
export default node;
