const app = require("../../index"); // or wherever your Express app is defined
const request = require("supertest")(app);
const expect = require("chai").expect;

describe("POST /register/", function () {
    it("responds with a success message on account creation", function (done) {
        request
            .post("/register/")
            // .type("form")
            .send({ email: "user123@example.com", password: "password123" })
            .expect(200)
            .expect(function (response) {
                expect(response.body).not.to.be.empty;
                expect(response.body).to.be.an("object");
            })
            .end(done);
    }).timeout(5000); // increase timeout to 5 seconds
});

describe("GET /test/", function () {
    it("responds with 'hello world!'", function (done) {
        request
            .get("/test/")
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                expect(res.text).to.equal("hello world!");
                done();
            });
    });
});
