/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 4db73e6790571e71f3d411d7a7289ae0 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ConversationDetailsQueryVariables = {
    conversationID: string;
};
export type ConversationDetailsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"ConversationDetails_me">;
    } | null;
};
export type ConversationDetailsQuery = {
    readonly response: ConversationDetailsQueryResponse;
    readonly variables: ConversationDetailsQueryVariables;
};



/*
query ConversationDetailsQuery(
  $conversationID: String!
) {
  me {
    ...ConversationDetails_me
    id
  }
}

fragment AttachmentList_messageConnection on MessageConnection {
  edges {
    node {
      attachments {
        id
        contentType
        ...FileDownload_attachment
      }
      id
    }
  }
}

fragment AttachmentPreview_attachment on Attachment {
  internalID
}

fragment ConversationDetails_me on Me {
  conversation(id: $conversationID) {
    internalID
    id
    to {
      name
      initials
      id
    }
    from {
      email
      id
    }
    messagesConnection(first: 30, sort: DESC) {
      edges {
        __typename
        cursor
        node {
          __typename
          id
        }
      }
      ...AttachmentList_messageConnection
      pageInfo {
        endCursor
        hasNextPage
      }
    }
    items {
      item {
        __typename
        ... on Artwork {
          href
        }
        ... on Show {
          href
        }
        ...ItemInfo_item
        ... on Node {
          __isNode: __typename
          id
        }
      }
    }
  }
}

fragment FileDownload_attachment on Attachment {
  fileName
  downloadURL
  ...AttachmentPreview_attachment
}

fragment ItemInfo_item on ConversationItemType {
  __isConversationItemType: __typename
  __typename
  ... on Artwork {
    href
    image {
      thumbnailUrl: url(version: "small")
    }
    title
    artistNames
    date
    saleMessage
    partner {
      name
      id
    }
  }
  ... on Show {
    name
    href
    exhibitionPeriod
    partner {
      __typename
      ... on Partner {
        name
      }
      ... on Node {
        __isNode: __typename
        id
      }
      ... on ExternalPartner {
        id
      }
    }
    image: coverImage {
      thumbnailUrl: url(version: "small")
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "conversationID"
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 30
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": "DESC"
  }
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v7 = [
  {
    "alias": "thumbnailUrl",
    "args": [
      {
        "kind": "Literal",
        "name": "version",
        "value": "small"
      }
    ],
    "kind": "ScalarField",
    "name": "url",
    "storageKey": "url(version:\"small\")"
  }
],
v8 = [
  (v2/*: any*/)
],
v9 = {
  "kind": "InlineFragment",
  "selections": (v8/*: any*/),
  "type": "Node",
  "abstractKey": "__isNode"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ConversationDetailsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ConversationDetails_me"
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
    "name": "ConversationDetailsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": [
              {
                "kind": "Variable",
                "name": "id",
                "variableName": "conversationID"
              }
            ],
            "concreteType": "Conversation",
            "kind": "LinkedField",
            "name": "conversation",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "ConversationResponder",
                "kind": "LinkedField",
                "name": "to",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "initials",
                    "storageKey": null
                  },
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "ConversationInitiator",
                "kind": "LinkedField",
                "name": "from",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "email",
                    "storageKey": null
                  },
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v4/*: any*/),
                "concreteType": "MessageConnection",
                "kind": "LinkedField",
                "name": "messagesConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "MessageEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "cursor",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Message",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          (v2/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Attachment",
                            "kind": "LinkedField",
                            "name": "attachments",
                            "plural": true,
                            "selections": [
                              (v2/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "contentType",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "fileName",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "downloadURL",
                                "storageKey": null
                              },
                              (v1/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PageInfo",
                    "kind": "LinkedField",
                    "name": "pageInfo",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "endCursor",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "hasNextPage",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "messagesConnection(first:30,sort:\"DESC\")"
              },
              {
                "alias": null,
                "args": (v4/*: any*/),
                "filters": [],
                "handle": "connection",
                "key": "Details_messagesConnection",
                "kind": "LinkedHandle",
                "name": "messagesConnection"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "ConversationItem",
                "kind": "LinkedField",
                "name": "items",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "item",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      {
                        "kind": "TypeDiscriminator",
                        "abstractKey": "__isConversationItemType"
                      },
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v6/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "image",
                            "plural": false,
                            "selections": (v7/*: any*/),
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
                            "kind": "ScalarField",
                            "name": "saleMessage",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Partner",
                            "kind": "LinkedField",
                            "name": "partner",
                            "plural": false,
                            "selections": [
                              (v3/*: any*/),
                              (v2/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "type": "Artwork",
                        "abstractKey": null
                      },
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v6/*: any*/),
                          (v3/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "exhibitionPeriod",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "partner",
                            "plural": false,
                            "selections": [
                              (v5/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  (v3/*: any*/)
                                ],
                                "type": "Partner",
                                "abstractKey": null
                              },
                              (v9/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "selections": (v8/*: any*/),
                                "type": "ExternalPartner",
                                "abstractKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": "image",
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "coverImage",
                            "plural": false,
                            "selections": (v7/*: any*/),
                            "storageKey": null
                          }
                        ],
                        "type": "Show",
                        "abstractKey": null
                      },
                      (v9/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "4db73e6790571e71f3d411d7a7289ae0",
    "metadata": {},
    "name": "ConversationDetailsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '464d6ba7c5353c651e81dc601cfa0b42';
export default node;
