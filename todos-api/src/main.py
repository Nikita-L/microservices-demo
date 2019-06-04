import os
import json
import time

from flask import Flask, request, jsonify, g
import redis
from pymongo import MongoClient
import jwt

from utils import random_with_N_digits, ALLOWED_HEADERS


app = Flask('todos-api')

redis_host = os.getenv('REDIS_HOST')
redis_port = int(os.getenv('REDIS_PORT'))
redis_channel = os.getenv('REDIS_CHANNEL')
zipkin_url = os.getenv('ZIPKIN_URL')

pubsub = redis.Redis(host=redis_host, port=redis_port, db=0)

MongoClient('todos-api-db-1', replicaSet='rs0', serverSelectionTimeoutMS=5000, socketTimeoutMS=5000, connectTimeoutMS=5000)
MongoClient('todos-api-db-2', replicaSet='rs0', serverSelectionTimeoutMS=5000, socketTimeoutMS=5000, connectTimeoutMS=5000)
MongoClient('todos-api-db-3', replicaSet='rs0', serverSelectionTimeoutMS=5000, socketTimeoutMS=5000, connectTimeoutMS=5000)
db = MongoClient(
    'todos-api-db-1', replicaSet='rs0', serverSelectionTimeoutMS=5000, socketTimeoutMS=5000, connectTimeoutMS=5000
).test


@app.after_request
def set_cors(response):
    response.headers['Access-Control-Allow-Origin'] = request.headers.get(
        'Origin', '*'
    )
    response.headers['Access-Control-Allow-Methods'] = request.method
    response.headers['Access-Control-Allow-Headers'] = ALLOWED_HEADERS
    response.headers['Access-Control-Allow-Credentials'] = 'true'

    return response


@app.before_request
def handle_options():
    if request.method == 'OPTIONS':
        return '', 200


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
        identity = jwt.decode(
            token, os.getenv('JWT_SECRET'), algorithms='HS256'
        )
    except jwt.ExpiredSignatureError:
        print('JWT is expired')
        return 'JWT is expired', 401
    g.username = identity.get('username')
    print('Valid token provided, processing...')


@app.route('/todos')
def list_todos():
    try:
        cursor = db.todos.find({'username': g.username})
    except:
        time.sleep(15)
        return 'DB problem, please wait', 400

    result = []
    for doc in cursor:
        result.append({
            'id': str(doc['_id']),
            'content': doc['content']
        })

    print(result)
    return jsonify(result)


@app.route('/todos', methods=['POST'])
def add_todo():
    data = request.get_json()
    content = data.get('content')
    if not content:
        return 'No content', 400
    try:
        id_ = str(db.todos.insert_one({
            'username': g.username,
            'content': content
        }).inserted_id)
    except:
        time.sleep(15)
        return 'DB problem, please wait', 400

    code = str(random_with_N_digits(16))
    log_info = {
        'zipkinSpan': {
            '_traceId': {'value': code},
            '_parentId': {'type': 'None', 'present': False},
            '_spanId': code,
            '_sampled': {'value': True},
            '_flags': 0
        },
        'opName': 'CREATE',
        'username': g.username,
        'todoId': 3,
    }
    json_mylist = json.dumps(log_info, separators=(',', ':'))
    pubsub.publish(redis_channel, json_mylist)

    result = {'id': id_, 'content': content}
    print(result)
    return jsonify(result)


@app.route('/todos/<id_>', methods=['DELETE'])
def delete_todo(id_):
    try:
        db.todos.delete_one({'_id': g.username, 'username': g.username})
    except:
        time.sleep(15)
        return 'DB problem, please wait', 400

    code = str(random_with_N_digits(16))
    log_info = {
        'zipkinSpan': {
            '_traceId': {'value': code},
            '_parentId': {'type': 'None', 'present': False},
            '_spanId': code,
            '_sampled': {'value': True},
            '_flags': 0
        },
        'opName': 'DELETE',
        'username': g.username,
        'todoId': id_,
    }
    json_mylist = json.dumps(log_info, separators=(',', ':'))
    pubsub.publish(redis_channel, json_mylist)

    print(f'Todo with id {id_} deleted')
    return 'Ok', 200


if __name__ == '__main__':
    app.run('0.0.0.0', 8082)
