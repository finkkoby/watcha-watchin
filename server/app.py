#!/usr/bin/env python3

# Remote library imports
from flask import request, session, make_response
from flask_restful import Resource
from sqlalchemy import desc

# Local imports
from config import app, db, api

# Add your model imports
# from models import models

class Index(Resource):
    def get(self):
        return {'message': 'Welcome to my REST API'}
    
api.add_resource(Index, '/')

if __name__ == '__main__':
    app.run(port=5555, debug=True)