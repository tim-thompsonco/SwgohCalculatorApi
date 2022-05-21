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

  it('Roster endpoint returns unit info from SWGOH Help API when given an ally code', () => {
    const allyCode = 876468577;

    chai.request(app)
      .get(`/roster/${allyCode}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.include.all.keys('VADER');
        expect(res.body['VADER'].to.have.property('type'));
        expect(res.body['VADER'].type.to.be(1));
        expect(res.body['VADER'].to.have.property('starLevel'));
        expect(res.body['VADER'].starLevel.to.be(7));
        expect(res.body['VADER'].to.have.property('level'));
        expect(res.body['VADER'].level.to.be(85));
      });
  });
});