/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleInfo_sale = {
    readonly name: string | null;
    readonly " $refType": "SaleInfo_sale";
};
export type SaleInfo_sale$data = SaleInfo_sale;
export type SaleInfo_sale$key = {
    readonly " $data"?: SaleInfo_sale$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleInfo_sale">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SaleInfo_sale",
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
(node as any).hash = '88dea2f69c6ed84a2e19d2d9755df363';
export default node;
