use async_trait::async_trait;
use rdkafka::config::ClientConfig;
use rdkafka::message::OwnedHeaders;
use rdkafka::producer::{FutureProducer, FutureRecord};
use std::time::Duration;

#[async_trait]
pub trait KafkaProducer {
    async fn send_kafka_message(&self, topic: String, message: String);
    fn new(broker: &str) -> Self;
}

pub struct Producer {
    producer: FutureProducer,
}

#[async_trait]
impl KafkaProducer for Producer {
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
    async fn send_kafka_message(&self, topic: String, message: String) {
        let _ = self
            .producer
            .send(
                FutureRecord::to(&topic)
                    .payload(&message)
                    .key(&format!("Key"))
                    .headers(
                        OwnedHeaders::new().add("header_key", "header_value"),
                    ),
                Duration::from_secs(0),
            )
            .await;
    }

    fn new(broker: &str) -> Self {
        let producer: FutureProducer = ClientConfig::new()
            .set("bootstrap.servers", broker)
            .set("message.timeout.ms", "5000")
            .create()
            .expect("Producer creation error");
        Self { producer }
    }
}
