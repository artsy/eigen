/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
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
    readonly " $fragmentRefs": BuyNowButton_artwork$ref & MakeOfferButton_artwork$ref;
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
      "kind": "FragmentSpread",
      "name": "BuyNowButton_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "MakeOfferButton_artwork",
      "args": null
    }
  ]
};
(node as any).hash = '8ea2e8146ceb23b9b0febf3d3094ea8a';
export default node;
