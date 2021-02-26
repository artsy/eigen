/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleLotsList_sale = {
    readonly endAt: string | null;
    readonly " $refType": "SaleLotsList_sale";
};
export type SaleLotsList_sale$data = SaleLotsList_sale;
export type SaleLotsList_sale$key = {
    readonly " $data"?: SaleLotsList_sale$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleLotsList_sale">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SaleLotsList_sale",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endAt",
      "storageKey": null
    }
  ],
  "type": "Sale",
  "abstractKey": null
};
(node as any).hash = '15aac59d7fd5b2eb83078e9d08ea962d';
export default node;
