/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { BidButton_artwork$ref } from "./BidButton_artwork.graphql";
import { BuyNowButton_artwork$ref } from "./BuyNowButton_artwork.graphql";
import { MakeOfferButton_artwork$ref } from "./MakeOfferButton_artwork.graphql";
declare const _CommercialButtons_artwork$ref: unique symbol;
export type CommercialButtons_artwork$ref = typeof _CommercialButtons_artwork$ref;
export type CommercialButtons_artwork = {
    readonly slug: string;
    readonly internalID: string;
    readonly isAcquireable: boolean | null;
    readonly isOfferable: boolean | null;
    readonly isInquireable: boolean | null;
    readonly isBiddable: boolean | null;
    readonly isInAuction: boolean | null;
    readonly isBuyNowable: boolean | null;
    readonly editionSets: ReadonlyArray<{
        readonly id: string;
    } | null> | null;
    readonly sale: {
        readonly isClosed: boolean | null;
    } | null;
    readonly " $fragmentRefs": BuyNowButton_artwork$ref & BidButton_artwork$ref & MakeOfferButton_artwork$ref;
    readonly " $refType": CommercialButtons_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "CommercialButtons_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
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
      "kind": "ScalarField",
      "alias": null,
      "name": "isAcquireable",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isOfferable",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isInquireable",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isBiddable",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isInAuction",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isBuyNowable",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "editionSets",
      "storageKey": null,
      "args": null,
      "concreteType": "EditionSet",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "id",
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
          "alias": null,
          "name": "isClosed",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "BuyNowButton_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "BidButton_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "MakeOfferButton_artwork",
      "args": null
    }
  ]
};
(node as any).hash = '446a2a05fe9eeb88b52db0dec7389234';
export default node;
