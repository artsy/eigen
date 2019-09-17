/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { CommercialPartnerInformation_artwork$ref } from "./CommercialPartnerInformation_artwork.graphql";
declare const _CommercialEditionSetInformation_artwork$ref: unique symbol;
export type CommercialEditionSetInformation_artwork$ref = typeof _CommercialEditionSetInformation_artwork$ref;
export type CommercialEditionSetInformation_artwork = {
    readonly editionSets: ReadonlyArray<{
        readonly id: string;
        readonly internalID: string;
        readonly saleMessage: string | null;
        readonly editionOf: string | null;
        readonly dimensions: {
            readonly in: string | null;
            readonly cm: string | null;
        } | null;
    } | null> | null;
    readonly " $fragmentRefs": CommercialPartnerInformation_artwork$ref;
    readonly " $refType": CommercialEditionSetInformation_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "CommercialEditionSetInformation_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
          "name": "saleMessage",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "editionOf",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "dimensions",
          "storageKey": null,
          "args": null,
          "concreteType": "dimensions",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "in",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "cm",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "CommercialPartnerInformation_artwork",
      "args": null
    }
  ]
};
(node as any).hash = 'e8a7c66739dcb5af490a7dddbdc52d07';
export default node;
