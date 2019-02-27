/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
declare const _FairsRail_fairs_module$ref: unique symbol;
export type FairsRail_fairs_module$ref = typeof _FairsRail_fairs_module$ref;
export type FairsRail_fairs_module = {
    readonly results: ReadonlyArray<({
        readonly id: string;
        readonly name: string | null;
        readonly profile: ({
            readonly id: string;
        }) | null;
        readonly mobile_image: ({
            readonly id: string | null;
            readonly url: string | null;
        }) | null;
    }) | null>;
    readonly " $refType": FairsRail_fairs_module$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "FairsRail_fairs_module",
  "type": "HomePageFairsModule",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "results",
      "storageKey": null,
      "args": null,
      "concreteType": "Fair",
      "plural": true,
      "selections": [
        v0,
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "profile",
          "storageKey": null,
          "args": null,
          "concreteType": "Profile",
          "plural": false,
          "selections": [
            v0,
            v1
          ]
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "mobile_image",
          "storageKey": null,
          "args": null,
          "concreteType": "Image",
          "plural": false,
          "selections": [
            v0,
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "url",
              "args": null,
              "storageKey": null
            }
          ]
        },
        v1
      ]
    }
  ]
};
})();
(node as any).hash = '848f3ef1e7d35f58ee3c2abed5401d8d';
export default node;
