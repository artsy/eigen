/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleLotsList_sale = {
    readonly internalID: string;
    readonly slug: string;
    readonly " $refType": "SaleLotsList_sale";
};
export type SaleLotsList_sale$data = SaleLotsList_sale;
export type SaleLotsList_sale$key = {
    readonly " $data"?: SaleLotsList_sale$data;
    readonly " $fragmentRefs": FragmentRefs<"SaleLotsList_sale">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SaleLotsList_sale",
  "type": "Sale",
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
    }
  ]
};
(node as any).hash = 'ea54293e20364fca410dbb28504aaccc';
export default node;
