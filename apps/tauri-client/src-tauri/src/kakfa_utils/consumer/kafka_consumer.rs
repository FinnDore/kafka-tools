use futures::TryStreamExt;
use rdkafka::config::ClientConfig;
use rdkafka::consumer::stream_consumer::StreamConsumer;
use rdkafka::consumer::Consumer;
use serde_json::json;

use rdkafka::Message;

pub async fn run_async_processor(
    brokers: String,
    group_id: String,
    input_topic: String,
    window: tauri::Window,
) {
    // Create the `StreamConsumer`, to receive the messages from the topic in form of a `Stream`.
    let consumer: StreamConsumer = ClientConfig::new()
        .set("group.id", group_id)
        .set("bootstrap.servers", brokers)
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
        let timestamp = msg.timestamp();

        let outbound_message = json!({
            "payload": payload,
            "topic": topic,
            "timeStamp": timestamp.to_millis()
        });

        window
            .emit("kafka-message", outbound_message.to_string())
            .unwrap();
        async move { Ok(()) }
    });

    println!("Starting event loop");
    stream_processor.await.expect("stream processing failed");
    println!("Stream processing terminated");
}
