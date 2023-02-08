import pymongo
from flask import Flask, request
from flask_cors import CORS


client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["billSplitterDB"]
users = db["users"]
bills = db["bills"]

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


@app.route('/bills', methods=["GET"])
def get_bills():
    return {
        "bills": [bill["name"] for bill in bills.find({"status": "open"}, {"_id": False, "name": True})]
    }


@app.route('/bill', methods=["POST"])
def get_bill():
    items = list(bills.find({"name": request.json["bill"]}, {"_id": False, "items": True}))[0]["items"]
    for item in items:
        item["cost"] = 0
        item["share"] = 0

    return {"items": items}


@app.route('/user-bills', methods=["POST"])
def get_user_bills():
    return list(users.find({"username": request.json["username"]},
                           {"_id": False, "bills.name": True, "bills.amount": True,
                            "bills.paid": True, "bills.locked": True}))[0]


@app.route('/user-bill', methods=["POST"])
def get_user_bill():
    return list(users.find({"username": request.json["username"], "bills.name": request.json["bill"]},
                           {"_id": False, "bills.$": 1}))[0]["bills"][0]


@app.route('/add-user-bills', methods=["POST"])
def add_user_bills():
    user_entry = {"username": request.json["username"], "locked": False}
    user_bills = [{"name": bill, "items": [], "amount": 0, "paid": False, "locked": False}
                  for bill in request.json["bills"]]

    users.update_one({"username": request.json["username"]}, {"$push": {"bills": {"$each": user_bills}}})
    bills.update_many({"name": {"$in": request.json["bills"]}}, {"$push": {"members": user_entry}})

    return {}


@app.route('/remove-user-bills', methods=["POST"])
def remove_user_bills():
    username = request.json["username"]
    bill_names = request.json["bills"]

    users.update_one({"username": username}, {"$pull": {"bills": {"name": {"$in": bill_names}}}})
    bills.update_many({"name": {"$in": bill_names}}, {"$pull": {"members": {"username": username}}})

    return {}


@app.route('/update-user-bill', methods=["POST"])
def update_user_bill():
    users.update_one({"username": request.json["username"], "bills.name": request.json["bill"]},
                     {"$set": {"bills.$.items": request.json["items"]}})

    return {}


@app.route('/lock-user-bill', methods=["POST"])
def lock_user_bill():
    username = request.json["username"]
    bill_name = request.json["bill"]

    bills.update_one({"name": bill_name, "members.username": username},
                     {"$set": {"members.$.locked": True}})
    users.update_one({"username": username, "bills.name": bill_name},
                     {"$set": {"bills.$.locked": True}})
    return {}


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)
