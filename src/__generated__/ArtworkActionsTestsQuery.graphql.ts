/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { ArtworkActions_artwork$ref } from "./ArtworkActions_artwork.graphql";
export type ArtworkActionsTestsQueryVariables = {};
export type ArtworkActionsTestsQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": ArtworkActions_artwork$ref;
    } | null;
};
export type ArtworkActionsTestsQuery = {
    readonly response: ArtworkActionsTestsQueryResponse;
    readonly variables: ArtworkActionsTestsQueryVariables;
};



/*
query ArtworkActionsTestsQuery {
  artwork(id: "artworkID") {
    ...ArtworkActions_artwork
    id
  }
}

fragment ArtworkActions_artwork on Artwork {
  id
  gravityID
  title
  href
  is_saved
  artists {
    name
    id
  }
  image {
    height
    width
    url
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "artworkID"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtworkActionsTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"artworkID\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ArtworkActions_artwork",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtworkActionsTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"artworkID\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "gravityID",
            "args": null,
            "storageKey": null
          },
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
            "name": "is_saved",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artists",
            "storageKey": null,
            "args": null,
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
              (v1/*: any*/)
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
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ArtworkActionsTestsQuery",
    "id": "59a1376d3c19646ffbd615cdd4d3d626",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'c9249197ed2f682681da1782dcc1ae34';
export default node;
