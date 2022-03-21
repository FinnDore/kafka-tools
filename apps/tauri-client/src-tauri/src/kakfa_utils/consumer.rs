use async_trait::async_trait;
use futures::stream::FuturesUnordered;
use futures::{StreamExt, TryStreamExt};
use rdkafka::config::ClientConfig;
use rdkafka::consumer::stream_consumer::StreamConsumer;
use rdkafka::consumer::Consumer;
use std::vec::Vec;

#[async_trait]
pub trait KafkaConsumer {
    fn consume_topic(&mut self, topic: String);
    fn un_consume_topic(&mut self, topic: String);
    // fn get_subs(&self) -> &Vec<String>;
    fn listen(&self);
    fn new(group_id: &str, broker: &str) -> Self;
}

pub struct ConsumerManager {
    consumer: StreamConsumer,
    subscription_list: Vec<String>,
}

#[async_trait]
impl KafkaConsumer for ConsumerManager {
    /// Produces the given message to the given topic
    /// # Arguments
    ///
    /// * `topic` - The topic to produce to.
    /// * `message` - The message to produce.
    fn consume_topic(&mut self, topic: String) {
        if !&self.subscription_list.contains(&topic) {
            let topic_str: &str = &topic;

            self.consumer
                .subscribe(&[topic_str])
                .expect("Can't subscribe to specified topic");

            println!("listen to topic {:?}", topic);
            self.subscription_list.push(topic);

            &self
                .consumer
                .stream()
                .try_for_each(|borrowed_message| async move {
                    println!("messsage {:?}", borrowed_message);
                    Ok(())
                });
        }
    }

    fn listen(&self) {
        println!("listening for messages");
    }

    /// Stops consuming from from a given topic
    /// # Arguments
    ///
    /// * `topic` - The topic to stop consuming from
    /// * `message` - The message to produce.
    fn un_consume_topic(&mut self, topic: String) {
        print!(
            "Consuming from {:?} about to unconsumed from {:?}",
            &self.subscription_list, topic
        );
        if !&self.subscription_list.contains(&topic) {
            let index = self
                .subscription_list
                .iter()
                .position(|current_topic| current_topic == &topic)
                .unwrap();

            &self.subscription_list.remove(index);
            &self.consumer.unsubscribe();

            let topics = self.subscription_list.iter();
            let topics_as_str: Vec<&str> = topics.map(|s| s.as_str()).collect();

            &self
                .consumer
                .subscribe(&topics_as_str[..])
                .expect("Can't subscribe to specified topic");
        }

        print!("Consuming from {:?}", &self.subscription_list);
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

        let manager = ConsumerManager {
            consumer,
            subscription_list: Vec::new(),
        };

        manager
    }
}

// (|borrowed_message| {
//     async move {
//         // Process each message;
//         println!(borrowed_message)
//     });
