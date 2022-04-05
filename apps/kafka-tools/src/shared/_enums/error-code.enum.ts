/**
 * Error code that the backend can produce
 */
export enum ErrorCode {
    // Topic related errors
    UNKNOWN_TOPIC,

    // Broker related errors
    BROKER_CONNECTION_TIMEOUT,
    UNEXPECTED_BROKER_DISCONNECT,

    // Zookeeper related errors
    ZOOKEEPER_CONNECTION_TIMEOUT,
    UNEXPECTED_ZOOKEEPER_DISCONNECT,

    // Unknown Errors
    UNKNOWN_ERROR,
}
