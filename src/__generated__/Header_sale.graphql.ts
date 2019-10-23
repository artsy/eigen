/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type Header_sale = {
    readonly name: string | null;
    readonly " $refType": "Header_sale";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Header_sale",
  "type": "Sale",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'd690eb6814de4de0a410f482c3798de8';
export default node;
