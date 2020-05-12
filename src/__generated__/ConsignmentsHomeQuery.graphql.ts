/* tslint:disable */
/* eslint-disable */
/* @relayHash 78b42ac7dc7e67deec727a49d60d4012 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ConsignmentsHomeQueryVariables = {
    artistIDs: Array<string>;
};
export type ConsignmentsHomeQueryResponse = {
    readonly artists: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"ConsignmentsHome_artists">;
    } | null> | null;
};
export type ConsignmentsHomeQuery = {
    readonly response: ConsignmentsHomeQueryResponse;
    readonly variables: ConsignmentsHomeQueryVariables;
};



/*
query ConsignmentsHomeQuery(
  $artistIDs: [String!]!
) {
  artists(ids: $artistIDs) {
    ...ConsignmentsHome_artists
    id
  }
}

fragment ArtistList_artists on Artist {
  name
  href
  image {
    cropped(width: 76, height: 70) {
      url
      width
      height
    }
  }
}

fragment ConsignmentsHome_artists on Artist {
  ...ArtistList_artists
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "artistIDs",
    "type": "[String!]!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "ids",
    "variableName": "artistIDs"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ConsignmentsHomeQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artists",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "plural": true,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ConsignmentsHome_artists",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ConsignmentsHomeQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artists",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "plural": true,
        "selections": [
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
            "name": "href",
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
                "kind": "LinkedField",
                "alias": null,
                "name": "cropped",
                "storageKey": "cropped(height:70,width:76)",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "height",
                    "value": 70
                  },
                  {
                    "kind": "Literal",
                    "name": "width",
                    "value": 76
                  }
                ],
                "concreteType": "CroppedImageUrl",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "url",
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
                    "name": "height",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ConsignmentsHomeQuery",
    "id": "b0daafd2f68d5c2ed10fe95390da0ebe",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'c00d31f6f91b114afe50f7be7883278b';
export default node;
