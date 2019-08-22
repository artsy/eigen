/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _CommercialPartnerInformation_artwork$ref: unique symbol;
export type CommercialPartnerInformation_artwork$ref = typeof _CommercialPartnerInformation_artwork$ref;
export type CommercialPartnerInformation_artwork = {
    readonly availability: string | null;
    readonly shippingOrigin: string | null;
    readonly shippingInfo: string | null;
    readonly priceIncludesTax: boolean | null;
    readonly partner: {
        readonly name: string | null;
    } | null;
    readonly isBiddable: boolean | null;
    readonly " $refType": CommercialPartnerInformation_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "CommercialPartnerInformation_artwork",
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
      "kind": "ScalarField",
      "alias": null,
      "name": "shippingOrigin",
      "args": null,
      "storageKey": null
    },
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
      "name": "priceIncludesTax",
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
      "kind": "ScalarField",
      "alias": null,
      "name": "isBiddable",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '8ac82a9fb5b910950df4fa64fa9871ce';
export default node;
