import { Encrypt, Decrypt } from "../permissions/Encryption"

const apiURL = process.env.REACT_APP_API_URL
const cacheEndpoints = new Set(["user", "users", "bill", "bills", "user-bill", "user-bills", "all-bills", "manage-bill"])
const expirableEndpoints = new Set(["user-bill", "user-bills", "all-bills", "manage-bill"])

function cache(cacheKey, isExpirable) {
    const cacheValue = window.localStorage?.getItem(cacheKey)
    if (!cacheValue) {
        return cacheValue
    }
    const {ttl, response} = JSON.parse(cacheValue)

    if (!isExpirable || ttl > new Date().getTime()) {
        return Decrypt(response)
    }
    return null

}

export default class Server {
    constructor(user, handlePageChange) {
        this.url = apiURL
        this.user = user
        this.handlePageChange = handlePageChange
    }

    session_check() {
        const current_user = JSON.parse(window.localStorage?.getItem("USER_STATE")) || {
            username: "",
            permissions: []
        }
        return JSON.stringify(current_user) !== JSON.stringify(this.user)
    }

    async getRequest(endpoint, params) {
        const request = `${this.url}/${endpoint}${params ? `?${new URLSearchParams(params)}` : ""}`
        const cacheAble = cacheEndpoints.has(endpoint)
        let cacheKey
        if (cacheAble) {
            cacheKey = `BUE-${endpoint}`
            if (endpoint === "user-bill" || endpoint === "manage-bill") {
                cacheKey += `-${params.bill.replace(" ", "_")}`
            }

            const cacheResponse = cache(cacheKey, expirableEndpoints.has(endpoint))
            if (cacheResponse) {
                return cacheResponse
            }
        }

        return fetch(request).then(
			res => res.json()
		).then(data => {
            if (cacheAble) {
                window.localStorage.setItem(cacheKey, JSON.stringify({
                    ttl: 900000 + new Date().getTime(),
                    response: Encrypt(data)
                }))
            }
            return data
        })
    }

    async postRequest(endpoint, body) {
        const requestOptions = {
			method: "POST",
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		}
		return fetch(`${this.url}/${endpoint}`, requestOptions).then(res => {
            if (endpoint === "update-user-bill") {
                window.localStorage.removeItem(`BUE-user-bill-${body.bill.replace(" ", "_")}`)
            } else {
                window.localStorage.removeItem("BUE-user-bills")
                window.localStorage.removeItem("BUE-all-bills")
            }
            if (endpoint === "unlock-bill" || endpoint === "save-bill") {
                window.localStorage.removeItem(`BUE-manage-bill-${body.bill.replace(" ", "_")}`)
            }
            if (endpoint === "remove-user-bills") {
                body.bills.forEach(bill => {
                    window.localStorage.removeItem(`BUE-user-bill-${bill.replace(" ", "_")}`)
                });
            }
            return res.json()
        })
    }

    async login(username, password) {
        return this.getRequest("login", {
            username: username,
            password: password
        })
    }

    async changePassword(password) {
        return this.postRequest("password", {
            username: this.user.username,
            password: password
        })
    }

    async permission(user) {
        return this.getRequest("permission", {
            username: user
        })
    }

    async getUserData() {
        return this.getRequest("user", {
            username: this.user.username
        })
    }

    async getBills() {
        return this.getRequest("bills", {
            userGroup: this.user.userGroup
        })
    }

    async getBill(bill) {
        return this.getRequest("bill", {
            bill: bill
        })
    }

    async getUserBills() {
        return this.getRequest("user-bills", {
            username: this.user.username
        })
    }

    async getUserBill(bill) {
        return this.getRequest("user-bill", {
            bill: bill,
            username: this.user.username 
        })
    }

    async addUserBills(bills) {
        return this.postRequest("add-user-bills", {
            username: this.user.username,
            bills: bills
        })
    }

    async removeUserBills(bills) {
        return this.postRequest("remove-user-bills", {
            username: this.user.username,
            bills: bills
        })
    }

    async updateUserBill(bill, items) {
        return this.postRequest("update-user-bill", {
            bill: bill,
            username: this.user.username,
            items: items
        })
    }

    async lockUserBill(bill) {
        return this.postRequest("lock-user-bill", {
            bill: bill,
            username: this.user.username
        })
    }

    async unlockBill(bill, users) {
        return this.postRequest("unlock-bill", {
            bill: bill,
            users: users
        })
    }

    async getAllBills() {
        return this.getRequest("all-bills")
    }

    async manageBill(bill) {
        return this.getRequest("manage-bill", {
            bill: bill
        })
    }

    async saveBill(bill, items, newUsers, oldUsers) {
        return this.postRequest("save-bill", {
            bill: bill,
            items: items,
            newUsers: newUsers,
            oldUsers: oldUsers
        })
    }

    async submitBill(bill) {
        return this.postRequest("submit-bill", {
            bill: bill
        })
    }

    async getUsers(group) {
        return this.getRequest("users", {
            group: group
        })
    }
}
