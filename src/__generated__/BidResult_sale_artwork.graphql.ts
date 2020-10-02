/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type BidResult_sale_artwork = {
    readonly sale: {
        readonly liveStartAt: string | null;
        readonly endAt: string | null;
        readonly slug: string;
    } | null;
    readonly " $refType": "BidResult_sale_artwork";
};
export type BidResult_sale_artwork$data = BidResult_sale_artwork;
export type BidResult_sale_artwork$key = {
    readonly " $data"?: BidResult_sale_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"BidResult_sale_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "BidResult_sale_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Sale",
      "kind": "LinkedField",
      "name": "sale",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "liveStartAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "endAt",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "slug",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "SaleArtwork",
  "abstractKey": null
};
(node as any).hash = '44a66e7bfb7bc37bde83d3bfdce023ca';
export default node;
