/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ShowItem_show$ref } from "./ShowItem_show.graphql";
declare const _Shows_show$ref: unique symbol;
export type Shows_show$ref = typeof _Shows_show$ref;
export type Shows_show = {
    readonly nearbyShows: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly " $fragmentRefs": ShowItem_show$ref;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": Shows_show$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Shows_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": "nearbyShows",
      "name": "nearbyShowsConnection",
      "storageKey": "nearbyShowsConnection(first:20)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 20
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
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "id",
                  "args": null,
                  "storageKey": null
                },
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
    }
  ]
};
(node as any).hash = 'db0e2a398e2cae8f10c5f68acf339624';
export default node;
