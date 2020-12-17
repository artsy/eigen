/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash f1a743e85490355180b334aec5c5ac54 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkHeaderTestsQueryVariables = {};
export type MyCollectionArtworkHeaderTestsQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkHeader_artwork">;
    } | null;
};
export type MyCollectionArtworkHeaderTestsQuery = {
    readonly response: MyCollectionArtworkHeaderTestsQueryResponse;
    readonly variables: MyCollectionArtworkHeaderTestsQueryVariables;
};



/*
query MyCollectionArtworkHeaderTestsQuery {
  artwork(id: "some-slug") {
    ...MyCollectionArtworkHeader_artwork
    id
  }
}

fragment MyCollectionArtworkHeader_artwork on Artwork {
  artistNames
  date
  images {
    height
    isDefault
    imageURL
    width
    internalID
  }
  internalID
  title
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "some-slug"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v2 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v3 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v4 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionArtworkHeaderTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MyCollectionArtworkHeader_artwork"
          }
        ],
        "storageKey": "artwork(id:\"some-slug\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MyCollectionArtworkHeaderTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "artistNames",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "date",
            "storageKey": null
          },
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
              },
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "title",
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
        "storageKey": "artwork(id:\"some-slug\")"
      }
    ]
  },
  "params": {
    "id": "f1a743e85490355180b334aec5c5ac54",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "artwork.artistNames": (v2/*: any*/),
        "artwork.date": (v2/*: any*/),
        "artwork.id": (v3/*: any*/),
        "artwork.images": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Image"
        },
        "artwork.images.height": (v4/*: any*/),
        "artwork.images.imageURL": (v2/*: any*/),
        "artwork.images.internalID": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ID"
        },
        "artwork.images.isDefault": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Boolean"
        },
        "artwork.images.width": (v4/*: any*/),
        "artwork.internalID": (v3/*: any*/),
        "artwork.title": (v2/*: any*/)
      }
    },
    "name": "MyCollectionArtworkHeaderTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'f973d28ccb9233e48337c162c0d8daa6';
export default node;
