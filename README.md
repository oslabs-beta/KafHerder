![KafHerderNew1 (1)](https://github.com/oslabs-beta/KafHerder/assets/61262911/883aa4b6-b90b-4521-bdc9-fb387d63c4e8)

## Technologies used:

![ReactLogo](https://camo.githubusercontent.com/268ac512e333b69600eb9773a8f80b7a251f4d6149642a50a551d4798183d621/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f52656163742d3230323332413f7374796c653d666f722d7468652d6261646765266c6f676f3d7265616374266c6f676f436f6c6f723d363144414642) 
![Prometheus](https://camo.githubusercontent.com/a2372a4ad33db8965d28547272103a71d6c69f50e6e6190d6c694267e374ef91/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f50726f6d6574686575732d3030303030303f7374796c653d666f722d7468652d6261646765266c6f676f3d70726f6d657468657573266c6162656c436f6c6f723d303030303030)
![ExpressJS](https://camo.githubusercontent.com/84e40cc1b235376f4c7442551fecc84e99bbb6736ef470f7d8e7f9655393e2e1/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f457870726573732532306a732d3030303030303f7374796c653d666f722d7468652d6261646765266c6f676f3d65787072657373266c6f676f436f6c6f723d7768697465)
![NPM](https://camo.githubusercontent.com/55037e0ff8e2c9df84ad631c3d0443a7316776ede7459a5872ccb336d7df2781/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6e706d2d4342333833373f7374796c653d666f722d7468652d6261646765266c6f676f3d6e706d266c6f676f436f6c6f723d7768697465)
![Kafka](https://camo.githubusercontent.com/563de9116f70b094abf8afcd05bb1cf7cc2bb628464299623d6ddd4318130bb1/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6170616368652532306b61666b612d2532333230323332612e7376673f7374796c653d666f722d7468652d6261646765266c6f676f3d6170616368656b61666b61266c6f676f436f6c6f723d7768697465)
![ReactRouter](https://camo.githubusercontent.com/4f9d20f3a284d2f6634282f61f82a62e99ee9906537dc9859decfdc9efbb51ec/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f52656163745f526f757465722d4341343234353f7374796c653d666f722d7468652d6261646765266c6f676f3d72656163742d726f75746572266c6f676f436f6c6f723d7768697465)
![Vite](https://camo.githubusercontent.com/c1ee3046774b3a0f6165dbe7f4e8a323f583f21e48d60a4dba8edb49fc2463bc/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f566974652d4237334246453f7374796c653d666f722d7468652d6261646765266c6f676f3d76697465266c6f676f436f6c6f723d464644363245)
![Electron](https://camo.githubusercontent.com/7fdbabca7249452643df5e88d7de38d26e94b5ed832defbeb9fd374a76805de4/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f456c656374726f6e2d3139313937303f7374796c653d666f722d7468652d6261646765266c6f676f3d456c656374726f6e266c6f676f436f6c6f723d7768697465)
![CSS](https://user-images.githubusercontent.com/112911565/260816159-c9f534ca-9f6c-4021-94a2-74bc8eaf065b.png)
![Docker](https://user-images.githubusercontent.com/112911565/260815798-fff446e4-8b75-4c8f-98a1-24b1a3ae33c4.png)
![Git](https://user-images.githubusercontent.com/112911565/260815846-9e360dcd-27c0-4683-ab76-d67d882d3abc.png)
![Redux](https://camo.githubusercontent.com/9a7c7ebbabb2096c0ad0cac6f64bc9fe93f4954a3ae3f51d6f3e076ba462aab1/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f72656475782d2532333539336438382e7376673f7374796c653d666f722d7468652d6261646765266c6f676f3d7265647578266c6f676f436f6c6f723d7768697465)
![ReduxToolki](https://camo.githubusercontent.com/b8e74373b64646a8197fddeed2ccbe2de2f85eb5213656b9fa9fd75030ad9ce6/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f52544b2d3536334437433f7374796c653d666f722d7468652d6261646765266c6f676f3d7265647578266c6f676f436f6c6f723d7768697465)
![HTML](https://camo.githubusercontent.com/49fbb99f92674cc6825349b154b65aaf4064aec465d61e8e1f9fb99da3d922a1/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f68746d6c352d2532334533344632362e7376673f7374796c653d666f722d7468652d6261646765266c6f676f3d68746d6c35266c6f676f436f6c6f723d7768697465)

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

