/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CommercialButtons_artwork = {
    readonly slug: string;
    readonly isAcquireable: boolean | null;
    readonly isOfferable: boolean | null;
    readonly isInquireable: boolean | null;
    readonly isInAuction: boolean | null;
    readonly isBuyNowable: boolean | null;
    readonly isForSale: boolean | null;
    readonly editionSets: ReadonlyArray<{
        readonly id: string;
    } | null> | null;
    readonly sale: {
        readonly isClosed: boolean | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"BuyNowButton_artwork" | "BidButton_artwork" | "MakeOfferButton_artwork">;
    readonly " $refType": "CommercialButtons_artwork";
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
      "kind": "ScalarField",
      "alias": null,
      "name": "isForSale",
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
(node as any).hash = '3975f9380b99ba60525317df7322041b';
export default node;
