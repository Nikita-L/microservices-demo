import os

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

import jwt


app = Flask('users-api')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')

db = SQLAlchemy(app)


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String)
    firstname = db.Column(db.String)
    lastname = db.Column(db.String)
    role = db.Column(db.Boolean)

    def __repr__(self):
        return f'<User self.username>'


db.create_all()
db.session.add(
    User(
        username='admin',
        firstname='Foo',
        lastname='Bar',
        role=True
    )
)
db.session.add(
    User(
        username='johnd',
        firstname='John',
        lastname='Doe',
        role=False
    )
)
db.session.add(
    User(
        username='janed',
        firstname='Jane',
        lastname='Doe',
        role=False
    )
)
db.session.commit()


@app.before_request
def validate_jwt():
    auth_h = request.headers.get('Authorization')
    if not auth_h:
        print('No authorization provided')
        return 'No authorization provided', 401

    if not auth_h.startswith('Bearer '):
        print('Unknown token type')
        return 'Unknown token type', 401

    token = auth_h[7:]
    try:
        jwt.decode(token, os.getenv('JWT_SECRET'), algorithms='HS256')
    except jwt.ExpiredSignatureError:
        print('JWT is expired')
        return 'JWT is expired', 401
    print('Valid token provided, processing...')


@app.route('/users/')
def get_users():
    users = User.query.all()

    result = []
    for user in users:
        result.append({
            'username': user.username,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'role': 'ADMIN' if user.role else 'USER'
        })
    print(result)
    return jsonify(result)


@app.route('/users/<username>/')
def get_user(username):
    user = User.query.filter(User.username == username).first()

    if not user:
        return f'No such user: {username}', 404

    result = {
        'username': user.username,
        'firstname': user.firstname,
        'lastname': user.lastname,
        'role': 'ADMIN' if user.role else 'USER'
    }
    print(result)
    return jsonify(result)


if __name__ == '__main__':
    app.run('0.0.0.0', 8083)
