import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

const user = {
	email: 'fsegu@gmail.com',
	password: '1234',
};
let cookieData;

describe("Products Endpoints", () => {
	before(async () => {
		const response = await requester.post("/api/session/login").send(user);
		const cookie = response.headers["set-cookie"][1];
		cookieData = {
			name: cookie.split("=")[0],
			value: cookie.split("=")[1].split(";")[0]
		};
	});
	describe("POST '/api/products'", () => {
		it("Endpoint POST /api/products create product", async () => {
			const product1 = {
				"title": "Test",
				"description": "Test",
				"code": "1234",
				"price": 1,
				"status": true,
				"thumbnails": "www.com.ar",
				"category": "Test",
				"stock": 500
			};
			const response = await requester.post("/api/products").set("Cookie", [`${cookieData.name}=${cookieData.value}`]).send(product1);
			console.log('==> response', response)
			expect(response.status).to.equal(200);
		});
	it("Endpoint PUT /api/products update product", async () => {
		const product1 = {
			"title": "Test",
			"description": "TestPrueba",
			"code": "1234",
			"price": 1,
			"status": true,
			"thumbnails": "www.com.ar",
			"category": "A",
			"stock": 500
		};
		const response = await requester.put("/api/products/1")
			.set("Cookie", [`${cookieData.name}=${cookieData.value}`])
			.send(product1);
		console.log('==> response 2', response)
		expect(response.status).to.equal(200);
		});
	});
	describe("GET '/api/products'", async () => {
        it("should return all products", async () => {
            const opt = {limit : 0,
                        page: 1,
                        orders: 0};
            const response = await requester.get("/api/products").query(opt);
            expect(response._body.products.docs).to.be.an("array");
        });

        it("should return one product by ID", async () => {
            const response = await requester.get(`/api/products/2`);
            expect(response._body.message).to.be.equal("Product found");
        });
    });
    describe("DELETE '/api/products'", () => {
		it("Endpoint DELETE /api/products delete product by ID", async () => {
			const id = "3";
			const response = await requester.delete("/api/products/3")
				.set("Cookie", [`${cookieData.name}=${cookieData.value}`])
				.send({id});
			expect(response.status).to.equal(200);
		});
	})
});