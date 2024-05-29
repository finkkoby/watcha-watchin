#!/usr/bin/env python3

# Remote library imports
from flask import request, session, jsonify
from flask_restful import Resource
import string
import random

# Local imports
from config import app, db, api, sio

# Add your model imports
from models import User, Room, Guest, Join, Video, Recent

@sio.event
def connect(sid, environ, auth):
    print('connect ', sid)

@sio.on('join', namespace='/join')
def join(sid, data):
    sio.enter_room(sid, room=data['room'], namespace='/join')
    sio.emit('joined', data['join'], room=data['room'], namespace='/join')
    print(sid, ' joined ', data['room'])

@sio.on('leave', namespace='/join')
def leave(sid, data):
    sio.leave_room(sid, room=data['room'], namespace='/join')
    sio.emit('left', data, room=data['room'], namespace='/join')
    print(sid, ' left ', data['room'], '')
    sio.disconnect(sid, namespace='/join')

@sio.on('video_update', namespace='/join')
def video_update(sid, data):
    sio.emit('new_video', data['video'], room=data['name'], namespace='/join')
    print(sid, ' new_video ', data)

@sio.on('hostupdate', namespace='/join')
def hostupdate(sid, data):
    sio.emit('statechange', data['event'], room=data['name'], namespace='/join')

@sio.on('sendmessage', namespace='/join')
def sendmessage(sid, data):
    sio.emit('newmessage', data, room=data['name'], namespace='/join')


class Index(Resource):
    def get(self):
        return {'message': 'Welcome to my REST API'}, 200
    
@app.before_request
def check_login():
    if request.path.startswith('/api'):
        if not session.get('user_id') \
            and request.endpoint not in ['login', 'signup', 'rooms_guest_join', 'guests_id']:
            return {'message': 'user not logged in'}, 401

@app.before_request
def room_users():
    if request.path.startswith('/api'):
        if request.endpoint in ['rooms_guest_join', 'rooms_join']:
            json = request.get_json()
            try:
                room = Room.query.filter(Room.code == json['roomCode']).first()
            except:
                room = Room.query.filter(Room.id == json['roomId']).first()
            users = room.joins
            if len(users) == 7:
                return {'message': 'room is full'}, 400
    
class CheckSession(Resource):
    def get(self):
        if session.get('user_id'):
            return User.query.filter(User.id == session.get('user_id')).first().to_dict(), 200
        else:
            return {'message': 'user not logged in'}, 401
        
class CheckRoom(Resource):
    def get(self):
        if session.get('room_id'):
            return Room.query.filter(Room.id == session.get('room_id')).first().to_dict(), 200
        else:
            return {'message': 'no room selected'}, 401
    
class Login(Resource):
    def post(self):
        json = request.get_json()
        try:
            user = User.query.filter(User.username == json['username']).first()
        except:
            return {'message': 'could not find user'}, 400
        try:
            user.authenticate(json['password'])
        except:
            return {'message': 'invalid password'}, 400
        try:
            if user and user.authenticate(json['password']):
                session['user_id'] = user.id
        except:
            return {'message': 'could not set session'}, 400
        try:
            if user and user.authenticate(json['password']):
                return user.to_dict(), 200
        except:
            return {'message': 'failed to return user'}, 400
        # except:
        #     return {'message': 'Login failed'}, 400

class Logout(Resource):
    def get(self):
        session.pop('user_id', None)
        return {'message': 'Logged out'}, 200
    
class Signup(Resource):
    def post(self):
        json = request.get_json()
        username = User.query.filter(User.username == json['username']).first()
        if username:
            return {'message': 'username already exists'}, 400
        email = User.query.filter(User.email == json['email']).first()
        if email:
            return {'message': 'email already exists'}, 400
        try:
            user = User(
                username=json['username'],
                email=json['email'],
                first_name=json['firstName'],
                last_name=json['lastName'],
                age=json['age']
            )
            if user:
                if json['password'] != json['confirmPassword']:
                    return {'message': 'passwords must match'}, 400
                user.password_hash = json['password']
                db.session.add(user)
                db.session.commit()
                session['user_id'] = user.id
                return user.to_dict(), 200
        except:
            return {'message': 'signup failed -- try again'}, 400
        
class UserId(Resource):
    def patch(self, id):
        json = request.get_json()
        if id == int(session.get('user_id')):
            user = User.query.filter(User.id == id).first()
            if user:
                try:
                    room = Room.query.filter(Room.id == session.get('room_id')).first()
                    if room:
                        user.room = room
                except:
                    user.room = None
                db.session.commit()
                return user.to_dict(), 200
            else:
                return {'message': 'user not found'}, 400
        else:
            return {'message': 'user not found'}, 400
        
    def delete(self, id):
        if id == int(session.get('user_id')):
            user = User.query.filter(User.id == id).first()
            if user:
                db.session.delete(user)
                db.session.commit()
                session.pop('user_id', None)
                return {'message': 'user deleted'}, 200
            else:
                return {'message': 'user not found'}, 400
        else:
            return {'message': 'user not found'}, 400

class Rooms(Resource):
    def get(self):
        return [room.to_dict() for room in Room.query.all()], 200
    def post(self):
        json = request.get_json()
        code = ''.join(random.choices(string.ascii_uppercase +
                        string.digits, k=5))
        name = Room.query.filter(Room.name == json['name']).first()
        if not name:
            user = User.query.filter(User.id == session.get('user_id')).first()
            room = Room(
                name=json['name'],
                code=code
            )
            if room:
                join = Join(
                    user=user,
                    room=room,
                    host=True,
                )
            db.session.add(join)
            db.session.add(room)
            db.session.commit()
            session['room_id'] = room.id
            return {"join": join.to_dict(), "room": room.to_dict()}, 200
        else:
            return {'message': 'room name already exists'}, 400
        
class JoinRoom(Resource):
    def post(self):
        json = request.get_json()
        try:
            user = User.query.filter(User.id == session.get('user_id')).first()
            if user:
                try:
                    room = Room.query.filter(Room.code == json['roomCode']).first()
                    if room:
                        join = Join(
                            user=user,
                            room=room
                        )
                        if join:
                            db.session.add(join)
                            db.session.commit()
                            session['room_id'] = room.id
                            return {"room": room.to_dict(), "join": join.to_dict()}, 200
                        else:
                            return {'message': 'could not create join -- try again'}, 400
                    else:
                        return {'message': 'invalid room code'}, 400
                except:
                    return {'message': 'could not locate room -- try again'}, 400
        except:
            return {'message': 'user not found'}, 400
    
    def patch(self):
        json = request.get_json()
        try:
            room = Room.query.filter(Room.id == json['roomId']).first()
            if room:
                db.session.commit()
                session['room_id'] = room.id
                return room.to_dict(), 200
        except:
            return {'message': 'room does not exist'}, 400

class GuestJoinRoom(Resource):
    def post(self):
        json = request.get_json()
        try:
            room = Room.query.filter(Room.code == json['roomCode']).first()
            if room:
                try:
                    user = User(
                        first_name=json['name'] + " (guest)",
                        guest=True
                    )
                    if user:
                        join = Join(
                            user=user,
                            room=room
                        )
                        if join:
                            db.session.add(user)
                            db.session.add(join)
                            db.session.commit()
                            session['user_id'] = user.id
                            session['room_id'] = room.id
                            return {"user": user.to_dict(), "join": join.to_dict(), "room": room.to_dict()}, 200
                        else:
                            return {'message': 'could not create guest join -- try again'}, 400
                    else:
                        return {'message': 'could not create guest user -- try again'}, 400
                except:
                    return {'message': 'could not create guest user -- try again'}, 400
            else:
                return {'message': 'invalid room code'}, 400
        except:
            return {'message': 'room does not exist'}, 400

class LeaveRoom(Resource):
    def get(self):
        session.pop('room_id', None)
        return {'message': 'Left room'}, 200
            
        
class RoomsId(Resource):
    def get(self, id):
        room = Room.query.filter(Room.id == id).first()
        if room:
            return room.to_dict(), 200
        else:
            return {'message': 'room does not exist'}, 400
        
    def patch(self, id):
        json = request.get_json()
        try:
            room = Room.query.filter(Room.id == id).first()
            if room:
                new_video = Video.query.filter(Video.id == json['videoId']).first()
                room.name = json['name']
                room.video = new_video
                db.session.commit()
                return room.to_dict(), 200
        except:
            return {'message': 'room does not exist'}, 400
    
    def delete(self, id):
        try:
            room = Room.query.filter(Room.id == id).first()
            if room:
                db.session.delete(room)
                db.session.commit()
                return {'message': 'room deleted'}, 200
        except:
            return {'message': 'room does not exist'}, 400

class JoinsId(Resource):
    def delete(self, id):
        try:
            join = Join.query.filter(Join.id == id).first()
            if join:
                db.session.delete(join)
                db.session.commit()
                return {'message': 'join deleted'}, 200
        except:
            return {'message': 'join does not exist'}, 400

class Videos(Resource):
    def get(self):
        return [video.to_dict() for video in Video.query.all()], 200

    def post(self):
        json = request.get_json()
        video = Video.query.filter(Video.youtube_id == json['youtube_id']).first()
        if video:
            return video.to_dict(), 200
        try:
            video = Video(
                title=json['title'],
                image_url=json['image_url'],
                url=json['url'],
                youtube_id=json['youtube_id']
            )
            if video:
                db.session.add(video)
                db.session.commit()
                return video.to_dict(), 200
            else:
                return {'message': 'could not create video -- try again'}, 400
        except:
            return {'message': 'could not create video -- try again'}, 400

class Recents(Resource):
    def post(self):
        json = request.get_json()
        try:
            recent = Recent(
                user=User.query.filter(User.id == json['user']).first(),
                video=Video.query.filter(Video.id == json['video']).first()
            )
            if recent:
                db.session.add(recent)
                db.session.commit()
                return recent.to_dict(), 200
            else:
                return {'message': 'could not create recent'}, 400
        except:
            return {'message': 'could not create recent -- try again'}, 400

    
api.add_resource(Index, '/', endpoint='index')
api.add_resource(CheckSession, '/api/check_session', endpoint='check_session')
api.add_resource(CheckRoom, '/api/check_room', endpoint='check_room')
api.add_resource(Login, '/api/login', endpoint='login')
api.add_resource(Logout, '/api/logout', endpoint='logout')
api.add_resource(Signup, '/api/signup', endpoint='signup')
api.add_resource(Rooms, '/api/rooms', endpoint='rooms')
api.add_resource(JoinRoom, '/api/rooms/join', endpoint='rooms_join')
api.add_resource(GuestJoinRoom, '/api/rooms/guest_join', endpoint='rooms_guest_join')
api.add_resource(LeaveRoom, '/api/rooms/leave', endpoint='rooms_leave')
api.add_resource(RoomsId, '/api/rooms/<int:id>', endpoint='rooms_id')
api.add_resource(UserId, '/api/users/<int:id>', endpoint='users_id')
api.add_resource(JoinsId, '/api/joins/<int:id>', endpoint='joins_id')
api.add_resource(Videos, '/api/videos', endpoint='videos')
api.add_resource(Recents, '/api/recents', endpoint='recents')


if __name__ == '__main__':
    app.run(port=5555, debug=True)