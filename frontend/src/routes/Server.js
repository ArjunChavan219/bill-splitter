export default class Server {
    constructor(user, handlePageChange) {
        this.url = "http://0.0.0.0:5001"
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
        const cacheKey = `BUE-${endpoint}`

        const cacheResponse = window.localStorage?.getItem(cacheKey)
        if (cacheResponse) {
            return JSON.parse(cacheResponse)
        }

        return fetch(request).then(
			res => res.json()
		).then(data => {
            window.localStorage.setItem(cacheKey, JSON.stringify(data))
            return data
        })
    }

    async postRequest(endpoint, method, body) {
        const requestOptions = {
			method: method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		}
		return fetch(`${this.url}/${endpoint}`, requestOptions).then(res => {
            if (endpoint === "password") {
                window.localStorage.removeItem("BUE-login")
            } else if (endpoint === "update-user-bill") {
                window.localStorage.removeItem("BUE-user-bill")
            } else {
                window.localStorage.removeItem("BUE-user-bills")
                window.localStorage.removeItem("BUE-all-bills")
            }
            if (endpoint === "unlock-bill") {
                window.localStorage.removeItem("BUE-manage-bill")
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
        return this.postRequest("password", "POST", {
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
        return this.getRequest("bills")
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
        return this.postRequest("add-user-bills", "POST", {
            username: this.user.username,
            bills: bills
        })
    }

    async removeUserBills(bills) {
        return this.postRequest("remove-user-bills", "POST", {
            username: this.user.username,
            bills: bills
        })
    }

    async updateUserBill(bill, items) {
        return this.postRequest("update-user-bill", "POST", {
            bill: bill,
            username: this.user.username,
            items: items
        })
    }

    async lockUserBill(bill) {
        return this.postRequest("lock-user-bill", "POST", {
            bill: bill,
            username: this.user.username
        })
    }

    async unlockBill(bill, users) {
        return this.postRequest("unlock-bill", "POST", {
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

    async saveBill(bill, items) {
        return this.postRequest("save-bill", "POST", {
            bill: bill,
            items: items
        })
    }
}
