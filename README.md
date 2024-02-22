![KafHerderNew1 (1)](https://github.com/oslabs-beta/KafHerder/assets/61262911/883aa4b6-b90b-4521-bdc9-fb387d63c4e8)

## Technologies used:
## Tech Stack

## Tech Stack

- Frontend:
  - <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="50" height="50">
  - <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg" width="50" height="50">
  - <img src="https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg" width="50" height="50">
  - <img src="https://upload.wikimedia.org/wikipedia/commons/8/8e/ReactRouter_Logo.png" width="50" height="50">

- Backend:
  - <img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" width="50" height="50">
  - <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" width="50" height="50">
  - <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.png" width="50" height="50">
  - <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Apache_kafka-icon.png" width="50" height="50">

- Tools:
  - <img src="https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg" width="50" height="50">
  - <img src="https://upload.wikimedia.org/wikipedia/commons/3/3f/Git_icon.svg" width="50" height="50">
  - <img src="https://upload.wikimedia.org/wikipedia/commons/4/42/Redux.png" width="50" height="50">
  - <img src="https://redux-toolkit.js.org/img/redux.svg" width="50" height="50">
  - <img src="https://upload.wikimedia.org/wikipedia/commons/3/39/Prometheus_logo.svg" width="50" height="50">
  - <img src="https://upload.wikimedia.org/wikipedia/commons/c/ca/ViteJS_Logo.svg" width="50" height="50">
  - <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Electron_Software_Framework_Logo.svg" width="50" height="50">


# KafHerder

KafHerder is a desktop application designed to simplify the process of repartitioning Kafka topics and to monitor the overall health of your Kafka cluster all in one place. Say goodbye to complex data transferring procedures and hello to seamless one-click repartitioning. 

## What problem does it solve?

While partitioning is a powerful feature of Kafka for enabling parallel processing of data by consumers, the number of partitions is usually set at the time of topic creation, making it harder to change the number of partitions later on. It is especially difficult to reduce the number of partitions in a topic since Kafka does not natively support this out of the box. This is often necessary to reduce wasted resources or to reconfigure clusters, but can be incredibly complex to undertake as it can lead to data loss or duplicate message processing if not managed correctly.

KafHerder solves all this through our proprietary repartitioning algorithm. All you need to do is pause your consumers and producers, connect to your Kafka cluster, and select how many partitions you want for a topic of choice. KafHerder will then precisely stream messages from your old topic to a new topic it creates, and reconfigures your consumers to the new topic so they can continue reading without missing any messages or processing any twice - guaranteed.

Further, KafHerder allows for full monitoring of the entire repartitioning process directly from our GUI via a Prometheus connection you can enable - so you can be attuned to any potential issues that might arise during this process.


![3clicks](https://github.com/oslabs-beta/KafHerder/assets/61262911/c0736230-092f-49cd-b09a-08435545307d)

![metrics](https://github.com/oslabs-beta/KafHerder/assets/61262911/ca7e98a6-a459-455b-90bd-694ec32c697e)

## Core features

At the heart of KafHerder is a TopicRepartitioner algorithm that computes and executes an optimal strategy for transferring messages to a new topic. Here are some of the steps it undertakes in order to guarantee seamless repartitioning:

1. Records the offsets for each consumer group reading from the old topic
2. Assigns each partition in the old topic a ‘consumer offset configuration’
3. Creates a new topic with a number of partitions that must exceed the number of unique configurations in the old topic
4. Assigns each partition in the new topic a consumer offset configuration
5. Creates ‘repartitioning agents’ that each consume from an partition in the old topic and produce to a partition in the new topic - ensuring both have the same consumer offset configuration
6. If multiple agents are producing to the same topic (i.e.: when reducing the number of partitions), putting them all in a ‘repartitioning group’ that pauses the agents if they hit an offset recorded in step 1, only resuming once every agent in the group has reached the same offset
    * This ensures that all the messages already read by consumer group A and B are written to the new partition before all those read by consumer group B only.
    * This is the only way to guarantee no messages will be lost or read twice in the new partition.
7. Starts all these agents in tandem, disconnecting them when complete.
8. Once complete, deletes all the new consumer groups created as part of a clean-up process.
9. Reconfigures the consumers reading from the old topic to the new topic at the exact offsets needed to continue reading without hiccup.
    
![repartition](https://github.com/oslabs-beta/KafHerder/assets/61262911/6fc487c1-fb4e-433b-9e88-1f95ec783d68)

As you can see, this is a very involved process that is important for any Kafka administrator or Dev Ops/SRE team to monitor. That’s why we also allow our users to connect their Prometheus ports to monitor their Kafka cluster and broker information. Here are some of the metrics our GUI provides monitoring for:
* Global Partition Count
* Number of Under Replicated Partitions
* Number of Offline Partitions
* Active Controller Count
* Total Bytes In
* Total Bytes Out
* Total Messages In
* Percentage of Unsynced Partitions

## Features in progress

While KafHerder has solved the higher-level approach of repartitioning a Kafka topic to have fewer partitions, it is still in beta mode as there is still a lot in the works to make it a complete repartitioning solution. Here are some major features still in the road map.

Repartitioning:
 - Add more logic for balancing the new partitions while repartitioning (if the number of desired partitions exceeds the minimum).
    - Right now, KafHerder just transfers data to the minimum number of partitions it can, when it should be distributing the data across all the partitions in the new topic
    - This has to be done carefully, as splitting up any of the original partitions in the transfer of data can lead to loss of exactly-once processing guarantees in the new topic
- Provide functionality to allow KafHerder to repartition to more partitions. This doesn’t require making a new topic because Kafka supports this out of the box,   but it should still be added to our software to make it a one-stop shop for repartitioning
- Enabling the algorithm to be more efficient at scale (reading from hundreds or thousands of partitions in parallel)

Monitoring:
- Enable users to customize the Prometheus metric names in case they don’t match the defaults
- Enable KafHerder to provide more detailed broker-level and topic-level metrics, versus just general cluster metrics.
- Extract useful repartitioning-specific metrics like consumer/producer lag
- Add alerts and notification for key metrics
- Visualization with Grafana

General:
- Connect and work with cloud-hosted clusters with advanced security protocols (AWS, etc.)
- Enable visualization and repartitioning to happen in tandem, rather than on separate pages.
- Add rigorous automated testing involving auto-deployment of Kafka clusters with various topic configurations to ensure all edge cases are met.

## Open Source Contributions

Development of KafHerder is open source and we welcome contributions from the community. 

1. Fork the project and clone to your local machine
2. Create a feature branch (git checkout -b feature/NewFeatureName)
3. Commit your changes
4. Push to your feature branch
5. Open a Pull Request
6. Create an issue on GitHub 

If you encounter any issues with the application, please report them in the issues tab or submit a pull request. Thank you!


## How to Run a Test Kafka Cluster

KafHerder has a kafkaTest folder that allows you to spin up a Kafka cluster for testing. Here is what you need to do:

1. cd to your working directory
2. Make sure you have Docker Desktop installed and open
3. npm i to install dependencies
4. Run the following command to create your cluster:
    * docker-compose -f docker-compose.yml up -d
5. If you are having caching issues, you can run the following in order:
    * docker-compose build –no-cache kafka1
    * docker-compose build –no-cache kafka2
    * docker-compose build –no-cache kafka3
    * docker-compose up -d
6. Check your Docker Desktop Application to make sure everything is running (5/5). If any aren’t, try clicking the play button to resume them.
7. Go to the run.js file in the kafkaTest folder and read the instructions carefully. Once you run node run.js, it should create a test topic animals3 with 5 partitions that will spread across your 3 brokers. It will also write 500 messages to this topic and configure 3 consumers, A B and C at different offsets in every partition.
    * You may see Kafka logs during this process, including errors. These may be normal. Let the command run fully. It will be finished when it says “disconnecting”.

## How to Run the Application on Dev Mode

* The project has three folders - client, kafkaTest, server. Make sure to change directory to work in the correct folder
* To start the server
    * cd server
    * npm i - to install dependencies
    * npm start - this will start nodemon and run the server.js file
* To start the client do the following
    * cd Client
    * npm i - to install dependencies
    * npm run dev - this will start vite
    * go to http://localhost:5173 in browser to view application
* On the app itself
    * The homepage allows you to provide your Prometheus port and to monitor the overall health of the Kafka cluster (you can do 9090 if you are running the test Kafka cluster above)
    * Click on Repartition on the navigation bar to use the desktop application’s Kafka topic repartitioning feature
    * Provide your url to connect to your Kakfa cluster so the application can access the topic information (for the test cluster, you can do any seed broker, such as: localhost:9092)
    * Once connected, use the search bar to find your topic and click on it to select and submit the topic for repartitioning. 
    * After you submit the topic you selected you’ll receive information on that topic, including the topic name you selected, the number of partitions it currently has, and the minimum number of partitions it should have.
    * Fill out the form with the new topic name, the number of partitions (this cannot be less than the minimum number of partitions provided, and the replication factor.
    * Upon submission, a modal should open up with a loading sign. The repartitioning process can take 30 seconds or more. Once it is done, you will get the new consumer offsets.

