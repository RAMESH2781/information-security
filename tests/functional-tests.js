const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const { expect } = chai;

chai.use(chaiHttp);

describe('Stock Price Checker API', () => {
  it('should return stock data for one stock', (done) => {
    chai.request(app)
      .get('/api/stock-prices')
      .query({ stock: 'AAPL' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('stockData');
        done();
      });
  });

  it('should return stock data for one stock and allow liking', (done) => {
    chai.request(app)
      .get('/api/stock-prices')
      .query({ stock: 'AAPL', like: 'true' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('stockData');
        done();
      });
  });

  it('should not allow multiple likes from the same IP', (done) => {
    chai.request(app)
      .get('/api/stock-prices')
      .query({ stock: 'AAPL', like: 'true' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('stockData');
        done();
      });
  });

  it('should return stock data for two stocks', (done) => {
    chai.request(app)
      .get('/api/stock-prices')
      .query({ stock: ['AAPL', 'GOOGL'] })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('stockData').that.is.an('array').with.lengthOf(2);
        done();
      });
  });

  it('should return relative likes for two stocks', (done) => {
    chai.request(app)
      .get('/api/stock-prices')
      .query({ stock: ['AAPL', 'GOOGL'], like: 'true' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('stockData').that.is.an('array').with.lengthOf(2);
        done();
      });
  });
});
