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
    
api.add_resource(Index, '/')
api.add_resource(Login, '/api/login')

if __name__ == '__main__':
    app.run(port=5555, debug=True)