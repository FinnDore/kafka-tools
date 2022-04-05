/**
 * Event codes that the backend can produce
 */
export enum EventCode {
    KAFKA_MESSAGE,
    OFFSET_UPDATE,
    NEW_TOPIC,
    TOPIC_DELETED,

    // Broker related Events
    BROKER_CONNECT,
    BROKER_DISCONNECT,
    BROKER_RECONNECT,

    // Zookeeper related errors
    ZOOKEEPER_CONNECT,
    ZOOKEEPER_DISCONNECT,
    ZOOKEEPER_RECONNECT,
}
