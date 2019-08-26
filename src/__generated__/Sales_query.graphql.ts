/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { LotsByFollowedArtists_query$ref } from "./LotsByFollowedArtists_query.graphql";
import { SaleListItem_sale$ref } from "./SaleListItem_sale.graphql";
declare const _Sales_query$ref: unique symbol;
export type Sales_query$ref = typeof _Sales_query$ref;
export type Sales_query = {
    readonly sales: ReadonlyArray<{
        readonly href: string | null;
        readonly live_start_at: string | null;
        readonly " $fragmentRefs": SaleListItem_sale$ref;
    } | null> | null;
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
      "name": "sales",
      "storageKey": "sales(isAuction:true,live:true,size:100,sort:\"TIMELY_AT_NAME_ASC\")",
      "args": [
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
          "name": "size",
          "value": 100
        },
        {
          "kind": "Literal",
          "name": "sort",
          "value": "TIMELY_AT_NAME_ASC"
        }
      ],
      "concreteType": "Sale",
      "plural": true,
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
    },
    {
      "kind": "FragmentSpread",
      "name": "LotsByFollowedArtists_query",
      "args": null
    }
  ]
};
(node as any).hash = '81decacc84cecee4dcb0fb93b24e3230';
export default node;
