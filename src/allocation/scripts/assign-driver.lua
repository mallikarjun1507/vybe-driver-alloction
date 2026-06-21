local assignmentKey = KEYS[1]
local driverId = ARGV[1]

if redis.call("EXISTS", assignmentKey) == 0 then

   redis.call(
      "SET",
      assignmentKey,
      driverId
   )

   return 1
else
   return 0
end