/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _FairExhibitors_fair$ref: unique symbol;
export type FairExhibitors_fair$ref = typeof _FairExhibitors_fair$ref;
export type FairExhibitors_fair = {
    readonly exhibitors_grouped_by_name: ReadonlyArray<({
        readonly letter: string | null;
        readonly exhibitors: ReadonlyArray<string | null> | null;
    }) | null> | null;
    readonly " $refType": FairExhibitors_fair$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "FairExhibitors_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "exhibitors_grouped_by_name",
      "storageKey": null,
      "args": null,
      "concreteType": "FairExhibitorsGroup",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "letter",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "exhibitors",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'abcf35a78d786db0e6fce91d5397e8eb';
export default node;
