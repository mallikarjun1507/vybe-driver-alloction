import axios from 'axios';

async function run() {

  const rideId = process.argv[2];

  const requests: Promise<any>[] = [];

  for (let i = 1; i <= 50; i++) {

    requests.push(
      axios.post(
        'http://localhost:3000/rides/accept',
        {
          rideId,
          driverId: `driver-${i}`,
        },
      ),
    );
  }

  const results =
    await Promise.allSettled(
      requests,
    );

  let success = 0;
  let failed = 0;

  results.forEach((item) => {

    if (item.status === 'fulfilled') {

      console.log(
        item.value.data,
      );

      if (
        item.value.data.success
      ) {
        success++;
      } else {
        failed++;
      }

    } else {

      console.log(
        item.reason?.response?.data ||
        item.reason,
      );

      failed++;
    }
  });

  console.log({
    success,
    failed,
  });
}

run();