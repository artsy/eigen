/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FairHeader_fair$ref } from "./FairHeader_fair.graphql";
export type indexTestsFairHeaderQueryVariables = {};
export type indexTestsFairHeaderQueryResponse = {
    readonly fair: ({
        readonly " $fragmentRefs": FairHeader_fair$ref;
    }) | null;
};
export type indexTestsFairHeaderQuery = {
    readonly response: indexTestsFairHeaderQueryResponse;
    readonly variables: indexTestsFairHeaderQueryVariables;
};



/*
query indexTestsFairHeaderQuery {
  fair(id: "sofa-chicago-2018") {
    ...FairHeader_fair
    __id: id
  }
}

fragment FairHeader_fair on Fair {
  gravityID
  internalID
  name
  formattedOpeningHours
  counts {
    artists
    partners
  }
  followed_content {
    artists {
      name
      href
      gravityID
      internalID
      __id: id
    }
    galleries {
      internalID
      name
      __id: id
    }
  }
  partner_names: shows_connection(first: 2) {
    edges {
      node {
        gravityID
        partner {
          __typename
          ... on Partner {
            profile {
              name
              gravityID
              internalID
              __id: id
            }
          }
          ... on Node {
            __id: id
          }
          ... on ExternalPartner {
            __id: id
          }
        }
        __id: id
      }
    }
  }
  artists_names: artists(first: 3) {
    edges {
      node {
        name
        href
        gravityID
        internalID
        __id: id
      }
    }
  }
  image {
    image_url
    aspect_ratio
    url
  }
  profile {
    icon {
      gravityID
      href
      height
      width
      url(version: "square140")
    }
    id
    gravityID
    name
    is_followed
    __id: id
  }
  start_at
  end_at
  exhibition_period
  __id: id
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "sofa-chicago-2018",
    "type": "String!"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "gravityID",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v6 = [
  v2,
  v3,
  v4,
  v5,
  v1
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "indexTestsFairHeaderQuery",
  "id": null,
  "text": "query indexTestsFairHeaderQuery {\n  fair(id: \"sofa-chicago-2018\") {\n    ...FairHeader_fair\n    __id: id\n  }\n}\n\nfragment FairHeader_fair on Fair {\n  gravityID\n  internalID\n  name\n  formattedOpeningHours\n  counts {\n    artists\n    partners\n  }\n  followed_content {\n    artists {\n      name\n      href\n      gravityID\n      internalID\n      __id: id\n    }\n    galleries {\n      internalID\n      name\n      __id: id\n    }\n  }\n  partner_names: shows_connection(first: 2) {\n    edges {\n      node {\n        gravityID\n        partner {\n          __typename\n          ... on Partner {\n            profile {\n              name\n              gravityID\n              internalID\n              __id: id\n            }\n          }\n          ... on Node {\n            __id: id\n          }\n          ... on ExternalPartner {\n            __id: id\n          }\n        }\n        __id: id\n      }\n    }\n  }\n  artists_names: artists(first: 3) {\n    edges {\n      node {\n        name\n        href\n        gravityID\n        internalID\n        __id: id\n      }\n    }\n  }\n  image {\n    image_url\n    aspect_ratio\n    url\n  }\n  profile {\n    icon {\n      gravityID\n      href\n      height\n      width\n      url(version: \"square140\")\n    }\n    id\n    gravityID\n    name\n    is_followed\n    __id: id\n  }\n  start_at\n  end_at\n  exhibition_period\n  __id: id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "indexTestsFairHeaderQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": "fair(id:\"sofa-chicago-2018\")",
        "args": v0,
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "FairHeader_fair",
            "args": null
          },
          v1
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "indexTestsFairHeaderQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": "fair(id:\"sofa-chicago-2018\")",
        "args": v0,
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": "artists_names",
            "name": "artists",
            "storageKey": "artists(first:3)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 3,
                "type": "Int"
              }
            ],
            "concreteType": "ArtistConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ArtistEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Artist",
                    "plural": false,
                    "selections": v6
                  }
                ]
              }
            ]
          },
          v4,
          v2,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "formattedOpeningHours",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "counts",
            "storageKey": null,
            "args": null,
            "concreteType": "FairCounts",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "artists",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "partners",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "followed_content",
            "storageKey": null,
            "args": null,
            "concreteType": "FollowedContent",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "artists",
                "storageKey": null,
                "args": null,
                "concreteType": "Artist",
                "plural": true,
                "selections": v6
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "galleries",
                "storageKey": null,
                "args": null,
                "concreteType": "Partner",
                "plural": true,
                "selections": [
                  v5,
                  v2,
                  v1
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "partner_names",
            "name": "shows_connection",
            "storageKey": "shows_connection(first:2)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 2,
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
                      v4,
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
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
                          v1,
                          {
                            "kind": "InlineFragment",
                            "type": "Partner",
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "profile",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "Profile",
                                "plural": false,
                                "selections": [
                                  v2,
                                  v4,
                                  v5,
                                  v1
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      v1
                    ]
                  }
                ]
              }
            ]
          },
          v5,
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
                "name": "image_url",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "aspect_ratio",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "url",
                "args": null,
                "storageKey": null
              }
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
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "icon",
                "storageKey": null,
                "args": null,
                "concreteType": "Image",
                "plural": false,
                "selections": [
                  v4,
                  v3,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "height",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "width",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "url",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "version",
                        "value": "square140",
                        "type": "[String]"
                      }
                    ],
                    "storageKey": "url(version:\"square140\")"
                  }
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "id",
                "args": null,
                "storageKey": null
              },
              v4,
              v2,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "is_followed",
                "args": null,
                "storageKey": null
              },
              v1
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "start_at",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "end_at",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "exhibition_period",
            "args": null,
            "storageKey": null
          },
          v1
        ]
      }
    ]
  }
};
})();
(node as any).hash = '5ef9b6e4aa7c6762bd2dd66872aa8eb0';
export default node;
