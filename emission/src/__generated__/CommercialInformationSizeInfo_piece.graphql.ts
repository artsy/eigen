/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type CommercialInformationSizeInfo_piece = {
    readonly dimensions: {
        readonly in: string | null;
        readonly cm: string | null;
    } | null;
    readonly editionOf: string | null;
    readonly " $refType": "CommercialInformationSizeInfo_piece";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "CommercialInformationSizeInfo_piece",
  "type": "Sellable",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "editionOf",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '647dbeecf2aa12cfb017785accb9114d';
export default node;
