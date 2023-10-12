const { reset, hardReset } = require('./test.js');

reset('animals2');
// hardReset('animals2', 5, 3, 500); // do this for the FIRST

// INSTRUCTIONS:
// 1. First, cd to the kafkaTest folder
// 2. Second, I would suggest (for consistency) deleting your docker container then rebuilding it:
// docker-compose -f docker-compose.yml up -d
//
// if you get caching issues:
// docker-compose build --no-cache kafka1
// docker-compose build --no-cache kafka2
// docker-compose build --no-cache kafka3
// docker-compose up -d
//
// 3. Third, run node run.js. MAKE SURE hardReset('animals2', 5, 3, 500) is NOT commented out
// this will create a topic animals2 with 5 partitions and a rep factor of 3
// send 500 messages to the 5 partitions
// then create 3 consumer groups to read from it, A B and C
// in 3 different partition consumer offset configurations: 3 x ABC, 1 x BAC, and 1 x CAB
// this is the perfect scenario to try out repartitioning
//
// 4. cd to ../server and npm start to run our Express server
//
// 5. on Postman, doa POST request to http://localhost:3000/admin/repartition
// with the following in the body (JSON):
/*
{
    "seedBrokerUrl": "localhost:9092",
    "topicName": "animals2",
    "newTopicName": "animals2_copy",
    "newMinPartitionNumber": 3,
    "newReplicationFactorNumber": 3
}
*/
//
// 6. Wait about 20 seconds while watching your Express server.
// it may seem stuck on "Still waiting for completion", but sometimes it needs 5 seconds or so
// at the end of it, you should see it console.log ENTIRE REPARTITIONING PROCESS HAS BEEN COMPLETED
// and on Postman you should get an object with all the new consumer offsets
// this object was very deliberately designed like this because I can just feed each individual property back
// into kafkaJS to actually reset the offsets for them
//
// 7. If you need to retest again, you don't need to rebuild your Docker containers
// just comment in reset("animals2") instead of hardReset, let it finish, ctrl+C
// then run step 5 again (Postman) - JUST MAKE SURE TO CHANGE THE NEW TOPIC NAME
// reset is necessary because repartitioning creates a lot of excess consumer groups that need to be deleted
// I will work on middleware to delete this for us and also reconfigure their consumer groups to the new topic
