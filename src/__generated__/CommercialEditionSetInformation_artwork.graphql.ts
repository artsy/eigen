/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _CommercialEditionSetInformation_artwork$ref: unique symbol;
export type CommercialEditionSetInformation_artwork$ref = typeof _CommercialEditionSetInformation_artwork$ref;
export type CommercialEditionSetInformation_artwork = {
    readonly edition_sets: ReadonlyArray<{
        readonly is_acquireable: boolean | null;
        readonly is_offerable: boolean | null;
        readonly sale_message: string | null;
        readonly edition_of: string | null;
        readonly dimensions: {
            readonly in: string | null;
            readonly cm: string | null;
        } | null;
    } | null> | null;
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
      "name": "edition_sets",
      "storageKey": null,
      "args": null,
      "concreteType": "EditionSet",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "is_acquireable",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "is_offerable",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "sale_message",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "edition_of",
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
    }
  ]
};
(node as any).hash = '6d43cbf0891ee0b8c3172c15e8adaed9';
export default node;
