/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _Biography_gene$ref: unique symbol;
export type Biography_gene$ref = typeof _Biography_gene$ref;
export type Biography_gene = {
    readonly description: string | null;
    readonly " $refType": Biography_gene$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "Biography_gene",
  "type": "Gene",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "description",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "__id",
      "name": "id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '50849d2daf12d006bf14b29f169ebd34';
export default node;
