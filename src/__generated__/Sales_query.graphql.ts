/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { LotsByFollowedArtists_query$ref } from "./LotsByFollowedArtists_query.graphql";
import { SaleListItem_sale$ref } from "./SaleListItem_sale.graphql";
declare const _Sales_query$ref: unique symbol;
export type Sales_query$ref = typeof _Sales_query$ref;
export type Sales_query = {
    readonly salesConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly href: string | null;
                readonly live_start_at: string | null;
                readonly " $fragmentRefs": SaleListItem_sale$ref;
            } | null;
        } | null> | null;
    } | null;
    readonly " $fragmentRefs": LotsByFollowedArtists_query$ref;
    readonly " $refType": Sales_query$ref;
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
                  "alias": null,
                  "name": "href",
                  "args": null,
                  "storageKey": null
                },
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
(node as any).hash = 'e94deed573d0d7b1e83d4dcb905cc75b';
export default node;
