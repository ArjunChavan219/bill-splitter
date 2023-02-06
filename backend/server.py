import pymongo
from flask import Flask, request
from flask_cors import CORS


client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["billSplitterDB"]
users = db["users"]

app = Flask(__name__)
CORS(app)


@app.route('/login', methods=["POST"])
def login_check():
    users_list = list(users.find({}, {"_id": False, "username": True, "password": True}))
    users_dict = {user["username"]: user["password"] for user in users_list}

    username = request.json["username"]
    password = request.json["password"]

    if username not in users_dict:
        return {
            "success": False,
            "error": "Username"
        }
    if users_dict[username] != password:
        return {
            "success": False,
            "error": "Password"
        }

    return {
        "success": True
    }


@app.route('/password', methods=["POST"])
def change_password():
    print(request.json)
    username = request.json["username"]
    password = request.json["password"]
    users.update_one({"username": username}, {"$set": {"password": password}})

    return {
        "success": True
    }


@app.route('/permission', methods=["POST"])
def permission_check():
    user_groups = db["userGroups"]
    username = request.json["username"]

    return {
        "userGroup": user_groups.find({"users": username}, {"_id": False, "name": True})[0]["name"]
    }


@app.route('/user', methods=["POST"])
def user_data():
    username = request.json["username"]

    return users.find({"username": username}, {"_id": False})[0]


if __name__ == '__main__':
    app.run(debug=True)
