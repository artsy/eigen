/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type WorksForYou_me = {
    readonly followsAndSaves: {
        readonly notifications: {
            readonly pageInfo: {
                readonly hasNextPage: boolean;
                readonly endCursor: string | null;
            };
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly id: string;
                    readonly " $fragmentRefs": FragmentRefs<"Notification_notification">;
                } | null;
            } | null> | null;
        } | null;
    } | null;
    readonly " $refType": "WorksForYou_me";
};
export type WorksForYou_me$data = WorksForYou_me;
export type WorksForYou_me$key = {
    readonly " $data"?: WorksForYou_me$data;
    readonly " $fragmentRefs": FragmentRefs<"WorksForYou_me">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "WorksForYou_me",
  "type": "Me",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "followsAndSaves",
          "notifications"
        ]
      }
    ]
  },
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "count",
      "type": "Int",
      "defaultValue": 10
    },
    {
      "kind": "LocalArgument",
      "name": "cursor",
      "type": "String",
      "defaultValue": null
    },
    {
      "kind": "LocalArgument",
      "name": "sort",
      "type": "ArtworkSorts",
      "defaultValue": "PUBLISHED_AT_DESC"
    }
  ],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "followsAndSaves",
      "storageKey": null,
      "args": null,
      "concreteType": "FollowsAndSaves",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": "notifications",
          "name": "__WorksForYou_notifications_connection",
          "storageKey": null,
          "args": [
            {
              "kind": "Variable",
              "name": "sort",
              "variableName": "sort"
            }
          ],
          "concreteType": "FollowedArtistsArtworksGroupConnection",
          "plural": false,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "pageInfo",
              "storageKey": null,
              "args": null,
              "concreteType": "PageInfo",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "hasNextPage",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "endCursor",
                  "args": null,
                  "storageKey": null
                }
              ]
            },
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "FollowedArtistsArtworksGroupEdge",
              "plural": true,
              "selections": [
                {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "node",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "FollowedArtistsArtworksGroup",
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
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "__typename",
                      "args": null,
                      "storageKey": null
                    },
                    {
                      "kind": "FragmentSpread",
                      "name": "Notification_notification",
                      "args": null
                    }
                  ]
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "cursor",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '84c308b210f3cc201e94b14eacb98b04';
export default node;
