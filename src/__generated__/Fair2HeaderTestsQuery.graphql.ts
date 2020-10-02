/* tslint:disable */
/* eslint-disable */
/* @relayHash a04e54ff06121e9e569e03ccf27448f9 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2HeaderTestsQueryVariables = {
    fairID: string;
};
export type Fair2HeaderTestsQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"Fair2Header_fair">;
    } | null;
};
export type Fair2HeaderTestsQueryRawResponse = {
    readonly fair: ({
        readonly about: string | null;
        readonly summary: string | null;
        readonly name: string | null;
        readonly slug: string;
        readonly profile: ({
            readonly icon: ({
                readonly profileUrl: string | null;
            }) | null;
            readonly id: string | null;
        }) | null;
        readonly image: ({
            readonly imageUrl: string | null;
            readonly aspectRatio: number;
        }) | null;
        readonly tagline: string | null;
        readonly location: ({
            readonly summary: string | null;
            readonly id: string | null;
        }) | null;
        readonly ticketsLink: string | null;
        readonly fairHours: string | null;
        readonly fairLinks: string | null;
        readonly fairTickets: string | null;
        readonly fairContact: string | null;
        readonly id: string | null;
    }) | null;
};
export type Fair2HeaderTestsQuery = {
    readonly response: Fair2HeaderTestsQueryResponse;
    readonly variables: Fair2HeaderTestsQueryVariables;
    readonly rawResponse: Fair2HeaderTestsQueryRawResponse;
};



/*
query Fair2HeaderTestsQuery(
  $fairID: String!
) {
  fair(id: $fairID) {
    ...Fair2Header_fair
    id
  }
}

fragment Fair2Header_fair on Fair {
  about
  summary
  name
  slug
  profile {
    icon {
      profileUrl: url(version: "untouched-png")
    }
    id
  }
  image {
    imageUrl: url(version: "large_rectangle")
    aspectRatio
  }
  tagline
  location {
    summary
    id
  }
  ticketsLink
  fairHours: hours(format: MARKDOWN)
  fairLinks: links(format: MARKDOWN)
  fairTickets: tickets(format: MARKDOWN)
  fairContact: contact(format: MARKDOWN)
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
    "value": "MARKDOWN"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "Fair2HeaderTestsQuery",
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
            "name": "Fair2Header_fair",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "Fair2HeaderTestsQuery",
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
                    "alias": "profileUrl",
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
                "alias": "imageUrl",
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
            "alias": "fairHours",
            "name": "hours",
            "args": (v4/*: any*/),
            "storageKey": "hours(format:\"MARKDOWN\")"
          },
          {
            "kind": "ScalarField",
            "alias": "fairLinks",
            "name": "links",
            "args": (v4/*: any*/),
            "storageKey": "links(format:\"MARKDOWN\")"
          },
          {
            "kind": "ScalarField",
            "alias": "fairTickets",
            "name": "tickets",
            "args": (v4/*: any*/),
            "storageKey": "tickets(format:\"MARKDOWN\")"
          },
          {
            "kind": "ScalarField",
            "alias": "fairContact",
            "name": "contact",
            "args": (v4/*: any*/),
            "storageKey": "contact(format:\"MARKDOWN\")"
          },
          (v3/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "Fair2HeaderTestsQuery",
    "id": "28b614ea571b485d9db277c8111262c2",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'd67f7b938f15488dd0d372a50194cc9b';
export default node;
