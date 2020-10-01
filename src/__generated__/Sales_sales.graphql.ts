/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Sales_sales",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "SaleEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Sale",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            {
              "alias": "live_start_at",
              "args": null,
              "kind": "ScalarField",
              "name": "liveStartAt",
              "storageKey": null
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "SaleListItem_sale"
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "SaleConnection",
  "abstractKey": null
};
(node as any).hash = 'cc3a203ba7ba157f6de5cb954d6c1e6f';
export default node;
