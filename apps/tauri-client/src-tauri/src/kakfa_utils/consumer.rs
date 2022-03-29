use futures::future::abortable;
use futures::TryStreamExt;
use rdkafka::config::ClientConfig;
use rdkafka::consumer::stream_consumer::StreamConsumer;
use rdkafka::consumer::Consumer;
use serde_json::json;
use std::collections::HashMap;

use rdkafka::Message;

async fn run_async_processor(
    brokers: String,
    group_id: String,
    input_topic: String,
    window: tauri::Window,
) {
    // Create the `StreamConsumer`, to receive the messages from the topic in form of a `Stream`.
    let consumer: StreamConsumer = ClientConfig::new()
        .set("group.id", &group_id)
        .set("bootstrap.servers", &brokers)
        .set("enable.partition.eof", "false")
        .set("session.timeout.ms", "6000")
        .set("enable.auto.commit", "true")
        .create()
        .expect("Consumer creation failed");

    consumer
        .subscribe(&[&input_topic])
        .expect("Can't subscribe to specified topic");

    // Create the outer pipeline on the message stream.
    let stream_processor = consumer.stream().try_for_each(|borrowed_message| {
        let msg = borrowed_message.detach();
        let payload = std::str::from_utf8(msg.payload().unwrap()).unwrap();
        let topic = msg.topic();

        let outbound_message = json!({
            "payload": payload,
            "topic": topic
        });

        println!("The messages is: {:?}", outbound_message.to_string());
        window
            .emit("kafka-message", outbound_message.to_string())
            .unwrap();
        async move { Ok(()) }
    });

    println!("Starting event loop");
    stream_processor.await.expect("stream processing failed");
    println!("Stream processing terminated");
}

pub trait KafkaConsumer {
    fn consume_topic(&mut self, topic: String, window: tauri::Window);
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
    fn consume_topic(&mut self, topic: String, window: tauri::Window) {
        if !&self.consumers.contains_key(&topic) {
            let topic_name = topic.to_owned();
            let (task, abort_handle) = abortable(run_async_processor(
                String::from("localhost:9092"),
                String::from("testaaa"),
                topic,
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
