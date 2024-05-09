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
        return {'message': 'Welcome to my REST API'}
    
@app.before_request
def check_login():
    if request.path.startswith('/api'):
        if not session.get('user_id') \
            and request.endpoint not in ['login', 'signup']:
            return {'error': 'user not logged in'}, 401
    
class CheckSession(Resource):
    def get(self):
        if session.get('user_id'):
            return User.query.get(session['user_id']).to_dict(), 200
        else:
            return {'error': 'user not logged in'}, 401
    
class Login(Resource):
    def post(self):
        json = request.get_json()
        try:
            user = User.query.filter(User.username == json['username']).first()
            if user and user.authenticate(json['password']):
                session['user_id'] = user.id
                return user.to_dict(), 200
            else:
                return {'message': 'Invalid username or password'}
        except:
            return {'message': 'Login failed'}

class Logout(Resource):
    def get(self):
        session.pop('user_id', None)
        return {'message': 'Logged out'}
        

    
api.add_resource(Index, '/', endpoint='index')
api.add_resource(CheckSession, '/api/check_session', endpoint='check_session')
api.add_resource(Login, '/api/login', endpoint='login')
api.add_resource(Logout, '/api/logout', endpoint='logout')


if __name__ == '__main__':
    app.run(port=5555, debug=True)