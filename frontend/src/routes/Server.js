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

    async request(url, method, body) {
        const requestOptions = {
			method: method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		}
		return fetch(`${this.url}/${url}`, requestOptions).then(
			res => res.json()
		)
    }

    async login(username, password) {
        return this.request("login", "POST", {
            username: username,
            password: password
        })
    }

    async changePassword(password) {
        return this.request("password", "POST", {
            username: this.user.username,
            password: password
        })
    }

    async permission(user) {
        return this.request("permission", "POST", {
            username: user
        })
    }

    async getUserData() {
        return this.request("user", "POST", {
            username: this.user.username
        })
    }

    async getBills() {
        return fetch(`${this.url}/bills`).then(
			res => res.json()
		)
    }

    async getBill(bill) {
        return this.request("bill", "POST", {
            bill: bill
        })
    }

    async getUserBills() {
        return this.request("user-bills", "POST", {
            username: this.user.username 
        })
    }

    async getUserBill(bill) {
        return this.request("user-bill", "POST", {
            bill: bill,
            username: this.user.username 
        })
    }

    async addUserBills(bills) {
        return this.request("add-user-bills", "POST", {
            username: this.user.username,
            bills: bills
        })
    }

    async removeUserBills(bills) {
        return this.request("remove-user-bills", "POST", {
            username: this.user.username,
            bills: bills
        })
    }

    async updateUserBill(bill, items) {
        return this.request("update-user-bill", "POST", {
            bill: bill,
            username: this.user.username,
            items: items
        })
    }

    async lockUserBill(bill) {
        return this.request("lock-user-bill", "POST", {
            bill: bill,
            username: this.user.username
        })
    }

    async getAllBills() {
        return fetch(`${this.url}/all-bills`).then(
			res => res.json()
		)
    }

    async manageBill(bill) {
        return this.request("manage-bill", "POST", {
            bill: bill
        })
    }

    async unlockBill(bill, users) {
        return this.request("unlock-bill", "POST", {
            bill: bill,
            users: users
        })
    }

    async saveBill(bill, items) {
        return this.request("save-bill", "POST", {
            bill: bill,
            items: items
        })
    }
}
