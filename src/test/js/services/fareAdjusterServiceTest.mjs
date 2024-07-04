// import your assertion library from chai
import { expect } from 'chai';
import { FareAdjusterService } from '../../../main/js/services/fareAdjusterService.js';

const service = new FareAdjusterService();

describe('FareAdjusterService', () => {
  describe('isValidClass', () => {
    it(`['economy', 'business', 'first'] should be valid class`, () => {
      ['economy', 'business', 'first'].forEach(
        businessClass => expect(service.isValidClass(businessClass)).to.be.true
      )
    })
    it('couch should not be valid class', () => {
      ['couch','other','unknown'].forEach(
        businessClass => expect(service.isValidClass(businessClass)).to.be.false
      )
    })
  })
  describe('adjustFare', () => {
    it('should return $200 for basic economy class', () => expect(service
      .adjustFare(
        { base_cost: 200, tickets_sold: 50, capacity: 100 },
        'economy'
      )).to.be.equal(200)
    )
    it('should return $300 for business class', () => expect(service
      .adjustFare(
        { base_cost: 200, tickets_sold: 50, capacity: 100 },
        'business'
      )).to.be.equal(300)
    )
    it('should return $400 for first class', () => expect(service
      .adjustFare(
        { base_cost: 200, tickets_sold: 50, capacity: 100 },
        'first'
      )).to.be.equal(400)
    )
    it('should return $150 for economy class with 5% tickets sold', () => expect(service
      .adjustFare(
        { base_cost: 200, tickets_sold: 5, capacity: 100 },
        'economy'
      )).to.be.equal(150)
    )
    it('should return $250 for economy class with 85% tickets sold', () => expect(service
      .adjustFare(
        { base_cost: 200, tickets_sold: 85, capacity: 100 },
        'economy'
      )).to.be.equal(250)
    )
  })
})
