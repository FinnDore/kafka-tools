#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use rdkafka::util::get_rdkafka_version;
use tauri::async_runtime::JoinHandle;
use tauri::command;
use tauri::State;
use tokio::task;
mod kakfa_utils;

use crate::kakfa_utils::consumer::{ConsumerManager, KafkaConsumer};
use crate::kakfa_utils::producer::{KafkaProducer, Producer};

#[command(async)]
async fn send_kafka_message(
    kafka_producer: State<'_, Producer>,
    topic: String,
    message: String,
) -> Result<(), ()> {
    kafka_producer.send_kafka_message(topic, message).await;
    Ok(())
}

#[command(async)]
async fn listen_to_topic(
    consumer_manager: State<'_, ConsumerManager>,
    topic: &str,
) -> Result<(), ()> {
    println!("consume from: {:?}", topic);
    consumer_manager.consume_topic(topic);
    Ok(())
}

#[command(async)]
async fn listen(consumer_manager: State<'_, ConsumerManager>, topic: &str) -> Result<(), ()> {
    tauri::async_runtime::spawn(consumer_manager.listen());

    Ok(())
}

#[tokio::main]
async fn main() {
    let (version_n, version_s) = get_rdkafka_version();
    print!("rd_kafka_version: 0x{:08x}, {}", version_n, version_s);

    let broker = "localhost:9092";

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            send_kafka_message,
            listen_to_topic
        ])
        .manage(Producer::new("localhost:9092"))
        .manage(ConsumerManager::new("group1", &broker))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
