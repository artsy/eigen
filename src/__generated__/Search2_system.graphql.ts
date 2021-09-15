/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Search2_system = {
    readonly algolia: {
        readonly appID: string;
        readonly apiKey: string;
        readonly indices: ReadonlyArray<{
            readonly name: string;
            readonly displayName: string;
        }>;
    } | null;
    readonly __typename: "System";
    readonly " $refType": "Search2_system";
};
export type Search2_system$data = Search2_system;
export type Search2_system$key = {
    readonly " $data"?: Search2_system$data;
    readonly " $fragmentRefs": FragmentRefs<"Search2_system">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Search2_system",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__typename",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Algolia",
      "kind": "LinkedField",
      "name": "algolia",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "appID",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "apiKey",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "AlgoliaIndex",
          "kind": "LinkedField",
          "name": "indices",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "name",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "displayName",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "System",
  "abstractKey": null
};
(node as any).hash = 'e5023a1d80b933d275d3762dbadf2533';
export default node;
