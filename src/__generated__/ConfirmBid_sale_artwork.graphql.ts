/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { BidResult_sale_artwork$ref } from "./BidResult_sale_artwork.graphql";
declare const _ConfirmBid_sale_artwork$ref: unique symbol;
export type ConfirmBid_sale_artwork$ref = typeof _ConfirmBid_sale_artwork$ref;
export type ConfirmBid_sale_artwork = {
    readonly internalID: string;
    readonly sale: {
        readonly gravityID: string;
        readonly live_start_at: string | null;
        readonly end_at: string | null;
    } | null;
    readonly artwork: {
        readonly gravityID: string;
        readonly title: string | null;
        readonly date: string | null;
        readonly artist_names: string | null;
    } | null;
    readonly lot_label: string | null;
    readonly " $fragmentRefs": BidResult_sale_artwork$ref;
    readonly " $refType": ConfirmBid_sale_artwork$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "gravityID",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "ConfirmBid_sale_artwork",
  "type": "SaleArtwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
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
          "name": "live_start_at",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "end_at",
          "args": null,
          "storageKey": null
        }
      ]
    },
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
          "alias": null,
          "name": "artist_names",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "lot_label",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "BidResult_sale_artwork",
      "args": null
    }
  ]
};
})();
(node as any).hash = 'd80b17b99bcad40f06a5e689f9d9611a';
export default node;
