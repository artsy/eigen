/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _CommercialPartnerInformation_artwork$ref: unique symbol;
export type CommercialPartnerInformation_artwork$ref = typeof _CommercialPartnerInformation_artwork$ref;
export type CommercialPartnerInformation_artwork = {
    readonly availability: string | null;
    readonly shippingOrigin: string | null;
    readonly shippingInfo: string | null;
    readonly partner: {
        readonly name: string | null;
    } | null;
    readonly sale: {
        readonly isAuction: boolean | null;
        readonly isClosed: boolean | null;
    } | null;
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
      "name": "sale",
      "storageKey": null,
      "args": null,
      "concreteType": "Sale",
      "plural": false,
      "selections": [
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
          "name": "isClosed",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '33d25e8676ba12b6b86917ab2c039567';
export default node;
