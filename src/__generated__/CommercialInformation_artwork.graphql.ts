/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ArtworkAvailability_artwork$ref } from "./ArtworkAvailability_artwork.graphql";
import { SellerInfo_artwork$ref } from "./SellerInfo_artwork.graphql";
declare const _CommercialInformation_artwork$ref: unique symbol;
export type CommercialInformation_artwork$ref = typeof _CommercialInformation_artwork$ref;
export type CommercialInformation_artwork = {
    readonly availability: string | null;
    readonly partner: {
        readonly name: string | null;
    } | null;
    readonly artists: ReadonlyArray<{
        readonly is_consignable: boolean | null;
    } | null> | null;
    readonly sale: {
        readonly is_auction: boolean | null;
        readonly is_closed: boolean | null;
    } | null;
    readonly " $fragmentRefs": ArtworkAvailability_artwork$ref & SellerInfo_artwork$ref;
    readonly " $refType": CommercialInformation_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "CommercialInformation_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "availability",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": "Partner",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artists",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": "is_consignable",
          "name": "isConsignable",
          "args": null,
          "storageKey": null
        }
      ]
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
          "alias": "is_closed",
          "name": "isClosed",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtworkAvailability_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "SellerInfo_artwork",
      "args": null
    }
  ]
};
(node as any).hash = 'e28168f24f0f1d74af8b4e5d67a302b9';
export default node;
