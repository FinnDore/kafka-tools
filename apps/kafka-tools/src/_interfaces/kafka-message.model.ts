export interface KafkaMessage {
    timeStamp: number;
    topic: string;
    payload: unknown;
}
