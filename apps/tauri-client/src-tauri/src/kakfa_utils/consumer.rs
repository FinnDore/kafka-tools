use async_trait::async_trait;
use rdkafka::config::ClientConfig;
use rdkafka::consumer::{Consumer, DefaultConsumerContext, MessageStream, StreamConsumer};
use rdkafka::message::OwnedHeaders;
use std::time::Duration;

#[async_trait]
pub trait KafkaConsumer {
    async fn consume_topic(&self, topic: &str);
    async fn new(group_id: &str, broker: &str, topic: &str);
}

pub struct aConsumer {
    consumer: StreamConsumer,
}

#[async_trait]
impl KafkaConsumer for aConsumer {
    /// Produces the given message to the given topic
    /// # Arguments
    ///
    /// * `topic` - The topic to produce to.
    /// * `message` - The message to produce.
    ///
    /// # Examples
    ///
    /// ```
    /// let my_kafka_producer = Producer::new("localhost:9092");]
    /// my_kafka_producer.send_kafka_message("test-topic", "My message!")
    /// ```
    async fn consume_topic(&self, topic: &str) {
        &self
            .consumer
            .subscribe(&[&topic])
            .expect("Can't subscribe to specified topic");

        // println!("Future completed. Result: {:?}", delivery_status);
    }

    async fn new(group_id: &str, broker: &str, topic: &str) {
        let consumer: StreamConsumer = ClientConfig::new()
            .set("group.id", group_id)
            .set("bootstrap.servers", broker)
            .set("enable.partition.eof", "false")
            .set("session.timeout.ms", "6000")
            .set("enable.auto.commit", "false")
            .create()
            .expect("Consumer creation failed");

        consumer
            .subscribe(&[&topic])
            .expect("Can't subscribe to specified topic");

        println!("listening to {:?}", topic);
        loop {
            match consumer.recv().await {
                Err(e) => println!("Kafka error: {}", e),
                Ok(m) => {
                    println!("messsage {:?}", m);

                    // consumer.commit_message(&m, CommitMode::Async).unwrap();
                }
            }
        }
    }

    // aConsumer { consumer }
}

// (|borrowed_message| {
//     async move {
//         // Process each message;
//         println!(borrowed_message)
//     });
