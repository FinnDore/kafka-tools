#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use crate::kakfa_utils::consumer::consumer::{ConsumerManager, KafkaConsumer};
use crate::kakfa_utils::producer::{KafkaProducer, Producer};

use rdkafka::util::get_rdkafka_version;
use std::sync::Mutex;
use tauri::command;
use tauri::State;

mod kakfa_utils;

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
    broker: String,
    app: tauri::Window,
) -> Result<(), ()> {
    consumer_manager
        .lock()
        .unwrap()
        .consume_topic(topic, broker, app);
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

#[tokio::main]
async fn main() {
    let (version_n, version_s) = get_rdkafka_version();
    print!("rd_kafka_version: 0x{:08x}, {}", version_n, version_s);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            send_kafka_message,
            unsubscribe_from_topic,
            subscribe_to_topic
        ])
        .manage(Producer::new("localhost:9092"))
        .manage(Mutex::new(ConsumerManager::new()))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
