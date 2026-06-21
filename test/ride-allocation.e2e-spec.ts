import request from 'supertest';

describe(
 'Ride Allocation',
 ()=>{

  it(
   'assigns only one driver',
   async ()=>{

    const responses =
      await Promise.all(

      Array.from(
       {length:20},
       (_,i)=>
         request(
          'http://localhost:3000',
         )
         .post(
          '/rides/accept',
         )
         .send({
           rideId:
           'ride-id',

           driverId:
           `D${i}`,
         }),
      ),
    );

    const success =
      responses.filter(
       r=>
        r.body.success,
      );

    expect(
      success.length,
    ).toBe(1);
   },
  );
 });