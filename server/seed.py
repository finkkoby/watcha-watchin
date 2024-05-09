#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc
import time

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Deleting existing tables...")
        db.drop_all()
        time.sleep(1)

        print("Creating new tables...")
        db.create_all()
        time.sleep(1)

        print("Creating new users...")
        users = []
        my_user = User(
            username="username",
            email="usernames@example.com",
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            age=23
        )
        my_user.password_hash = "password"
        users.append(my_user)
        for i in range(10):
            user = User(
                username=fake.user_name(),
                email=fake.email(),
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                age=randint(18, 65)
            )
            user.password_hash = fake.password(length=10)
            users.append(user)
        db.session.add_all(users)
        db.session.commit()
        
        print("Done!")
        time.sleep(1)