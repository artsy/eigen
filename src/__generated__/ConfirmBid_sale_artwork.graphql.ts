/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ConfirmBid_sale_artwork = {
    readonly id: string;
    readonly internalID: string;
    readonly sale: {
        readonly slug: string;
        readonly live_start_at: string | null;
        readonly end_at: string | null;
        readonly isBenefit: boolean | null;
        readonly partner: {
            readonly name: string | null;
        } | null;
    } | null;
    readonly artwork: {
        readonly slug: string;
        readonly title: string | null;
        readonly date: string | null;
        readonly artist_names: string | null;
        readonly image: {
            readonly url: string | null;
        } | null;
    } | null;
    readonly lot_label: string | null;
    readonly " $fragmentRefs": FragmentRefs<"BidResult_sale_artwork">;
    readonly " $refType": "ConfirmBid_sale_artwork";
};
export type ConfirmBid_sale_artwork$data = ConfirmBid_sale_artwork;
export type ConfirmBid_sale_artwork$key = {
    readonly " $data"?: ConfirmBid_sale_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"ConfirmBid_sale_artwork">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ConfirmBid_sale_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Sale",
      "kind": "LinkedField",
      "name": "sale",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": "live_start_at",
          "args": null,
          "kind": "ScalarField",
          "name": "liveStartAt",
          "storageKey": null
        },
        {
          "alias": "end_at",
          "args": null,
          "kind": "ScalarField",
          "name": "endAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isBenefit",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Partner",
          "kind": "LinkedField",
          "name": "partner",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "name",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Artwork",
      "kind": "LinkedField",
      "name": "artwork",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "title",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "date",
          "storageKey": null
        },
        {
          "alias": "artist_names",
          "args": null,
          "kind": "ScalarField",
          "name": "artistNames",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Image",
          "kind": "LinkedField",
          "name": "image",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": [
                {
                  "kind": "Literal",
                  "name": "version",
                  "value": "small"
                }
              ],
              "kind": "ScalarField",
              "name": "url",
              "storageKey": "url(version:\"small\")"
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": "lot_label",
      "args": null,
      "kind": "ScalarField",
      "name": "lotLabel",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "BidResult_sale_artwork"
    }
  ],
  "type": "SaleArtwork",
  "abstractKey": null
};
})();
(node as any).hash = 'd5140c99bf2098c836646804ed8a2d44';
export default node;
