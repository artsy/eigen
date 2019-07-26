/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { CommercialButtons_artwork$ref } from "./CommercialButtons_artwork.graphql";
import { CommercialEditionSetInformation_artwork$ref } from "./CommercialEditionSetInformation_artwork.graphql";
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
    readonly editionSets: ReadonlyArray<{
        readonly isAcquireable: boolean | null;
        readonly isOfferable: boolean | null;
        readonly saleMessage: string | null;
    } | null> | null;
    readonly saleMessage: string | null;
    readonly shippingInfo: string | null;
    readonly shippingOrigin: string | null;
<<<<<<< HEAD
    readonly isAcquireable: boolean | null;
    readonly isOfferable: boolean | null;
    readonly isInquireable: boolean | null;
    readonly " $fragmentRefs": CommercialButtons_artwork$ref;
=======
    readonly is_acquireable: boolean | null;
    readonly is_offerable: boolean | null;
    readonly is_biddable: boolean | null;
    readonly is_inquireable: boolean | null;
    readonly " $fragmentRefs": CommercialButtons_artwork$ref & CommercialEditionSetInformation_artwork$ref;
>>>>>>> Begins adding edition set info
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
      "name": "CommercialEditionSetInformation_artwork",
      "args": null
    }
  ]
};
})();
<<<<<<< HEAD
(node as any).hash = '7a8a43f6abe5b53a27e5c637c269f6e1';
=======
(node as any).hash = '3b8849d7ab59f528d4d3bc8f62e286f1';
>>>>>>> Begins adding edition set info
export default node;
