#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use rdkafka::util::get_rdkafka_version;
use tauri::command;
use tauri::State;

mod kakfa_utils;

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

#[tokio::main]
async fn main() {
    let (version_n, version_s) = get_rdkafka_version();
    print!("rd_kafka_version: 0x{:08x}, {}", version_n, version_s);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![send_kafka_message])
        .manage(Producer::new("localhost:9092"))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
