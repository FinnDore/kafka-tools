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
use std::sync::{Arc, Mutex};
use std::thread;
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
async fn subscribe_to_topic(
    consumer_manager: State<'_, Mutex<ConsumerManager>>,
    topic: String,
) -> Result<(), ()> {
    consumer_manager.lock().unwrap().consume_topic(topic);
    Ok(())
}

#[command(async)]
async fn unsubscribe_from_topic(
    consumer_manager: State<'_, Mutex<ConsumerManager>>,
    topic: String,
) -> Result<(), ()> {
    consumer_manager.lock().unwrap().un_consume_topic(topic);
    Ok(())
}

// #[command(async)]
// fn activate_consumer(consumer_manager: State<'_, Mutex<ConsumerManager>>) -> Result<(), ()> {}

#[tokio::main]
async fn main() {
    let (version_n, version_s) = get_rdkafka_version();
    print!("rd_kafka_version: 0x{:08x}, {}", version_n, version_s);

    let broker = "localhost:9092";
    let c = ConsumerManager::new("group1", &broker);
    tauri::async_runtime::spawn(c.listen());

    let consumer = Mutex::new(c);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            send_kafka_message,
            subscribe_to_topic,
            unsubscribe_from_topic
        ])
        .manage(Producer::new("localhost:9092"))
        .manage(consumer)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
