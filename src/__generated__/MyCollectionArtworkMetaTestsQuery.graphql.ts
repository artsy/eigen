/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash ae1fd3275b0e12d911ca8dc92f8a9fab */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkMetaTestsQueryVariables = {};
export type MyCollectionArtworkMetaTestsQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkMeta_artwork">;
    } | null;
};
export type MyCollectionArtworkMetaTestsQuery = {
    readonly response: MyCollectionArtworkMetaTestsQueryResponse;
    readonly variables: MyCollectionArtworkMetaTestsQueryVariables;
};



/*
query MyCollectionArtworkMetaTestsQuery {
  artwork(id: "some-slug") {
    ...MyCollectionArtworkMeta_artwork
    id
  }
}

fragment MyCollectionArtworkMeta_artwork on Artwork {
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
  editionSize
  editionNumber
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
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
  "type": "String"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionArtworkMetaTestsQuery",
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
            "name": "MyCollectionArtworkMeta_artwork"
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
    "name": "MyCollectionArtworkMetaTestsQuery",
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
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artist",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          },
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
            "name": "category",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "costMinor",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "costCurrencyCode",
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
            "kind": "ScalarField",
            "name": "depth",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "editionSize",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "editionNumber",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "height",
            "storageKey": null
          },
          (v2/*: any*/),
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
                "args": null,
                "kind": "ScalarField",
                "name": "url",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "medium",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "metric",
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
            "name": "title",
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
        "storageKey": "artwork(id:\"some-slug\")"
      }
    ]
  },
  "params": {
    "id": "ae1fd3275b0e12d911ca8dc92f8a9fab",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "artwork.artist": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artist"
        },
        "artwork.artist.id": (v3/*: any*/),
        "artwork.artist.internalID": (v3/*: any*/),
        "artwork.artistNames": (v4/*: any*/),
        "artwork.category": (v4/*: any*/),
        "artwork.costCurrencyCode": (v4/*: any*/),
        "artwork.costMinor": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Int"
        },
        "artwork.date": (v4/*: any*/),
        "artwork.depth": (v4/*: any*/),
        "artwork.editionNumber": (v4/*: any*/),
        "artwork.editionSize": (v4/*: any*/),
        "artwork.height": (v4/*: any*/),
        "artwork.id": (v3/*: any*/),
        "artwork.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "artwork.image.url": (v4/*: any*/),
        "artwork.internalID": (v3/*: any*/),
        "artwork.medium": (v4/*: any*/),
        "artwork.metric": (v4/*: any*/),
        "artwork.slug": (v3/*: any*/),
        "artwork.title": (v4/*: any*/),
        "artwork.width": (v4/*: any*/)
      }
    },
    "name": "MyCollectionArtworkMetaTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '3ad4639bc2a617f78d4d4558e80ba4bd';
export default node;
