Events
=

`Joining a lobby`
-

```javascript
const USER_JOINED_LOBBY_TEMPLATE = {
  id: 'user_joined_lobby',
  timestamp: Date.now(),
  lobby: '<lobby id>',
  username: '<username>',
}
```

| | I'm joining | Someone else's joining |
| --- |:---:|:---:|
| I've not joined the lobby, I'm outside the lobby | When I'm joining the lobby, I want to get the current list of connected users, as well as the X last events (by amount or by time).	| I want the amount of connected users to be updated |
| I've joined the lobby, I'm outside the lobby | N/A | I want the amount of connected users to be updated, as well as get a notification about it. |

`Leaving a lobby`
-

```javascript
const USER_JOINED_LOBBY_TEMPLATE = {
  id: 'user_joined_lobby',
  timestamp: Date.now(),
  lobby: '<lobby id>',
  username: '<username>',
}
```

|| I'm leaving | Someone else's leaving |
|-|:-:|:-:|
| I've not joined the lobby| N/A | I want the amount of connected users to be updated |
| I've joined the lobby | I want the erase the users list and the saved events. | I want the amount of connected users to be updated, as well as get a notification about it. |

`Sending a message to a lobby`
-

```javascript
const MESSAGE_TO_LOBBY_TEMPLATE = {
  id: 'user_joined_lobby',
  timestamp: Date.now(),
  lobby: '<lobby id>',
  username: '<username>',
  message: '<message>',
}
```

|| Received a message |
|-|:-:|
| I've not joined the lobby | N/A |
| I've joined the lobby | Get notification about it	|

Notifications
=

When receiving notifications, each notification is represented by a line in the events list (can be any one of the events above).  

When a user is in a lobby, but the lobby is not open,  
The user should have a badge in the link to the lobby with the amount of unread notifications.

Models
=

`Lobby`
-
* `name` - following slack rules, `![^a-z0-9-]`
* `description`
* `users` - list of connected user ids
* `events` - list of events that occured in the lobby, sorted by time
* `last_event_timestamp` - used to indicate at what point the user has left the lobby

`Event`
-
One of the events above

Mock Ups
=

`Layout`
-
```html
+--------------------------------------------------------------------+
|<App Name>                                              <User Menu> |
+---------------------------------+----------------------------------+
| /--\ <lobby name> <notif badge> |                                  |
| \--/ <lobby description...>     |                                  |
|---------------------------------|                                  |
| ...                             |                                  |
| ...                             |                                  |
|---------------------------------|         <router-outlet>          |
| other lobbies                   |                                  |
|---------------------------------|                                  |
| <lobby name>                    |                                  |
| <lobby name>                    |                                  |
| <lobby name>                    |                                  |
| <lobby name>                    |                                  |
+---------------------------------+----------------------------------+
```

Notifications Badge
=

In order to calculate the amount of unread notification, the client side has to save some kind of state that indicates that is the last message that the user has read. It can be an index, or the last message timestamp.

The index depends on what messages the user has already loaded, so if I want to allow virtual scrolling, the index will break.

Thus, deciding which events the user has not read yet will be done via `timestamp comparison`.