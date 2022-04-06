## How to run
```
$ npm install
$ npm run start
```
* Visit the link http://localhost:4000/ and click 'Query your server' button. It will navigate you to Apollo studio and you can test the GraphQL API.

## Example queries
```
query AllUsers {
  allUsers {
    id
    name
    links {
      id
      createdDateTime
      title
      url
      type
      userId
    }
  }
}


query LinksByUserId($linksByUserIdId: ID!, $sortByDateAscending: Boolean) {
  linksByUserId(id: $linksByUserIdId, sortByDateAscending: $sortByDateAscending) {
    id
    createdDateTime
    title
    url
    type
    userId
    ... on ClassicLink {
      queryParams
    }
    ... on ShowLink {
      shows {
        showDate
        showName
        isOnSale
        isSoldOut
      }
    }
    ... on MusicLink {
      musics {
        mediaType
        MusicUrls
      }
    }
  }
}

mutation AddShowLink($input: AddShowLinkInput!) {
  addShowLink(input: $input) {
    id
    createdDateTime
    title
    url
    type
    userId
    shows {
      showDate
      showName
      isOnSale
      isSoldOut
    }
  }
}

mutation AddClassicLink($input: AddClassicLinkInput!) {
  addClassicLink(input: $input) {
    id
    createdDateTime
    title
    url
    type
    userId
    queryParams
  }
}
```

