/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _FairExhibitors_fair$ref: unique symbol;
export type FairExhibitors_fair$ref = typeof _FairExhibitors_fair$ref;
export type FairExhibitors_fair = {
    readonly slug: string;
    readonly internalID: string;
    readonly exhibitors_grouped_by_name: ReadonlyArray<{
        readonly letter: string | null;
        readonly exhibitors: ReadonlyArray<{
            readonly name: string | null;
            readonly slug: string;
            readonly profile_id: string | null;
            readonly partner_id: string | null;
        } | null> | null;
    } | null> | null;
    readonly " $refType": FairExhibitors_fair$ref;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "FairExhibitors_fair",
  "type": "Fair",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "exhibitors_grouped_by_name",
      "name": "exhibitorsGroupedByName",
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
          "kind": "LinkedField",
          "alias": null,
          "name": "exhibitors",
          "storageKey": null,
          "args": null,
          "concreteType": "FairExhibitor",
          "plural": true,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "name",
              "args": null,
              "storageKey": null
            },
            (v0/*: any*/),
            {
              "kind": "ScalarField",
              "alias": "profile_id",
              "name": "profileID",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": "partner_id",
              "name": "partnerID",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = '458e78f3e9b1b285493f2988839af57d';
export default node;
