/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ConfirmBid_sale_artwork = {
    readonly id: string;
    readonly internalID: string;
    readonly sale: {
        readonly slug: string;
        readonly live_start_at: string | null;
        readonly end_at: string | null;
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



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
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
      "name": "id",
      "args": null,
      "storageKey": null
    },
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
          "alias": "live_start_at",
          "name": "liveStartAt",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": "end_at",
          "name": "endAt",
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
          "alias": "artist_names",
          "name": "artistNames",
          "args": null,
          "storageKey": null
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
                  "value": "small"
                }
              ],
              "storageKey": "url(version:\"small\")"
            }
          ]
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
      "kind": "FragmentSpread",
      "name": "BidResult_sale_artwork",
      "args": null
    }
  ]
};
})();
(node as any).hash = '8d479a1aa00dfaa40cc119e04a6b9df4';
export default node;
