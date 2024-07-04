// import your assertion library from chai
import { expect } from 'chai';
import { FareService } from '../../../main/js/services/fareService.js';

const service = new FareService({ db: ({
    prepare: (sql) => ({
        get: (params, callback) => {
            let flightId = params[0];
            switch ( flightId ) {
                case 200:
                    callback( null, { base_cost: 200, capacity: 100, tickets_sold: 50 } );
                    break;
                case 205:
                    callback( null, { base_cost: 200, capacity: 100, tickets_sold: 5 } );
                    break;
                case 285:
                    callback( null, { base_cost: 200, capacity: 100, tickets_sold: 85 } );
                    break;
                case 404:
                    callback( null, null ); // not found?
                    break;
                case 500:
                    callback( new Error('Internal Server Error'), null );
                    break;
                default:
                    callback( new Error(`unexpected call with flight_id=${flightId}`), null );
                    break;
            }
        }
    })
}) });

describe('FareService', () => {
    it('should return $200 for economy class', () => service.getFare(200, 'economy')
        .then( fare => {
            expect(fare).to.be.equal(200);
        })
    )
    it('should return $300 for business class', () => service.getFare(200, 'business')
        .then( fare => {
            expect(fare).to.be.equal(300);
        })
    )
    it('should return $400 for first class', () => service.getFare(200, 'first')
        .then( fare => {
            expect(fare).to.be.equal(400);
        })
    )
    it('should return $150 for economy class with 5% tickets sold', () => service.getFare(205, 'economy')
        .then( fare => {
            expect(fare).to.be.equal(150);
        })
    )
    it('should return $250 for economy class with 85% tickets sold', () => service.getFare(285, 'economy')
        .then( fare => {
            expect(fare).to.be.equal(250);
        })
    )
    it('should return a not found error for flight 404', () => 
        service.getFare(404, 'economy').catch(err => {
          expect(err).to.be.an('error');
          expect(err.message).to.contain('Flight with id=404 not found');
        })
    )
    it('should return an internal server error for flight 500', () => 
        service.getFare(500, 'economy').catch(err => {
          expect(err).to.be.an('error');
          expect(err.message).to.contain('Internal Server Error');
        })
    )
})
