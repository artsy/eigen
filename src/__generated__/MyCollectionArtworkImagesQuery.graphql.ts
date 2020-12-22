/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 4bc4ebdae3eea936f8eb22d0ccc0537b */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkImagesQueryVariables = {
    artworkSlug: string;
};
export type MyCollectionArtworkImagesQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkImages_artwork">;
    } | null;
};
export type MyCollectionArtworkImagesQuery = {
    readonly response: MyCollectionArtworkImagesQueryResponse;
    readonly variables: MyCollectionArtworkImagesQueryVariables;
};



/*
query MyCollectionArtworkImagesQuery(
  $artworkSlug: String!
) {
  artwork(id: $artworkSlug) {
    ...MyCollectionArtworkImages_artwork
    id
  }
}

fragment MyCollectionArtworkImages_artwork on Artwork {
  images {
    height
    isDefault
    imageURL
    width
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "artworkSlug"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artworkSlug"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionArtworkImagesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MyCollectionArtworkImages_artwork"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MyCollectionArtworkImagesQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "images",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "height",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isDefault",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "imageURL",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "width",
                "storageKey": null
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
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "4bc4ebdae3eea936f8eb22d0ccc0537b",
    "metadata": {},
    "name": "MyCollectionArtworkImagesQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'ad6ac3fc201ed66308bb75b775768dab';
export default node;
