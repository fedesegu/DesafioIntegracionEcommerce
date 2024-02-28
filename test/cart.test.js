import  { cartsManager }  from "../src/DAL/daos/mongoDB/cartsManagerDB.js";
import { expect } from "chai";
import "./db.js";
import mongoose from "mongoose";


describe("find All", function (){
    it("should return an array", async function() {
        const result = await cartsManager.findAll();
        expect(result).to.be.an("array");
    });
})
describe("create one cart", function (){
    it("successful creation", async function(){
        const response = await cartsManager.createOne();
        expect(response).to.have.property("products")
    })
})
describe("Find Cart", function() {
    it("Find cart by id", async function(){
        let id = "abc1"
        const response = await cartsManager.findCById(id);
        expect(response).to.have.property("products")
    })
})
describe("Add one product to cart", function() {
    const cartMock1 = {
        products: [
            "product", "abc2",
            "quantity", 5
        ],
        totalProducts: 5,
        totalPrice: 5000,
    }
    it("add one product response", async function(){
        const response = await cartsManager.addProductToCart("abc1", "abc2")
        expect (response.products).to.be.an("array")
    })
})
describe("Delette one product to cart", function() {
    const cartMock1 = {
        products: [
            "product", "abc2",
            "quantity", 5
        ],
        totalProducts: 5,
        totalPrice: 5000,
    }
    it("delete one product response", async function(){
        const response = await cartsManager.deleteOne("abc1", "abc2")
        console.log(response, "response delette");
        expect (response.products).to.be.an("array")
    })
})
describe("Delete Cart", function() {
    it("Delete cart by id", async function(){
        let id = "abc3"
        const response = await cartsManager.deleteAll(id);
        expect(response).to.have.property("products");
    })
})
describe("Update one product to cart", function() {
    const cartMock1 = {
        products: [
            "product", "abc2",
            "quantity", 5
        ],
        totalProducts: 5,
        totalPrice: 5000,
    }
    it("update one product response", async function(){
        const response = await cartsManager.update("abc1", cartMock1.products.product , cartMock1.totalProducts)
        console.log(response, "response delette");
        expect (response.products).to.be.an("array")
    })
})