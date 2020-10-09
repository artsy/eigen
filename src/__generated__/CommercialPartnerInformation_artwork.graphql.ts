/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CommercialPartnerInformation_artwork = {
    readonly availability: string | null;
    readonly isAcquireable: boolean | null;
    readonly isForSale: boolean | null;
    readonly isOfferable: boolean | null;
    readonly shippingOrigin: string | null;
    readonly shippingInfo: string | null;
    readonly priceIncludesTaxDisplay: string | null;
    readonly partner: {
        readonly name: string | null;
    } | null;
    readonly " $refType": "CommercialPartnerInformation_artwork";
};
export type CommercialPartnerInformation_artwork$data = CommercialPartnerInformation_artwork;
export type CommercialPartnerInformation_artwork$key = {
    readonly " $data"?: CommercialPartnerInformation_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"CommercialPartnerInformation_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CommercialPartnerInformation_artwork",
  "selections": [
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
      "name": "isAcquireable",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isForSale",
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
      "name": "shippingOrigin",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "shippingInfo",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "priceIncludesTaxDisplay",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Partner",
      "kind": "LinkedField",
      "name": "partner",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = 'f9a0bea135bd5f94a8aefee20b854c1e';
export default node;
