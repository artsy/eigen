/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ArtworkGridItem_artwork$ref: unique symbol;
export type ArtworkGridItem_artwork$ref = typeof _ArtworkGridItem_artwork$ref;
export type ArtworkGridItem_artwork = {
    readonly title: string | null;
    readonly date: string | null;
    readonly sale_message: string | null;
    readonly is_in_auction: boolean | null;
    readonly is_biddable: boolean | null;
    readonly is_acquireable: boolean | null;
    readonly is_offerable: boolean | null;
    readonly slug: string;
    readonly sale: {
        readonly is_auction: boolean | null;
        readonly is_live_open: boolean | null;
        readonly is_open: boolean | null;
        readonly is_closed: boolean | null;
        readonly display_timely_at: string | null;
    } | null;
    readonly sale_artwork: {
        readonly current_bid: {
            readonly display: string | null;
        } | null;
    } | null;
    readonly image: {
        readonly url: string | null;
        readonly aspect_ratio: number;
    } | null;
    readonly artists: ReadonlyArray<{
        readonly name: string | null;
    } | null> | null;
    readonly partner: {
        readonly name: string | null;
    } | null;
    readonly href: string | null;
    readonly " $refType": ArtworkGridItem_artwork$ref;
};



const node: ReaderFragment = (function(){
var v0 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Fragment",
  "name": "ArtworkGridItem_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "date",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "sale_message",
      "name": "saleMessage",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "is_in_auction",
      "name": "isInAuction",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "is_biddable",
      "name": "isBiddable",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "is_acquireable",
      "name": "isAcquireable",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "is_offerable",
      "name": "isOfferable",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
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
        {
          "kind": "ScalarField",
          "alias": "is_auction",
          "name": "isAuction",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": "is_live_open",
          "name": "isLiveOpen",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": "is_open",
          "name": "isOpen",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": "is_closed",
          "name": "isClosed",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": "display_timely_at",
          "name": "displayTimelyAt",
          "args": null,
          "storageKey": null
        }
      ]
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
          "alias": "current_bid",
          "name": "currentBid",
          "storageKey": null,
          "args": null,
          "concreteType": "SaleArtworkCurrentBid",
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
        }
      ]
    },
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
          "args": [
            {
              "kind": "Literal",
              "name": "version",
              "value": "large"
            }
          ],
          "storageKey": "url(version:\"large\")"
        },
        {
          "kind": "ScalarField",
          "alias": "aspect_ratio",
          "name": "aspectRatio",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artists",
      "storageKey": "artists(shallow:true)",
      "args": [
        {
          "kind": "Literal",
          "name": "shallow",
          "value": true
        }
      ],
      "concreteType": "Artist",
      "plural": true,
      "selections": (v0/*: any*/)
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": "Partner",
      "plural": false,
      "selections": (v0/*: any*/)
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "href",
      "args": null,
      "storageKey": null
    }
  ]
};
})();
(node as any).hash = 'abd0e65d56c6630565d9dd9067f1d11a';
export default node;
