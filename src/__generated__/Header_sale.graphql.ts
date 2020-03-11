/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Header_sale = {
    readonly name: string | null;
    readonly " $refType": "Header_sale";
};
export type Header_sale$data = Header_sale;
export type Header_sale$key = {
    readonly " $data"?: Header_sale$data;
    readonly " $fragmentRefs": FragmentRefs<"Header_sale">;
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
