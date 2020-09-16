/* tslint:disable */
/* eslint-disable */
/* @relayHash fd61d5339d15284be25f8ab6cca27ee2 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkDetailQueryVariables = {
    artworkID: string;
};
export type MyCollectionArtworkDetailQueryResponse = {
    readonly artwork: {
        readonly internalID: string;
        readonly id: string;
        readonly artistNames: string | null;
        readonly artist: {
            readonly internalID: string;
        } | null;
        readonly medium: string | null;
        readonly title: string | null;
        readonly date: string | null;
        readonly category: string | null;
        readonly dimensions: {
            readonly in: string | null;
            readonly cm: string | null;
        } | null;
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
    internalID
    id
    artistNames
    artist {
      internalID
      id
    }
    medium
    title
    date
    category
    dimensions {
      in
      cm
    }
    ...MyCollectionArtworkHeader_artwork
    ...MyCollectionArtworkMeta_artwork
    ...MyCollectionArtworkInsights_artwork
  }
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
  id
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
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "artistNames",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "medium",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "date",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "category",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "dimensions",
  "storageKey": null,
  "args": null,
  "concreteType": "dimensions",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "in",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "cm",
      "args": null,
      "storageKey": null
    }
  ]
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
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
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
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
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
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
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
              (v3/*: any*/)
            ]
          },
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
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
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "MyCollectionArtworkDetailQuery",
    "id": "929623d55f63954844db75de82e24ec7",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '4812ce91bc1150e6ccd00d6c979628ed';
export default node;
