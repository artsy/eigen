/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { ShowItem_show$ref } from "./ShowItem_show.graphql";
declare const _Shows_show$ref: unique symbol;
export type Shows_show$ref = typeof _Shows_show$ref;
export type Shows_show = {
    readonly nearbyShows: ({
        readonly edges: ReadonlyArray<({
            readonly node: ({
                readonly __id: string;
                readonly " $fragmentRefs": ShowItem_show$ref;
            }) | null;
        }) | null> | null;
    }) | null;
    readonly " $refType": Shows_show$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "Shows_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "nearbyShows",
      "storageKey": "nearbyShows(first:20)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 20,
          "type": "Int"
        }
      ],
      "concreteType": "ShowConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ShowEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Show",
              "plural": false,
              "selections": [
                v0,
                {
                  "kind": "FragmentSpread",
                  "name": "ShowItem_show",
                  "args": null
                }
              ]
            }
          ]
        }
      ]
    },
    v0
  ]
};
})();
(node as any).hash = '4877545048325d9b4c62f76889d5ac3d';
export default node;
