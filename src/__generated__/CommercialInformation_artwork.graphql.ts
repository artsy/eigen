/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CommercialInformation_artwork = {
    readonly isAcquireable: boolean | null;
    readonly isOfferable: boolean | null;
    readonly isInquireable: boolean | null;
    readonly isInAuction: boolean | null;
    readonly availability: string | null;
    readonly saleMessage: string | null;
    readonly isForSale: boolean | null;
    readonly artists: ReadonlyArray<{
        readonly isConsignable: boolean | null;
    } | null> | null;
    readonly editionSets: ReadonlyArray<{
        readonly id: string;
    } | null> | null;
    readonly sale: {
        readonly isClosed: boolean | null;
        readonly isAuction: boolean | null;
        readonly isLiveOpen: boolean | null;
        readonly isPreview: boolean | null;
        readonly liveStartAt: string | null;
        readonly endAt: string | null;
        readonly startAt: string | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"CommercialButtons_artwork" | "CommercialPartnerInformation_artwork" | "CommercialEditionSetInformation_artwork" | "ArtworkExtraLinks_artwork" | "AuctionPrice_artwork">;
    readonly " $refType": "CommercialInformation_artwork";
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
      "name": "availability",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "saleMessage",
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
      "name": "artists",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isConsignable",
          "args": null,
          "storageKey": null
        }
      ]
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
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isAuction",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isLiveOpen",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isPreview",
          "args": null,
          "storageKey": null
        },
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
          "name": "startAt",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "CommercialButtons_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "CommercialPartnerInformation_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "CommercialEditionSetInformation_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtworkExtraLinks_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "AuctionPrice_artwork",
      "args": null
    }
  ]
};
(node as any).hash = 'ca265ee2cc67de8f0b62792fd7737f8d';
export default node;
