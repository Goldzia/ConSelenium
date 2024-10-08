import pkg from "pactum";
const { spec } = pkg;
import { expect } from "chai";
import { baseUrl, userName, userId, password } from "../helpers/data.js";

let token;
let isbn;

describe("API tests", () => {
  it("first test", async () => {
   const response = await spec()
   .get(`${baseUrl}/BookStore/v1/Books`)
   expect(response.statusCode).to.eql(200);
   expect(response.body.books[0].title).to.eql("Git Pocket Guide");
   expect(response.body.books[4].author).to.include("Kyle Simpson");
   isbn = response.body.books[7].isbn;
   console.log(password);
   console.log(process.env.SECRET_PASSWORD);
  });

  it.skip("create account", async () => {
    const response = await spec()
    .post(`${baseUrl}/Account/v1/User`)
    .withBody({
      "userName": userName,
      "password": password,
    });
    expect(response.statusCode).to.eql(201);
  });


  it("Generate token", async () => {
    const response = await spec()
    .post(`${baseUrl}/Account/v1/GenerateToken`)
    .withBody({
      "userName": userName,
      "password": password,
    });
    token = response.body.token;
    expect(response.statusCode).to.eql(200);
  });

  it("Authorize", async () => {    
    const response = await spec()
    .post(`${baseUrl}/Account/v1/Authorized`)
    .withBody({
      "userName": userName,
      "password": password,
    });
    expect(response.statusCode).to.eql(200);
  });

  it("Get user ID", async () => {
    const response = await spec()
    .get(`${baseUrl}/Account/v1/User/${userId}`)
    .withBearerToken(token)
    expect(response.statusCode).to.eql(200);
  }); 

  it("Add book", async () => {
    const response = await spec()
    .post(`${baseUrl}/BookStore/v1/Books`)
    .withBody({
      "userId": userId,
      "collectionOfIsbns": [
        {
          "isbn": isbn
        }
      ] 
    })
    .withBearerToken(token)
    expect(response.statusCode).to.eql(201);
  });

  it("Delete book", async () => {
    const response = await spec()
    .delete(`${baseUrl}/BookStore/v1/Books?UserId=${userId}`)
    .withBearerToken(token)
    expect(response.statusCode).to.eql(204);
    expect(response.body).to.eql("");
  });
});
