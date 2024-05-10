#!/usr/bin/env python3

# Remote library imports
from flask import request, session, make_response
from flask_restful import Resource
from sqlalchemy import desc

# Local imports
from config import app, db, api

# Add your model imports
from models import User

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

class NewRoom(Resource):
    def post(self):
        pass
        

    
api.add_resource(Index, '/', endpoint='index')
api.add_resource(CheckSession, '/api/check_session', endpoint='check_session')
api.add_resource(Login, '/api/login', endpoint='login')
api.add_resource(Logout, '/api/logout', endpoint='logout')
api.add_resource(Signup, '/api/signup', endpoint='signup')
api.add_resource(NewRoom, '/api/rooms/new', endpoint='rooms_new')


if __name__ == '__main__':
    app.run(port=5555, debug=True)