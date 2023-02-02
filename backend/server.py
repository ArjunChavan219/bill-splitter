import pymongo
from flask import Flask, request
from flask_cors import CORS


client = pymongo.MongoClient("mongodb://localhost:27017/")
test_db = client["testDB"]

app = Flask(__name__)
CORS(app)


@app.route('/login', methods=["POST"])
def login_check():
    users = test_db["users"]
    users_list = list(users.find({}, {"_id": 0}))
    users_dict = {user["username"]: user for user in users_list}

    username = request.json["username"]
    password = request.json["password"]

    if username not in users_dict:
        return {
            "success": False,
            "error": "Username"
        }
    if users_dict[username]["password"] != password:
        return {
            "success": False,
            "error": "Password"
        }

    return {
        "success": True
    }


if __name__ == '__main__':
    app.run()
