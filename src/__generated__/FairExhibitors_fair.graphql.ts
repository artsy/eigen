/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _FairExhibitors_fair$ref: unique symbol;
export type FairExhibitors_fair$ref = typeof _FairExhibitors_fair$ref;
export type FairExhibitors_fair = {
    readonly slug: string;
    readonly internalID: string;
    readonly exhibitorsGroupedByName: ReadonlyArray<{
        readonly letter: string | null;
        readonly exhibitors: ReadonlyArray<{
            readonly name: string | null;
            readonly slug: string;
            readonly profileID: string | null;
            readonly partnerID: string | null;
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
      "alias": null,
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
              "alias": null,
              "name": "profileID",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
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
(node as any).hash = '18b238bbd00241542a381b2fc2cc97f7';
export default node;
