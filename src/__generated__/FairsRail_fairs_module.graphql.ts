/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type FairsRail_fairs_module = {
    readonly results: ReadonlyArray<({
            readonly id: string;
            readonly name: string | null;
            readonly profile: ({
                readonly href: string | null;
            }) | null;
            readonly mobile_image: ({
                readonly id: string | null;
                readonly url: string | null;
            }) | null;
        }) | null>;
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
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "href",
              "args": null,
              "storageKey": null
            },
            v1
          ],
          "idField": "__id"
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
      ],
      "idField": "__id"
    }
  ]
};
})();
(node as any).hash = '85178fd988a5abdc9f3d3c9a166df3da';
export default node;
