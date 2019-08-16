/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ArtworkExtraLinks_artwork$ref } from "./ArtworkExtraLinks_artwork.graphql";
import { AuctionCountDownTimer_artwork$ref } from "./AuctionCountDownTimer_artwork.graphql";
import { CommercialButtons_artwork$ref } from "./CommercialButtons_artwork.graphql";
import { CommercialEditionSetInformation_artwork$ref } from "./CommercialEditionSetInformation_artwork.graphql";
import { CommercialPartnerInformation_artwork$ref } from "./CommercialPartnerInformation_artwork.graphql";
declare const _CommercialInformation_artwork$ref: unique symbol;
export type CommercialInformation_artwork$ref = typeof _CommercialInformation_artwork$ref;
export type CommercialInformation_artwork = {
    readonly availability: string | null;
    readonly artists: ReadonlyArray<{
        readonly isConsignable: boolean | null;
    } | null> | null;
    readonly editionSets: ReadonlyArray<{
        readonly isAcquireable: boolean | null;
        readonly isOfferable: boolean | null;
        readonly saleMessage: string | null;
    } | null> | null;
    readonly sale: {
        readonly isClosed: boolean | null;
    } | null;
    readonly saleMessage: string | null;
    readonly shippingInfo: string | null;
    readonly shippingOrigin: string | null;
    readonly isAcquireable: boolean | null;
    readonly isOfferable: boolean | null;
    readonly isInquireable: boolean | null;
    readonly isInAuction: boolean | null;
    readonly " $fragmentRefs": CommercialButtons_artwork$ref & CommercialPartnerInformation_artwork$ref & CommercialEditionSetInformation_artwork$ref & AuctionCountDownTimer_artwork$ref & ArtworkExtraLinks_artwork$ref;
    readonly " $refType": CommercialInformation_artwork$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isAcquireable",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isOfferable",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "saleMessage",
  "args": null,
  "storageKey": null
};
return {
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
        (v0/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/)
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
    (v2/*: any*/),
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "shippingInfo",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "shippingOrigin",
      "args": null,
      "storageKey": null
    },
    (v0/*: any*/),
    (v1/*: any*/),
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
      "name": "AuctionCountDownTimer_artwork",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtworkExtraLinks_artwork",
      "args": null
    }
  ]
};
})();
(node as any).hash = 'f71aa77db016d3a64418773480a63eab';
export default node;
