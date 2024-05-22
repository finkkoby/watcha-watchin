#!/usr/bin/env python3

import string
import random

from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import relationship, validates
from sqlalchemy.ext.hybrid import hybrid_property

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    # Database Schema
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True)
    _password_hash = db.Column(db.String)
    email = db.Column(db.String, unique=True)
    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    age = db.Column(db.Integer)

    # Relationships
    joins = db.relationship("Join", back_populates="user")
    recents = db.relationship("Recent", back_populates="user")

    videos = association_proxy("recents", 'video',
                               creator=lambda video_obj: Recent(video=video_obj))
    rooms = association_proxy("joins", "room",
                             creator=lambda room_obj: Join(room=room_obj))

    # Serialize Rules
    serialize_rules = ("-recents.user", "-join.user", "videos", "rooms", "-rooms.joins", "-rooms.users")

    # Validations
    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')


    # Other Methods
    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

class Join(db.Model, SerializerMixin):
    __tablename__ = 'joins'

    # Database Schema
    id = db.Column(db.Integer, primary_key=True)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    host = db.Column(db.Boolean, nullable=False, default=False)

    # Relationships
    room = db.relationship("Room", back_populates="joins")
    user = db.relationship("User", back_populates="joins")

    # Serialize Rules
    serialize_rules = ("-room.joins", "-user.joins")
    
class Room(db.Model, SerializerMixin):
    __tablename__ = 'rooms'

    # Database Schema
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    code = db.Column(db.String(5), unique=True)
    video_id = db.Column(db.Integer, db.ForeignKey('videos.id'), default=None)

    # Relationships
    guests = db.relationship("Guest", back_populates="room")
    video = db.relationship("Video", back_populates="rooms")
    joins = db.relationship("Join", back_populates="room", cascade='all')

    users = association_proxy("joins", "user",
                              creator=lambda user_obj: Join(user=user_obj))



    # Serialize Rules
    serialize_rules = ("-video.rooms", "-guests.room", "-joins.room")

    # Validations


    # Other Methods

class Guest(db.Model, SerializerMixin):
    __tablename__ = 'guests'

    # Database Schema
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('rooms.id'))

    # Relationships
    room = db.relationship("Room", back_populates="guests")

    # Serialize Rules
    serialize_rules = ("-room.guests",)

    # Validations

    # Other Methods


class Recent(db.Model, SerializerMixin):
    __tablename__ = 'recents'

    # Database Schema
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    video_id = db.Column(db.Integer, db.ForeignKey('videos.id'))

    # Relationships
    user = db.relationship("User", back_populates='recents')
    video = db.relationship("Video", back_populates='recents')

    # Serialize Rules
    serialize_rules = ("-user.recents", "-video.recents")


    # Validations


    # Other Methods


class Video(db.Model, SerializerMixin):
    __tablename__ = 'videos'

    # Database Schema
    id = db.Column(db.Integer, primary_key=True)
    youtube_id = db.Column(db.String, nullable=False)

    # Relationships
    recents = db.relationship("Recent", back_populates="video")
    rooms = db.relationship("Room", back_populates="video")

    users = association_proxy("recents", "user",
                              creator=lambda user_obj: Recent(user=user_obj))


    # Serialize Rules
    serialize_rules = ('-recents.video',)

    # Validations


    # Other Methods

