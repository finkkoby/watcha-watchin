#!/usr/bin/env python3

# Remote library imports
from flask import request, session, make_response
from flask_restful import Resource
import string
import random

# Local imports
from config import app, db, api

# Add your model imports
from models import User, Room

class Index(Resource):
    def get(self):
        return {'message': 'Welcome to my REST API'}, 200
    
@app.before_request
def check_login():
    if request.path.startswith('/api'):
        if not session.get('user_id') \
            and request.endpoint not in ['login', 'signup']:
            return {'message': 'user not logged in'}, 401
    
class CheckSession(Resource):
    def get(self):
        if session.get('user_id'):
            return User.query.get(session['user_id']).to_dict(), 200
        else:
            return {'message': 'user not logged in'}, 401
    
class Login(Resource):
    def post(self):
        json = request.get_json()
        try:
            user = User.query.filter(User.username == json['username']).first()
            if user and user.authenticate(json['password']):
                session['user_id'] = user.id
                return user.to_dict(), 200
            else:
                return {'message': 'invalid username or password'}, 400
        except:
            return {'message': 'Login failed'}, 400

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
                    room = Room.query.filter(Room.id == json['room']['id']).first()
                    user.room = room
                except:
                    user.room = None
                db.session.commit()
                return user.to_dict(), 200
            else:
                return {'message': 'user not found'}, 400
        else:
            return {'message': 'user not found'}, 400

class NewRoom(Resource):
    def post(self):
        json = request.get_json()
        code = ''.join(random.choices(string.ascii_uppercase +
                        string.digits, k=5))
        name = Room.query.filter(Room.name == json['name']).first()
        if not name:
            room = Room(
                name=json['name'],
                code=code
            )
            if room:
                user = User.query.filter(User.id == session.get('user_id')).first()
                user.room = room
            db.session.add(room)
            db.session.commit()
            return room.to_dict(), 200
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
                        user.room = room
                        db.session.commit()
                        return room.to_dict(), 200
                except:
                    return {'message': 'could not locate room -- try again'}, 400
        except:
            return {'message': 'user not found'}, 400
        
class RoomsId(Resource):
    def get(self, id, code):
        room = Room.query.filter(Room.id == id).first()
        if room:
            if room.code == code:
                return room.to_dict(), 200
            else:
                return {'message': 'room code does not match'}, 400
        else:
            return {'message': 'room does not exist'}, 400
        

    
api.add_resource(Index, '/', endpoint='index')
api.add_resource(CheckSession, '/api/check_session', endpoint='check_session')
api.add_resource(Login, '/api/login', endpoint='login')
api.add_resource(Logout, '/api/logout', endpoint='logout')
api.add_resource(Signup, '/api/signup', endpoint='signup')
api.add_resource(NewRoom, '/api/rooms/new', endpoint='rooms_new')
api.add_resource(JoinRoom, '/api/rooms/join', endpoint='rooms_join')
api.add_resource(RoomsId, '/api/rooms/<int:id>/<string:code>', endpoint='rooms_id')
api.add_resource(UserId, '/api/users/<int:id>', endpoint='users_id')


if __name__ == '__main__':
    app.run(port=5555, debug=True)