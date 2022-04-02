use futures::future::abortable;
use std::collections::HashMap;

use super::kafka_consumer::run_async_processor;
pub trait KafkaConsumer {
    fn consume_topic(
        &mut self,
        topic: String,
        broker: String,
        window: tauri::Window,
    );
    fn un_consume_topic(&mut self, topic: String);
    fn new() -> Self;
}

pub struct ConsumerManager {
    consumers: HashMap<String, futures::future::AbortHandle>,
}

impl KafkaConsumer for ConsumerManager {
    /// Produces the given message to the given topic
    /// # Arguments
    ///
    /// * `topic` - The topic to produce to.
    /// * `message` - The message to produce.
    fn consume_topic(
        &mut self,
        topic: String,
        broker: String,
        window: tauri::Window,
    ) {
        if !&self.consumers.contains_key(&topic) {
            let topic_name = topic.to_owned();
            let (task, abort_handle) = abortable(run_async_processor(
                broker.to_owned(),
                String::from("kafka_tools"),
                topic.to_owned(),
                window,
            ));

            tauri::async_runtime::spawn(task);
            self.consumers.insert(topic_name, abort_handle);
        }
    }

    /// Stops consuming from from a given topic
    /// # Arguments
    ///
    /// * `topic` - The topic to stop consuming from
    /// * `message` - The message to produce.
    fn un_consume_topic(&mut self, topic: String) {
        if !!&self.consumers.contains_key(&topic) {
            println!("About to unconsume from {:?}", topic);

            let removed_key = self.consumers.remove(&topic);
            removed_key.unwrap().abort();
        }
    }

    fn new() -> Self {
        ConsumerManager {
            consumers: HashMap::new(),
        }
    }
}
