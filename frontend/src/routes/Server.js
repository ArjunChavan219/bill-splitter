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

    async login(username, password) {
        const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
                "username": username,
                "password": password
            })
		}
		return fetch(`${this.url}/login`, requestOptions).then(
			res => res.json()
		)
    }
}
