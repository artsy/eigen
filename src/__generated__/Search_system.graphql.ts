/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Search_system = {
    readonly system: {
        readonly __typename: string;
        readonly algolia: {
            readonly appID: string;
            readonly apiKey: string;
            readonly indices: ReadonlyArray<{
                readonly name: string;
                readonly displayName: string;
                readonly key: string;
            }>;
        } | null;
    } | null;
    readonly " $refType": "Search_system";
};
export type Search_system$data = Search_system;
export type Search_system$key = {
    readonly " $data"?: Search_system$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"Search_system">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [],
      "operation": require('./SearchRefetchQuery.graphql')
    }
  },
  "name": "Search_system",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "System",
      "kind": "LinkedField",
      "name": "system",
      "plural": false,
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
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "key",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
(node as any).hash = '9a3b4e2b51c9ac8771ff1ce37e7ddfeb';
export default node;
