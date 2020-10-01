/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Shows_show = {
    readonly nearbyShows: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly name: string | null;
                readonly " $fragmentRefs": FragmentRefs<"ShowItem_show">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "Shows_show";
};
export type Shows_show$data = Shows_show;
export type Shows_show$key = {
    readonly " $data"?: Shows_show$data;
    readonly " $fragmentRefs": FragmentRefs<"Shows_show">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Shows_show",
  "selections": [
    {
      "alias": "nearbyShows",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 20
        }
      ],
      "concreteType": "ShowConnection",
      "kind": "LinkedField",
      "name": "nearbyShowsConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ShowEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Show",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "name",
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "ShowItem_show"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "nearbyShowsConnection(first:20)"
    }
  ],
  "type": "Show",
  "abstractKey": null
};
(node as any).hash = 'dca670dd1195194baa7999eb1fd510bb';
export default node;
