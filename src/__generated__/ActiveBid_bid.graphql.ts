/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ActiveBid_bid$ref: unique symbol;
export type ActiveBid_bid$ref = typeof _ActiveBid_bid$ref;
export type ActiveBid_bid = {
    readonly is_leading_bidder: boolean | null;
    readonly sale: ({
        readonly href: string | null;
        readonly is_live_open: boolean | null;
    }) | null;
    readonly most_recent_bid: ({
        readonly __id: string;
        readonly max_bid: ({
            readonly display: string | null;
        }) | null;
        readonly sale_artwork: ({
            readonly artwork: ({
                readonly href: string | null;
                readonly image: ({
                    readonly url: string | null;
                }) | null;
                readonly artist_names: string | null;
            }) | null;
            readonly counts: ({
                readonly bidder_positions: any | null;
            }) | null;
            readonly highest_bid: ({
                readonly display: string | null;
            }) | null;
            readonly lot_number: string | null;
            readonly reserve_status: string | null;
        }) | null;
    }) | null;
    readonly " $refType": ActiveBid_bid$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v1 = [
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
  "name": "ActiveBid_bid",
  "type": "LotStanding",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "is_leading_bidder",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "sale",
      "storageKey": null,
      "args": null,
      "concreteType": "Sale",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "is_live_open",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "most_recent_bid",
      "storageKey": null,
      "args": null,
      "concreteType": "BidderPosition",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "__id",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "max_bid",
          "storageKey": null,
          "args": null,
          "concreteType": "BidderPositionMaxBid",
          "plural": false,
          "selections": (v1/*: any*/)
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "sale_artwork",
          "storageKey": null,
          "args": null,
          "concreteType": "SaleArtwork",
          "plural": false,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "artwork",
              "storageKey": null,
              "args": null,
              "concreteType": "Artwork",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "image",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Image",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "url",
                      "args": null,
                      "storageKey": null
                    }
                  ]
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "artist_names",
                  "args": null,
                  "storageKey": null
                }
              ]
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "counts",
              "storageKey": null,
              "args": null,
              "concreteType": "SaleArtworkCounts",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "bidder_positions",
                  "args": null,
                  "storageKey": null
                }
              ]
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "highest_bid",
              "storageKey": null,
              "args": null,
              "concreteType": "SaleArtworkHighestBid",
              "plural": false,
              "selections": (v1/*: any*/)
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "lot_number",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "reserve_status",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'b7dfb7280121bbc46555b5ccaa2b2f0c';
export default node;
