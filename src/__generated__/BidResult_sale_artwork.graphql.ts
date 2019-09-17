/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _BidResult_sale_artwork$ref: unique symbol;
export type BidResult_sale_artwork$ref = typeof _BidResult_sale_artwork$ref;
export type BidResult_sale_artwork = {
    readonly sale: {
        readonly liveStartAt: string | null;
        readonly endAt: string | null;
        readonly slug: string;
    } | null;
    readonly " $refType": BidResult_sale_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "BidResult_sale_artwork",
  "type": "SaleArtwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
          "alias": null,
          "name": "liveStartAt",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "endAt",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "slug",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '44a66e7bfb7bc37bde83d3bfdce023ca';
export default node;
