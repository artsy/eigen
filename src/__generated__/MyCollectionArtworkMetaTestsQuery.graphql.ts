/* tslint:disable */
/* eslint-disable */
/* @relayHash 631eff845e23832169bfbc9ead3e84ae */

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
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v4 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": true
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyCollectionArtworkMetaTestsQuery",
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
            "kind": "FragmentSpread",
            "name": "MyCollectionArtworkMeta_artwork",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyCollectionArtworkMetaTestsQuery",
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
              (v2/*: any*/)
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "artistNames",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "category",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "costMinor",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "costCurrencyCode",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "date",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "depth",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "height",
            "args": null,
            "storageKey": null
          },
          (v2/*: any*/),
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
                "args": null,
                "storageKey": null
              }
            ]
          },
          (v1/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "medium",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "metric",
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
            "kind": "ScalarField",
            "alias": null,
            "name": "title",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "width",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "MyCollectionArtworkMetaTestsQuery",
    "id": "aac1d97677369d81e2a075340fde312b",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artwork": {
          "type": "Artwork",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.id": (v3/*: any*/),
        "artwork.artist": {
          "type": "Artist",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artistNames": (v4/*: any*/),
        "artwork.category": (v4/*: any*/),
        "artwork.costMinor": {
          "type": "Int",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.costCurrencyCode": (v4/*: any*/),
        "artwork.date": (v4/*: any*/),
        "artwork.depth": (v4/*: any*/),
        "artwork.height": (v4/*: any*/),
        "artwork.image": {
          "type": "Image",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.internalID": (v3/*: any*/),
        "artwork.medium": (v4/*: any*/),
        "artwork.metric": (v4/*: any*/),
        "artwork.slug": (v3/*: any*/),
        "artwork.title": (v4/*: any*/),
        "artwork.width": (v4/*: any*/),
        "artwork.artist.internalID": (v3/*: any*/),
        "artwork.artist.id": {
          "type": "ID",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.image.url": (v4/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = '3ad4639bc2a617f78d4d4558e80ba4bd';
export default node;
