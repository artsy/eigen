/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { FairBoothPreview_show$ref } from "./FairBoothPreview_show.graphql";
import { FairHeader_fair$ref } from "./FairHeader_fair.graphql";
import { LocationMap_location$ref } from "./LocationMap_location.graphql";
declare const _FairDetail_fair$ref: unique symbol;
export type FairDetail_fair$ref = typeof _FairDetail_fair$ref;
export type FairDetail_fair = {
    readonly id: string;
    readonly name: string | null;
    readonly hours: string | null;
    readonly location: ({
        readonly coordinates: ({
            readonly lat: number | null;
            readonly lng: number | null;
        }) | null;
        readonly " $fragmentRefs": LocationMap_location$ref;
    }) | null;
    readonly profile: ({
        readonly name: string | null;
    }) | null;
    readonly shows: ({
        readonly pageInfo: {
            readonly hasNextPage: boolean;
            readonly startCursor: string | null;
            readonly endCursor: string | null;
        };
        readonly edges: ReadonlyArray<({
            readonly cursor: string;
            readonly node: ({
                readonly id: string;
                readonly artworks_connection: ({
                    readonly edges: ReadonlyArray<({
                        readonly node: ({
                            readonly id: string;
                        }) | null;
                    }) | null> | null;
                }) | null;
                readonly " $fragmentRefs": FairBoothPreview_show$ref;
            }) | null;
        }) | null> | null;
    }) | null;
    readonly " $fragmentRefs": FairHeader_fair$ref;
    readonly " $refType": FairDetail_fair$ref;
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
  "name": "name",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "FairDetail_fair",
  "type": "Fair",
  "metadata": {
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": [
          "shows"
        ]
      }
    ]
  },
  "argumentDefinitions": [
    {
      "kind": "LocalArgument",
      "name": "count",
      "type": "Int",
      "defaultValue": 5
    },
    {
      "kind": "LocalArgument",
      "name": "cursor",
      "type": "String",
      "defaultValue": null
    }
  ],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "FairHeader_fair",
      "args": null
    },
    v0,
    v1,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "hours",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "location",
      "storageKey": null,
      "args": null,
      "concreteType": "Location",
      "plural": false,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "LocationMap_location",
          "args": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "coordinates",
          "storageKey": null,
          "args": null,
          "concreteType": "LatLng",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "lat",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "lng",
              "args": null,
              "storageKey": null
            }
          ]
        },
        v2
      ]
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
        v1,
        v2
      ]
    },
    {
      "kind": "LinkedField",
      "alias": "shows",
      "name": "__Fair_shows_connection",
      "storageKey": null,
      "args": null,
      "concreteType": "ShowConnection",
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
              "name": "startCursor",
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
          "concreteType": "ShowEdge",
          "plural": true,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "cursor",
              "args": null,
              "storageKey": null
            },
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
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "artworks_connection",
                  "storageKey": "artworks_connection(first:4)",
                  "args": [
                    {
                      "kind": "Literal",
                      "name": "first",
                      "value": 4,
                      "type": "Int"
                    }
                  ],
                  "concreteType": "ArtworkConnection",
                  "plural": false,
                  "selections": [
                    {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "edges",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "ArtworkEdge",
                      "plural": true,
                      "selections": [
                        {
                          "kind": "LinkedField",
                          "alias": null,
                          "name": "node",
                          "storageKey": null,
                          "args": null,
                          "concreteType": "Artwork",
                          "plural": false,
                          "selections": [
                            v0,
                            v2
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "kind": "FragmentSpread",
                  "name": "FairBoothPreview_show",
                  "args": null
                },
                v2,
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "__typename",
                  "args": null,
                  "storageKey": null
                }
              ]
            }
          ]
        }
      ]
    },
    v2
  ]
};
})();
(node as any).hash = '0919f2e7131809a5159b757b895d32a5';
export default node;
