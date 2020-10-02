/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
    readonly internalID: string;
    readonly slug: string;
    readonly artists: ReadonlyArray<{
        readonly isConsignable: boolean | null;
    } | null> | null;
    readonly editionSets: ReadonlyArray<{
        readonly id: string;
    } | null> | null;
    readonly sale: {
        readonly internalID: string;
        readonly isClosed: boolean | null;
        readonly isAuction: boolean | null;
        readonly isLiveOpen: boolean | null;
        readonly isPreview: boolean | null;
        readonly liveStartAt: string | null;
        readonly endAt: string | null;
        readonly slug: string;
        readonly startAt: string | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"CommercialButtons_artwork" | "CommercialPartnerInformation_artwork" | "CommercialEditionSetInformation_artwork" | "ArtworkExtraLinks_artwork" | "AuctionPrice_artwork">;
    readonly " $refType": "CommercialInformation_artwork";
};
export type CommercialInformation_artwork$data = CommercialInformation_artwork;
export type CommercialInformation_artwork$key = {
    readonly " $data"?: CommercialInformation_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"CommercialInformation_artwork">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v1 = {
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
  "name": "CommercialInformation_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isAcquireable",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isOfferable",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isInquireable",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isInAuction",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "availability",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "saleMessage",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isForSale",
      "storageKey": null
    },
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Artist",
      "kind": "LinkedField",
      "name": "artists",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isConsignable",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "EditionSet",
      "kind": "LinkedField",
      "name": "editionSets",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        }
      ],
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
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isClosed",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isAuction",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isLiveOpen",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isPreview",
          "storageKey": null
        },
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
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "startAt",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CommercialButtons_artwork"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CommercialPartnerInformation_artwork"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CommercialEditionSetInformation_artwork"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtworkExtraLinks_artwork"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "AuctionPrice_artwork"
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
})();
(node as any).hash = '8b3b0397d3657eee1a69d5faa2e4f8d3';
export default node;
