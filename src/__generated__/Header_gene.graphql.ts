/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _Header_gene$ref: unique symbol;
export type Header_gene$ref = typeof _Header_gene$ref;
export type Header_gene = {
    readonly internalID: string;
    readonly slug: string;
    readonly name: string | null;
    readonly " $refType": Header_gene$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Header_gene",
  "type": "Gene",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '58fa9bde8f91435eb6feba670d7afdac';
export default node;
