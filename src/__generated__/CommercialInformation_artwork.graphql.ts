/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { CommercialButtons_artwork$ref } from "./CommercialButtons_artwork.graphql";
import { CommercialEditionSetInformation_artwork$ref } from "./CommercialEditionSetInformation_artwork.graphql";
import { CommercialPartnerInformation_artwork$ref } from "./CommercialPartnerInformation_artwork.graphql";
declare const _CommercialInformation_artwork$ref: unique symbol;
export type CommercialInformation_artwork$ref = typeof _CommercialInformation_artwork$ref;
export type CommercialInformation_artwork = {
    readonly availability: string | null;
    readonly artists: ReadonlyArray<{
        readonly is_consignable: boolean | null;
    } | null> | null;
    readonly editionSets: ReadonlyArray<{
        readonly isAcquireable: boolean | null;
        readonly isOfferable: boolean | null;
        readonly saleMessage: string | null;
    } | null> | null;
    readonly saleMessage: string | null;
    readonly shippingInfo: string | null;
    readonly shippingOrigin: string | null;
    readonly isAcquireable: boolean | null;
    readonly isOfferable: boolean | null;
    readonly isInquireable: boolean | null;
    readonly " $fragmentRefs": CommercialButtons_artwork$ref & CommercialPartnerInformation_artwork$ref & CommercialEditionSetInformation_artwork$ref;
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
    }
  ]
};
})();
(node as any).hash = '01bfe36d22efbf16af9449537fdeb623';
export default node;
