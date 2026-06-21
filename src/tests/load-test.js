const autocannon =
 require('autocannon');

autocannon({

 url:
 'http://localhost:3000/rides',

 method:'POST',

 connections:50,

 duration:20,

 body:JSON.stringify({

   riderId:'r1',

   pickupLat:12.9716,

   pickupLng:77.5946,
 }),

 headers:{
  'content-type':
  'application/json',
 },

},console.log);