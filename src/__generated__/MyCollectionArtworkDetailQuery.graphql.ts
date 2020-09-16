/* tslint:disable */
/* eslint-disable */
/* @relayHash 9b760cb8e7c917b6c53da0e340138aef */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkDetailQueryVariables = {
    artworkID: string;
};
export type MyCollectionArtworkDetailQueryResponse = {
    readonly artwork: {
        readonly artist: {
            readonly internalID: string;
        } | null;
        readonly medium: string | null;
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkHeader_artwork" | "MyCollectionArtworkMeta_artwork" | "MyCollectionArtworkInsights_artwork">;
    } | null;
};
export type MyCollectionArtworkDetailQuery = {
    readonly response: MyCollectionArtworkDetailQueryResponse;
    readonly variables: MyCollectionArtworkDetailQueryVariables;
};



/*
query MyCollectionArtworkDetailQuery(
  $artworkID: String!
) {
  artwork(id: $artworkID) {
    artist {
      internalID
      id
    }
    medium
    ...MyCollectionArtworkHeader_artwork
    ...MyCollectionArtworkMeta_artwork
    ...MyCollectionArtworkInsights_artwork
    id
  }
}

fragment MyCollectionArtworkArtistArticles_artwork on Artwork {
  id
}

fragment MyCollectionArtworkArtistAuctionResults_artwork on Artwork {
  id
}

fragment MyCollectionArtworkHeader_artwork on Artwork {
  artistNames
  date
  image {
    url
  }
  title
}

fragment MyCollectionArtworkInsights_artwork on Artwork {
  ...MyCollectionArtworkArtistAuctionResults_artwork
  ...MyCollectionArtworkArtistArticles_artwork
}

fragment MyCollectionArtworkMeta_artwork on Artwork {
  title
  artistNames
  date
  medium
  category
  height
  width
  depth
  metric
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "artworkID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artworkID"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "medium",
  "args": null,
  "storageKey": null
},
v4 = {
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
    "name": "MyCollectionArtworkDetailQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/)
            ]
          },
          (v3/*: any*/),
          {
            "kind": "FragmentSpread",
            "name": "MyCollectionArtworkHeader_artwork",
            "args": null
          },
          {
            "kind": "FragmentSpread",
            "name": "MyCollectionArtworkMeta_artwork",
            "args": null
          },
          {
            "kind": "FragmentSpread",
            "name": "MyCollectionArtworkInsights_artwork",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyCollectionArtworkDetailQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/),
              (v4/*: any*/)
            ]
          },
          (v3/*: any*/),
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
            "name": "date",
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
                "kind": "ScalarField",
                "alias": null,
                "name": "url",
                "args": null,
                "storageKey": null
              }
            ]
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
            "name": "category",
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
            "name": "depth",
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
          (v4/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "MyCollectionArtworkDetailQuery",
    "id": "dd83d7fa9bd3b67c3ab7a6cf8eea9630",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '961d90c0e9dfc0c4d0e67455f083d3de';
export default node;
