# Messaging Util - Kafka Setup

## Kafka Setup (KRaft Mode)

**Prerequisites:**

- Docker is installed and running

---

### Step 1: Create Docker Network

```bash
docker network create kafka-net
```

---

### Step 2: Start Kafka Brokers (KRaft Mode - 3 Brokers)

**Broker 1:**

```bash
docker run -d \
  --name kafka-broker-1 \
  --net kafka-net \
  -p 9092:9092 \
  -e KAFKA_NODE_ID=1 \
  -e KAFKA_PROCESS_ROLES=broker,controller \
  -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:29092,PLAINTEXT_HOST://0.0.0.0:9092,CONTROLLER://0.0.0.0:9093 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://kafka-broker-1:29092,PLAINTEXT_HOST://localhost:9092 \
  -e KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER \
  -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT \
  -e KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT \
  -e KAFKA_CONTROLLER_QUORUM_VOTERS=1@kafka-broker-1:9093,2@kafka-broker-2:9093,3@kafka-broker-3:9093 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=2 \
  -e KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR=2 \
  -e KAFKA_TRANSACTION_STATE_LOG_MIN_ISR=1 \
  -e KAFKA_MIN_INSYNC_REPLICAS=1 \
  -e CLUSTER_ID=MkU3OEVBNTcwNTJENDM2Qk \
  confluentinc/cp-kafka:7.5.0
```

**Broker 2:**

```bash
docker run -d \
  --name kafka-broker-2 \
  --net kafka-net \
  -p 9093:9092 \
  -e KAFKA_NODE_ID=2 \
  -e KAFKA_PROCESS_ROLES=broker,controller \
  -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:29092,PLAINTEXT_HOST://0.0.0.0:9092,CONTROLLER://0.0.0.0:9093 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://kafka-broker-2:29092,PLAINTEXT_HOST://localhost:9093 \
  -e KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER \
  -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT \
  -e KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT \
  -e KAFKA_CONTROLLER_QUORUM_VOTERS=1@kafka-broker-1:9093,2@kafka-broker-2:9093,3@kafka-broker-3:9093 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=2 \
  -e KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR=2 \
  -e KAFKA_TRANSACTION_STATE_LOG_MIN_ISR=1 \
  -e KAFKA_MIN_INSYNC_REPLICAS=1 \
  -e CLUSTER_ID=MkU3OEVBNTcwNTJENDM2Qk \
  confluentinc/cp-kafka:7.5.0
```

**Broker 3:**

```bash
docker run -d \
  --name kafka-broker-3 \
  --net kafka-net \
  -p 9094:9092 \
  -e KAFKA_NODE_ID=3 \
  -e KAFKA_PROCESS_ROLES=broker,controller \
  -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:29092,PLAINTEXT_HOST://0.0.0.0:9092,CONTROLLER://0.0.0.0:9093 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://kafka-broker-3:29092,PLAINTEXT_HOST://localhost:9094 \
  -e KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER \
  -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT \
  -e KAFKA_INTER_BROKER_LISTENER_NAME=PLAINTEXT \
  -e KAFKA_CONTROLLER_QUORUM_VOTERS=1@kafka-broker-1:9093,2@kafka-broker-2:9093,3@kafka-broker-3:9093 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=2 \
  -e KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR=2 \
  -e KAFKA_TRANSACTION_STATE_LOG_MIN_ISR=1 \
  -e KAFKA_MIN_INSYNC_REPLICAS=1 \
  -e CLUSTER_ID=MkU3OEVBNTcwNTJENDM2Qk \
  confluentinc/cp-kafka:7.5.0
```

Wait 15 seconds for all brokers to start and form a cluster.

---

### Step 3: Create Topic

```bash
docker exec kafka-broker-1 kafka-topics \
  --bootstrap-server localhost:29092 \
  --create \
  --topic post_liked \
  --partitions 3 \
  --replication-factor 2
```

Verify:

```bash
docker exec kafka-broker-1 kafka-topics \
  --bootstrap-server localhost:29092 \
  --describe \
  --topic post_liked
```

You should see output showing 3 partitions with 2 replicas each, distributed across the 3 brokers.

---

### Cleanup

```bash
docker rm -f kafka-broker-1 kafka-broker-2 kafka-broker-3
docker network rm kafka-net
```

---

## Connection Info

**Brokers:**

- Broker 1: `localhost:9092`
- Broker 2: `localhost:9093`
- Broker 3: `localhost:9094`

You can connect to any broker, as they all participate in the same cluster.

**Docker network (for Kafka UI and other containers on `kafka-net`):**

- Broker 1: `kafka-broker-1:29092`
- Broker 2: `kafka-broker-2:29092`
- Broker 3: `kafka-broker-3:29092`

## UI

```bash
docker rm -f kafka-ui 2>/dev/null || true
docker run -d --name kafka-ui --net kafka-net -p 8080:8080 \
  -e KAFKA_CLUSTERS_0_NAME=local \
  -e KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS=kafka-broker-1:29092,kafka-broker-2:29092,kafka-broker-3:29092 \
  provectuslabs/kafka-ui:latest
```
