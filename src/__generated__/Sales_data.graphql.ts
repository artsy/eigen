/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Sales_data = {
    readonly salesConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly live_start_at: string | null;
                readonly " $fragmentRefs": FragmentRefs<"SaleListItem_sale">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"LotsByFollowedArtists_query">;
    readonly " $refType": "Sales_data";
};
export type Sales_data$data = Sales_data;
export type Sales_data$key = {
    readonly " $data"?: Sales_data$data;
    readonly " $fragmentRefs": FragmentRefs<"Sales_data">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Sales_data",
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
(node as any).hash = '97d955c6370f41dc92b8f45c9c09686c';
export default node;
