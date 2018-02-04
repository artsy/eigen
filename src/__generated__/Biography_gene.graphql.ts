/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type Biography_gene = {
    readonly description: string | null;
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
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    }
  ],
  "idField": "__id"
};
(node as any).hash = '50849d2daf12d006bf14b29f169ebd34';
export default node;
