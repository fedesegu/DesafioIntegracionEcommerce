import  { productsManager }  from "../src/DAL/daos/mongoDB/productManagerDB.js";
import { expect } from "chai";
import "./db.js";
import mongoose from "mongoose";


describe("find All", function (){
    it("should return an array", async function() {
        const limit = 20;
        const result = await productsManager.findAll({ limit });
        expect(result.docs).to.be.an("array");
    });
})
describe("create one product", function (){

    after(function() {
        mongoose.connection.collections.products.drop();
    });
    const productMock1 = {
        title: "Yerba",
        description: "infusión",
        price: "300",
        stock: "300",
        code: "001",
        category: "Alimentos"
    }
    const productMock2 = {
        title: "Alfajores",
        description: "Chocolates",
        price: "600",
        stock: "150",
        code: "002",
        category: "Alimentos"
    }
    const productMock3 = {
        title: "Yerba",
        description: "infusión",
        price: "300",
        stock: "300",
        code: "001",
        category: "Alimentos",
        owner: "premium"
    }
    it("successful creation", async function(){
        const response = await productsManager.createOne(productMock1);
        expect(response).to.have.property("owner")
    })
    it("should throw an error if a required property in missing", async function(){
        try {
            await productsManager.createOne(productMock2);
        } catch (error) {
            expect(error).to.be.an("error");
        }
    })
})
describe("Find Products", function() {
    const productMock1 = {
        title: "Yerba",
        description: "infusión",
        price: "300",
        stock: "300",
        code: "001",
        category: "Alimentos",
        owner: "premium"
    }
    const productMock2 = {
        title: "Alfajores",
        description: "Chocolates",
        price: "600",
        stock: "150",
        code: "002",
        category: "Alimentos"
    }
    it("Find product by owner", async function(){
        const product1 = await productsManager.createOne(productMock1);
        const product2 = await productsManager.createOne(productMock2);
        const response = await productsManager.findByOwner(product1.owner);
        expect(response).to.have.lengthOf(1)
    })
})