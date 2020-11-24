// Import the dependencies for testing
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Hello World", () => {
  it("hello world works", (done) => {
    chai.request(app)
      .get('/helloworld')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.keys(["msg"]);
        res.body.should.include({msg: "Hello World!"});
        res.body.should.deep.equal({msg: "Hello World!"});
        done();
      });
  });
});

describe("Restaurant API", () => {
  it("create", (done) => {
    chai.request(app)
      .post('/restaurant/create')
      .send({name: "myNewRestaurant"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.keys(["msg"]);
        console.log(res.body.msg)
        done();
      });
  });
});