export default class UsersResponse {
    constructor(user) {
        this.id = user.id;
        this.first_name = user.name.split(" ")[0];
        this.last_name = user.name.split(" ")[1];
        this.email = user.email;
        this.orders = user.orders;
        this.cartId = user.cartId
        this.avatar = user.avatar
    }
}