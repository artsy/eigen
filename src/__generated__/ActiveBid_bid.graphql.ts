/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ActiveBid_bid$ref: unique symbol;
export type ActiveBid_bid$ref = typeof _ActiveBid_bid$ref;
export type ActiveBid_bid = {
    readonly is_leading_bidder: boolean | null;
    readonly sale: {
        readonly href: string | null;
        readonly is_live_open: boolean | null;
    } | null;
    readonly most_recent_bid: {
        readonly id: string;
        readonly sale_artwork: {
            readonly artwork: {
                readonly href: string | null;
                readonly image: {
                    readonly url: string | null;
                } | null;
                readonly artist_names: string | null;
            } | null;
            readonly counts: {
                readonly bidder_positions: number | null;
            } | null;
            readonly highest_bid: {
                readonly display: string | null;
            } | null;
            readonly lot_label: string | null;
            readonly reserve_status: string | null;
        } | null;
    } | null;
    readonly " $refType": ActiveBid_bid$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "ActiveBid_bid",
  "type": "LotStanding",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": "is_leading_bidder",
      "name": "isLeadingBidder",
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
          "alias": "is_live_open",
          "name": "isLiveOpen",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": "most_recent_bid",
      "name": "mostRecentBid",
      "storageKey": null,
      "args": null,
      "concreteType": "BidderPosition",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "id",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": "sale_artwork",
          "name": "saleArtwork",
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
                  "alias": "artist_names",
                  "name": "artistNames",
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
                  "alias": "bidder_positions",
                  "name": "bidderPositions",
                  "args": null,
                  "storageKey": null
                }
              ]
            },
            {
              "kind": "LinkedField",
              "alias": "highest_bid",
              "name": "highestBid",
              "storageKey": null,
              "args": null,
              "concreteType": "SaleArtworkHighestBid",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "display",
                  "args": null,
                  "storageKey": null
                }
              ]
            },
            {
              "kind": "ScalarField",
              "alias": "lot_label",
              "name": "lotLabel",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": "reserve_status",
              "name": "reserveStatus",
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
(node as any).hash = 'd32166296aef7a6c6e6c093e04193119';
export default node;
