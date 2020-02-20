/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Sales_query = {
    readonly salesConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly live_start_at: string | null;
                readonly " $fragmentRefs": FragmentRefs<"SaleListItem_sale">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"LotsByFollowedArtists_query">;
    readonly " $refType": "Sales_query";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Sales_query",
  "type": "Query",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "salesConnection",
      "storageKey": "salesConnection(first:100,isAuction:true,live:true,sort:\"TIMELY_AT_NAME_ASC\")",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 100
        },
        {
          "kind": "Literal",
          "name": "isAuction",
          "value": true
        },
        {
          "kind": "Literal",
          "name": "live",
          "value": true
        },
        {
          "kind": "Literal",
          "name": "sort",
          "value": "TIMELY_AT_NAME_ASC"
        }
      ],
      "concreteType": "SaleConnection",
      "plural": false,
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
    },
    {
      "kind": "FragmentSpread",
      "name": "LotsByFollowedArtists_query",
      "args": null
    }
  ]
};
(node as any).hash = 'c69fdf7f4fd289f56a4bff2f9bd5f82d';
export default node;
