/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 12125805ab6a122d91732b715be527e3 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistConsignButtonTestsQueryVariables = {};
export type ArtistConsignButtonTestsQueryResponse = {
    readonly artist: {
        readonly " $fragmentRefs": FragmentRefs<"ArtistConsignButton_artist">;
    } | null;
};
export type ArtistConsignButtonTestsQuery = {
    readonly response: ArtistConsignButtonTestsQueryResponse;
    readonly variables: ArtistConsignButtonTestsQueryVariables;
};



/*
query ArtistConsignButtonTestsQuery {
  artist(id: "alex-katz") {
    ...ArtistConsignButton_artist
    id
  }
}

fragment ArtistConsignButton_artist on Artist {
  targetSupply {
    isInMicrofunnel
    isTargetSupply
  }
  internalID
  slug
  name
  image {
    cropped(width: 66, height: 66) {
      url
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "alex-katz"
  }
],
v1 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v2 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistConsignButtonTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ArtistConsignButton_artist"
          }
        ],
        "storageKey": "artist(id:\"alex-katz\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ArtistConsignButtonTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ArtistTargetSupply",
            "kind": "LinkedField",
            "name": "targetSupply",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isInMicrofunnel",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isTargetSupply",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "internalID",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "slug",
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
            "alias": null,
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "image",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "height",
                    "value": 66
                  },
                  {
                    "kind": "Literal",
                    "name": "width",
                    "value": 66
                  }
                ],
                "concreteType": "CroppedImageUrl",
                "kind": "LinkedField",
                "name": "cropped",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "url",
                    "storageKey": null
                  }
                ],
                "storageKey": "cropped(height:66,width:66)"
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": "artist(id:\"alex-katz\")"
      }
    ]
  },
  "params": {
    "id": "12125805ab6a122d91732b715be527e3",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artist": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artist"
        },
        "artist.id": (v1/*: any*/),
        "artist.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "artist.image.cropped": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CroppedImageUrl"
        },
        "artist.image.cropped.url": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "String"
        },
        "artist.internalID": (v1/*: any*/),
        "artist.name": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "String"
        },
        "artist.slug": (v1/*: any*/),
        "artist.targetSupply": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArtistTargetSupply"
        },
        "artist.targetSupply.isInMicrofunnel": (v2/*: any*/),
        "artist.targetSupply.isTargetSupply": (v2/*: any*/)
      }
    },
    "name": "ArtistConsignButtonTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '55528981952ad710b65be9a8f3d77612';
export default node;
