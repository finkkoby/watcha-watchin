#!/usr/bin/env python3

from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import relationship, validates
from sqlalchemy.ext.hybrid import hybrid_property

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    password_hash = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    age = db.Column(db.Integer)