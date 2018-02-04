/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type ArtistRailRefetchQueryVariables = {
    readonly __id: string;
    readonly fetchContent: boolean;
};
export type ArtistRailRefetchQueryResponse = {
    readonly node: ({
    }) | null;
};



/*
query ArtistRailRefetchQuery(
  $__id: ID!
  $fetchContent: Boolean!
) {
  node(__id: $__id) {
    __typename
    ...ArtistRail_rail_abFTe
    __id
  }
}

fragment ArtistRail_rail_abFTe on HomePageArtistModule {
  __id
  key
  results @include(if: $fetchContent) {
    _id
    __id
    ...ArtistCard_artist
  }
}

fragment ArtistCard_artist on Artist {
  id
  _id
  href
  name
  formatted_artworks_count
  formatted_nationality_and_birthday
  image {
    url(version: "large")
  }
  __id
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "__id",
    "type": "ID!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "fetchContent",
    "type": "Boolean!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "__id",
    "variableName": "__id",
    "type": "ID!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "ArtistRailRefetchQuery",
  "id": null,
  "text": "query ArtistRailRefetchQuery(\n  $__id: ID!\n  $fetchContent: Boolean!\n) {\n  node(__id: $__id) {\n    __typename\n    ...ArtistRail_rail_abFTe\n    __id\n  }\n}\n\nfragment ArtistRail_rail_abFTe on HomePageArtistModule {\n  __id\n  key\n  results @include(if: $fetchContent) {\n    _id\n    __id\n    ...ArtistCard_artist\n  }\n}\n\nfragment ArtistCard_artist on Artist {\n  id\n  _id\n  href\n  name\n  formatted_artworks_count\n  formatted_nationality_and_birthday\n  image {\n    url(version: \"large\")\n  }\n  __id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ArtistRailRefetchQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": v1,
        "concreteType": null,
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ArtistRail_rail",
            "args": [
              {
                "kind": "Variable",
                "name": "fetchContent",
                "variableName": "fetchContent",
                "type": null
              }
            ]
          },
          v2
        ],
        "idField": "__id"
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtistRailRefetchQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": v1,
        "concreteType": null,
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "__typename",
            "args": null,
            "storageKey": null
          },
          v2,
          {
            "kind": "InlineFragment",
            "type": "HomePageArtistModule",
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "key",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "Condition",
                "passingValue": true,
                "condition": "fetchContent",
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "results",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Artist",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "_id",
                        "args": null,
                        "storageKey": null
                      },
                      v2,
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
                        "name": "href",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "name",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "formatted_artworks_count",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "formatted_nationality_and_birthday",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "image",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "url",
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "version",
                                "value": "large",
                                "type": "[String]"
                              }
                            ],
                            "storageKey": "url(version:\"large\")"
                          }
                        ]
                      }
                    ],
                    "idField": "__id"
                  }
                ]
              }
            ]
          }
        ],
        "idField": "__id"
      }
    ]
  }
};
})();
(node as any).hash = '83aebf6a7bfdffa29a2ebf916face80f';
export default node;
