/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { ShowArtistsPreview_show$ref } from "./ShowArtistsPreview_show.graphql";
export type ShowArtistsPreviewTestsQueryVariables = {};
export type ShowArtistsPreviewTestsQueryResponse = {
    readonly show: ({
        readonly " $fragmentRefs": ShowArtistsPreview_show$ref;
    }) | null;
};
export type ShowArtistsPreviewTestsQuery = {
    readonly response: ShowArtistsPreviewTestsQueryResponse;
    readonly variables: ShowArtistsPreviewTestsQueryVariables;
};



/*
query ShowArtistsPreviewTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
    ...ShowArtistsPreview_show
    __id
  }
}

fragment ShowArtistsPreview_show on Show {
  _id
  id
  artists {
    _id
    id
    href
    ...ArtistListItem_artist
    __id
  }
  artists_without_artworks {
    _id
    id
    href
    ...ArtistListItem_artist
    __id
  }
  __id
}

fragment ArtistListItem_artist on Artist {
  __id
  _id
  id
  name
  is_followed
  nationality
  birthday
  deathday
  image {
    url
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "anderson-fine-art-gallery-flickinger-collection",
    "type": "String!"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "_id",
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
v4 = [
  v2,
  v3,
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "href",
    "args": null,
    "storageKey": null
  },
  v1,
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
    "name": "is_followed",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "nationality",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "birthday",
    "args": null,
    "storageKey": null
  },
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "deathday",
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
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "ShowArtistsPreviewTestsQuery",
  "id": "d9cca615ce67b2598f4ec00bd0044d80",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ShowArtistsPreviewTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": v0,
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ShowArtistsPreview_show",
            "args": null
          },
          v1
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ShowArtistsPreviewTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": v0,
        "concreteType": "Show",
        "plural": false,
        "selections": [
          v2,
          v3,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artists",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": true,
            "selections": v4
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artists_without_artworks",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": true,
            "selections": v4
          },
          v1
        ]
      }
    ]
  }
};
})();
(node as any).hash = '64a178290c2d0214fc7b8844da6be0a2';
export default node;
