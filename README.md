# WHATCHA' WHATCHIN'

##
When I started reading up on WebSocket, the first thing I thought of
was a web application I used to use with my friends called Netflix Party.
This allowed you to watch Netflix content synchronously with your friends,
without having to be in the same room. Now that the world of streaming
has grown exponentially, I wanted to try my hand at creating an application
like Netflix party, but that can stream other types of content, like YouTube
videos! Thus, WHATCHA' WATCHIN' was born!

### Setting Up Your Account
WHATCHA' WATCHIN' allows for users to signup and login to their own account.
Their account keeps track of their rooms that they created, as well as recent
videos that they watch in a room of their own, or in a room hosted by someone
else. I used Formik for all of the forms and validations to handle account
actions.

### User Dashboard
Once a user is logged in, you are redirected to the user dashboard. Users can
see what rooms they still have open and a couple of recent videos. Users also
have the option to create a room or join someone else's room. More on that later.

### Entering/Leaving Rooms
A couple things to break down before we get to the exciting stuff. When a user
creates a room, a room code is generated on the server-side and the user is
then redirected to the viewing room. Once a room is created, this room will stay
open and available to the host through their user dashboard until the room is
deleted. When a user enters a room, this creates a JOIN instance that notifies
the server which USER entered which ROOM. This also happens for the host of the
room upon initialization of the room, and the host attribute of the JOIN is set
to TRUE. This allows the server to keep track of who is in which room, and who is
the host. When a non-host user leaves a room, the join is deleted, letting the
server know that that USER is no longer in that ROOM. When the host deletes a
room, all joins are deleted. Upon entering a room, you also enter a SocketIO room
of the same name. This room is what the back-end uses to direct messages and events
to the correct client. You don't want to receive any events or any messages from
someone in another viewing room, and by extension, another socket room.

### Viewing Room
Once you enter a viewing room either via creation of a room, or through entering
a room code, you will see your viewing window, the chat box, and some extra room
information down at the bottom. If you are the host, you will have the ability to
enter a YouTube URL as well as enter a new video URL at any time. Once a video is
added, that data is persisted in the ROOM object in the back-end, as well as sent
via SocketIO event to all users in the room. Whatever happens in the host's player,
will be sent via the socket connection to all users. When the host hits play, all
players will start playing. When the host hits pause, all players will pause. When
the host skips ahead using the navigation bar, all players will jump to the same
place and so on. That way no user gets left behind! Non-host users can pause and
play their own video, but any player action from the host will sync them back up
with the host's player. There is also a chat box available that uses the socket
connection to send and recieve messages without individual HTTP fetch requests.

### Recent Videos
If you are in a viewing room, and 