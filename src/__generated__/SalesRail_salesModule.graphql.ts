/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SalesRail_salesModule = {
    readonly results: ReadonlyArray<{
        readonly id: string;
        readonly slug: string;
    } | null>;
    readonly " $refType": "SalesRail_salesModule";
};
export type SalesRail_salesModule$data = SalesRail_salesModule;
export type SalesRail_salesModule$key = {
    readonly " $data"?: SalesRail_salesModule$data;
    readonly " $fragmentRefs": FragmentRefs<"SalesRail_salesModule">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "SalesRail_salesModule",
  "type": "HomePageSalesModule",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "results",
      "storageKey": null,
      "args": null,
      "concreteType": "Sale",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "id",
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
    }
  ]
};
(node as any).hash = 'ab2c8831ac542dbadf9a40b15a9bf4ff';
export default node;
