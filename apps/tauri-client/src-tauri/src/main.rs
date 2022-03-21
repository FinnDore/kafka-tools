#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use crate::kakfa_utils::consumer::{ConsumerManager, KafkaConsumer};
use crate::kakfa_utils::producer::{KafkaProducer, Producer};

use futures::TryStreamExt;
use rdkafka::config::ClientConfig;
use rdkafka::consumer::stream_consumer::StreamConsumer;
use rdkafka::consumer::Consumer;
use rdkafka::util::get_rdkafka_version;
use rdkafka::Message;
use serde_json::json;
use std::sync::Mutex;
use tauri::command;
use tauri::State;

mod kakfa_utils;

async fn run_async_processor(brokers: String, group_id: String, input_topic: String) {
    // Create the `StreamConsumer`, to receive the messages from the topic in form of a `Stream`.
    let consumer: StreamConsumer = ClientConfig::new()
        .set("group.id", &group_id)
        .set("bootstrap.servers", &brokers)
        .set("enable.partition.eof", "false")
        .set("session.timeout.ms", "6000")
        .set("enable.auto.commit", "false")
        .create()
        .expect("Consumer creation failed");

    consumer
        .subscribe(&[&input_topic])
        .expect("Can't subscribe to specified topic");

    // Create the outer pipeline on the message stream.
    let stream_processor = consumer.stream().try_for_each(|borrowed_message| {
        let msg = borrowed_message.detach();
        //   std::str::from_utf8(

        let payload = std::str::from_utf8(msg.payload().unwrap()).unwrap();
        let topic = msg.topic();

        let outbound_message = json!({
            "payload": payload,
            "topic": topic
        });

        println!("The messages is: {:?}", outbound_message.to_string());
        async move { Ok(()) }
    });

    println!("Starting event loop");
    stream_processor.await.expect("stream processing failed");
    println!("Stream processing terminated");
}

#[command(async)]
async fn send_kafka_message(
    kafka_producer: State<'_, Producer>,
    topic: String,
    message: String,
) -> Result<(), ()> {
    kafka_producer.send_kafka_message(topic, message).await;
    Ok(())
}

// #[command(async)]
// async fn subscribe_to_topic(
//     consumer_manager: State<'_, Mutex<ConsumerManager>>,
//     topic: String,
// ) -> Result<(), ()> {
//     Ok(())
// }

#[command(async)]
async fn unsubscribe_from_topic(
    consumer_manager: State<'_, Mutex<ConsumerManager>>,
    topic: String,
) -> Result<(), ()> {
    consumer_manager.lock().unwrap().un_consume_topic(topic);
    Ok(())
}

#[command(async)]
async fn activate_consumer(consumer_manager: State<'_, Mutex<ConsumerManager>>) -> Result<(), ()> {
    consumer_manager.lock().unwrap().listen();
    Ok(())
}

#[tokio::main]
async fn main() {
    let (version_n, version_s) = get_rdkafka_version();
    print!("rd_kafka_version: 0x{:08x}, {}", version_n, version_s);

    let broker = "localhost:9092";
    let consumer = Mutex::new(ConsumerManager::new("group1", &broker));
    tokio::spawn(run_async_processor(
        String::from("localhost:9092"),
        String::from("testaaa"),
        String::from("topic-test"),
    ));
    consumer
        .lock()
        .unwrap()
        .consume_topic(String::from("topic-test"));

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            send_kafka_message,
            unsubscribe_from_topic,
            activate_consumer
        ])
        .manage(Producer::new("localhost:9092"))
        .manage(consumer)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
