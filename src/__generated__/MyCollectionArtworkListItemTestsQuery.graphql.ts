/* tslint:disable */
/* eslint-disable */
/* @relayHash ac2b80d4e459526219aa49194cb961a7 */

import { ConcreteRequest } from "relay-runtime";
export type MyCollectionArtworkListItemTestsQueryVariables = {};
export type MyCollectionArtworkListItemTestsQueryResponse = {
    readonly artwork: {
        readonly artist: {
            readonly internalID: string;
        } | null;
        readonly artistNames: string | null;
        readonly category: string | null;
        readonly costMinor: number | null;
        readonly costCurrencyCode: string | null;
        readonly date: string | null;
        readonly depth: string | null;
        readonly height: string | null;
        readonly id: string;
        readonly image: {
            readonly url: string | null;
        } | null;
        readonly internalID: string;
        readonly medium: string | null;
        readonly metric: string | null;
        readonly slug: string;
        readonly title: string | null;
        readonly width: string | null;
    } | null;
};
export type MyCollectionArtworkListItemTestsQuery = {
    readonly response: MyCollectionArtworkListItemTestsQueryResponse;
    readonly variables: MyCollectionArtworkListItemTestsQueryVariables;
};



/*
query MyCollectionArtworkListItemTestsQuery {
  artwork(id: "some-slug") {
    artist {
      internalID
      id
    }
    artistNames
    category
    costMinor
    costCurrencyCode
    date
    depth
    height
    id
    image {
      url
    }
    internalID
    medium
    metric
    slug
    title
    width
  }
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
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "artistNames",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "category",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "costMinor",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "costCurrencyCode",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "date",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "depth",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "height",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v10 = {
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
      "args": null,
      "storageKey": null
    }
  ]
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "medium",
  "args": null,
  "storageKey": null
},
v12 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "metric",
  "args": null,
  "storageKey": null
},
v13 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v14 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v15 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "width",
  "args": null,
  "storageKey": null
},
v16 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v17 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": true
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyCollectionArtworkListItemTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"some-slug\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artist",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": false,
            "selections": [
              (v1/*: any*/)
            ]
          },
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v1/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/)
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyCollectionArtworkListItemTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"some-slug\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artist",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v9/*: any*/)
            ]
          },
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          (v1/*: any*/),
          (v11/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v14/*: any*/),
          (v15/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "MyCollectionArtworkListItemTestsQuery",
    "id": "89b41bb5433d9334a23873894f1257bd",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artwork": {
          "type": "Artwork",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.id": (v16/*: any*/),
        "artwork.artist": {
          "type": "Artist",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artistNames": (v17/*: any*/),
        "artwork.category": (v17/*: any*/),
        "artwork.costMinor": {
          "type": "Int",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.costCurrencyCode": (v17/*: any*/),
        "artwork.date": (v17/*: any*/),
        "artwork.depth": (v17/*: any*/),
        "artwork.height": (v17/*: any*/),
        "artwork.image": {
          "type": "Image",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.internalID": (v16/*: any*/),
        "artwork.medium": (v17/*: any*/),
        "artwork.metric": (v17/*: any*/),
        "artwork.slug": (v16/*: any*/),
        "artwork.title": (v17/*: any*/),
        "artwork.width": (v17/*: any*/),
        "artwork.artist.internalID": (v16/*: any*/),
        "artwork.artist.id": {
          "type": "ID",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.image.url": (v17/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = '7efc193782636dd8c999646e081795cc';
export default node;
