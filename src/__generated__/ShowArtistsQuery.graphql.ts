/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { ShowArtists_show$ref } from "./ShowArtists_show.graphql";
export type ShowArtistsQueryVariables = {
    readonly showID: string;
};
export type ShowArtistsQueryResponse = {
    readonly show: ({
        readonly " $fragmentRefs": ShowArtists_show$ref;
    }) | null;
};
export type ShowArtistsQuery = {
    readonly response: ShowArtistsQueryResponse;
    readonly variables: ShowArtistsQueryVariables;
};



/*
query ShowArtistsQuery(
  $showID: String!
) {
  show(id: $showID) {
    ...ShowArtists_show
    __id: id
  }
}

fragment ShowArtists_show on Show {
  internalID
  gravityID
  artists_grouped_by_name {
    letter
    items {
      ...ArtistListItem_artist
      sortable_id
      href
      __id: id
    }
  }
  __id: id
}

fragment ArtistListItem_artist on Artist {
  id
  internalID
  gravityID
  name
  is_followed
  nationality
  birthday
  deathday
  image {
    url
  }
  __id: id
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "showID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "showID",
    "type": "String!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "gravityID",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "ShowArtistsQuery",
  "id": null,
  "text": "query ShowArtistsQuery(\n  $showID: String!\n) {\n  show(id: $showID) {\n    ...ShowArtists_show\n    __id: id\n  }\n}\n\nfragment ShowArtists_show on Show {\n  internalID\n  gravityID\n  artists_grouped_by_name {\n    letter\n    items {\n      ...ArtistListItem_artist\n      sortable_id\n      href\n      __id: id\n    }\n  }\n  __id: id\n}\n\nfragment ArtistListItem_artist on Artist {\n  id\n  internalID\n  gravityID\n  name\n  is_followed\n  nationality\n  birthday\n  deathday\n  image {\n    url\n  }\n  __id: id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ShowArtistsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": null,
        "args": v1,
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ShowArtists_show",
            "args": null
          },
          v2
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ShowArtistsQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": null,
        "args": v1,
        "concreteType": "Show",
        "plural": false,
        "selections": [
          v3,
          v4,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artists_grouped_by_name",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtistGroup",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "letter",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "items",
                "storageKey": null,
                "args": null,
                "concreteType": "Artist",
                "plural": true,
                "selections": [
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
                    "name": "id",
                    "args": null,
                    "storageKey": null
                  },
                  v4,
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
                  v3,
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
                  },
                  v2,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "sortable_id",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "href",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
          v2
        ]
      }
    ]
  }
};
})();
(node as any).hash = '6df07207a68e180b435619e641ce4a18';
export default node;
