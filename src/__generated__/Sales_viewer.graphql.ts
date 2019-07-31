/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { LotsByFollowedArtists_viewer$ref } from "./LotsByFollowedArtists_viewer.graphql";
import { SaleListItem_sale$ref } from "./SaleListItem_sale.graphql";
declare const _Sales_viewer$ref: unique symbol;
export type Sales_viewer$ref = typeof _Sales_viewer$ref;
export type Sales_viewer = {
    readonly sales: ReadonlyArray<{
        readonly href: string | null;
        readonly live_start_at: string | null;
        readonly " $fragmentRefs": SaleListItem_sale$ref;
    } | null> | null;
    readonly " $fragmentRefs": LotsByFollowedArtists_viewer$ref;
    readonly " $refType": Sales_viewer$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Sales_viewer",
  "type": "Viewer",
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
      "name": "LotsByFollowedArtists_viewer",
      "args": null
    }
  ]
};
(node as any).hash = 'a01648c39d9b071f8463953ec6f8bad9';
export default node;
