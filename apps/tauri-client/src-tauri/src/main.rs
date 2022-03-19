#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
use async_trait::async_trait;
use rdkafka::config::ClientConfig;
use rdkafka::message::OwnedHeaders;
use rdkafka::producer::{FutureProducer, FutureRecord};
use rdkafka::util::get_rdkafka_version;
use std::future;
use std::future::Future;
use std::io;
use std::time::Duration;
use tauri::command;
use tauri::State;

async fn produce_kafka_message(producer: &FutureProducer, topic_name: String, message: String) {
    let delivery_status = producer
        .send(
            FutureRecord::to(&topic_name)
                .payload(&message)
                .key(&format!("Key"))
                .headers(OwnedHeaders::new().add("header_key", "header_value")),
            Duration::from_secs(0),
        )
        .await;

    println!("Future completed. Result: {:?}", delivery_status);
}

#[async_trait]
trait KafkaProducer {
    async fn send_kafka_message(&self, topic: String, message: String);
}

struct Producer {
    producer: FutureProducer,
}

#[async_trait]
impl KafkaProducer for Producer {
    /**
     * Produces the given message to the given topic
     */
    async fn send_kafka_message(&self, topic: String, message: String) {
        produce_kafka_message(&self.producer, topic, message).await;
    }
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

#[tokio::main]
async fn main() {
    let (version_n, version_s) = get_rdkafka_version();
    print!("rd_kafka_version: 0x{:08x}, {}", version_n, version_s);

    let the_kafka_producer: FutureProducer = ClientConfig::new()
        .set("bootstrap.servers", "localhost:9092")
        .set("message.timeout.ms", "5000")
        .create()
        .expect("Producer creation error");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![send_kafka_message])
        .manage(Producer {
            producer: the_kafka_producer,
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
