use async_trait::async_trait;
use futures::stream::FuturesUnordered;
use futures::{StreamExt, TryStreamExt};
use rdkafka::config::ClientConfig;
use rdkafka::consumer::stream_consumer::StreamConsumer;
use rdkafka::consumer::Consumer;

#[async_trait]
pub trait KafkaConsumer {
    fn consume_topic(&self, topic: &str);
    async fn listen(&self);
    fn new(group_id: &str, broker: &str) -> Self;
}

pub struct ConsumerManager {
    consumer: StreamConsumer,
}

#[async_trait]
impl KafkaConsumer for ConsumerManager {
    /// Produces the given message to the given topic
    /// # Arguments
    ///
    /// * `topic` - The topic to produce to.
    /// * `message` - The message to produce.
    fn consume_topic(&self, topic: &str) {
        &self
            .consumer
            .subscribe(&[&topic])
            .expect("Can't subscribe to specified topic");
    }

    async fn listen(&self) {
        println!("listening for messages");
        &self
            .consumer
            .stream()
            .try_for_each(|borrowed_message| async move {
                println!("messsage {:?}", borrowed_message);
                Ok(())
            })
            .await
            .expect("stream processing failed");
    }

    fn new(group_id: &str, broker: &str) -> Self {
        let consumer: StreamConsumer = ClientConfig::new()
            .set("group.id", group_id)
            .set("bootstrap.servers", broker)
            .set("enable.partition.eof", "false")
            .set("session.timeout.ms", "6000")
            .set("enable.auto.commit", "false")
            .create()
            .expect("Consumer creation failed");

        let manager = ConsumerManager { consumer };
        manager.listen();

        manager
    }
}

// (|borrowed_message| {
//     async move {
//         // Process each message;
//         println!(borrowed_message)
//     });
