/* tslint:disable */
/* eslint-disable */
/* @relayHash ce8b860dfb267c6c1a5391bb7664e53b */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2TestsQueryVariables = {
    fairID: string;
};
export type Fair2TestsQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"Fair2_fair">;
    } | null;
};
export type Fair2TestsQueryRawResponse = {
    readonly fair: ({
        readonly about: string | null;
        readonly summary: string | null;
        readonly name: string | null;
        readonly slug: string;
        readonly profile: ({
            readonly icon: ({
                readonly url: string | null;
            }) | null;
            readonly id: string | null;
        }) | null;
        readonly image: ({
            readonly url: string | null;
            readonly aspectRatio: number;
        }) | null;
        readonly tagline: string | null;
        readonly location: ({
            readonly summary: string | null;
            readonly id: string | null;
        }) | null;
        readonly ticketsLink: string | null;
        readonly hours: string | null;
        readonly links: string | null;
        readonly tickets: string | null;
        readonly contact: string | null;
        readonly articles: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly title: string | null;
                    readonly href: string | null;
                    readonly publishedAt: string | null;
                    readonly thumbnailImage: ({
                        readonly src: string | null;
                    }) | null;
                }) | null;
            }) | null> | null;
        }) | null;
        readonly id: string | null;
    }) | null;
};
export type Fair2TestsQuery = {
    readonly response: Fair2TestsQueryResponse;
    readonly variables: Fair2TestsQueryVariables;
    readonly rawResponse: Fair2TestsQueryRawResponse;
};



/*
query Fair2TestsQuery(
  $fairID: String!
) {
  fair(id: $fairID) {
    ...Fair2_fair
    id
  }
}

fragment Fair2Editorial_fair on Fair {
  articles: articlesConnection(first: 5, sort: PUBLISHED_AT_DESC) {
    edges {
      node {
        id
        title
        href
        publishedAt(format: "MMM Do, YY")
        thumbnailImage {
          src: imageURL
        }
      }
    }
  }
}

fragment Fair2Header_fair on Fair {
  about
  summary
  name
  slug
  profile {
    icon {
      url(version: "untouched-png")
    }
    id
  }
  image {
    url(version: "large_rectangle")
    aspectRatio
  }
  tagline
  location {
    summary
    id
  }
  ticketsLink
  hours(format: HTML)
  links(format: HTML)
  tickets(format: HTML)
  contact(format: HTML)
}

fragment Fair2_fair on Fair {
  ...Fair2Header_fair
  ...Fair2Editorial_fair
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "fairID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "fairID"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "summary",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = [
  {
    "kind": "Literal",
    "name": "format",
    "value": "HTML"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "Fair2TestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Fair2_fair",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "Fair2TestsQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "about",
            "args": null,
            "storageKey": null
          },
          (v2/*: any*/),
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
            "name": "slug",
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
                "kind": "LinkedField",
                "alias": null,
                "name": "icon",
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
                        "value": "untouched-png"
                      }
                    ],
                    "storageKey": "url(version:\"untouched-png\")"
                  }
                ]
              },
              (v3/*: any*/)
            ]
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
                    "value": "large_rectangle"
                  }
                ],
                "storageKey": "url(version:\"large_rectangle\")"
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "aspectRatio",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "tagline",
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
              (v2/*: any*/),
              (v3/*: any*/)
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "ticketsLink",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "hours",
            "args": (v4/*: any*/),
            "storageKey": "hours(format:\"HTML\")"
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "links",
            "args": (v4/*: any*/),
            "storageKey": "links(format:\"HTML\")"
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "tickets",
            "args": (v4/*: any*/),
            "storageKey": "tickets(format:\"HTML\")"
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "contact",
            "args": (v4/*: any*/),
            "storageKey": "contact(format:\"HTML\")"
          },
          {
            "kind": "LinkedField",
            "alias": "articles",
            "name": "articlesConnection",
            "storageKey": "articlesConnection(first:5,sort:\"PUBLISHED_AT_DESC\")",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 5
              },
              {
                "kind": "Literal",
                "name": "sort",
                "value": "PUBLISHED_AT_DESC"
              }
            ],
            "concreteType": "ArticleConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ArticleEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Article",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "title",
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
                        "name": "publishedAt",
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "format",
                            "value": "MMM Do, YY"
                          }
                        ],
                        "storageKey": "publishedAt(format:\"MMM Do, YY\")"
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "thumbnailImage",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": "src",
                            "name": "imageURL",
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
          },
          (v3/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "Fair2TestsQuery",
    "id": "41d7a774c6600114e3d6c17fa51e311f",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'f798451e6e6d390e226e7d5ffcf097fd';
export default node;
