import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../app';

const { expect } = chai;

chai.use(chaiHttp);

describe('Integration tests for obtaining data from SWGOH Help API', () => {
  it('Units endpoint returns unit info from SWGOH Help API', () => {
    chai.request(app)
      .get('/units')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.include.all.keys('VADER', 'JEDIKNIGHTLUKE', 'WAMPA');
      });
  });
});