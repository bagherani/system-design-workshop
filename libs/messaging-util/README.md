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

### Step 2: Start Kafka Broker (KRaft Mode)

```bash
docker run -d \
  --name kafka-broker \
  --net kafka-net \
  -p 9092:9092 \
  -e KAFKA_NODE_ID=1 \
  -e KAFKA_PROCESS_ROLES=broker,controller \
  -e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092,CONTROLLER://0.0.0.0:9093 \
  -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 \
  -e KAFKA_CONTROLLER_LISTENER_NAMES=CONTROLLER \
  -e KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT \
  -e KAFKA_CONTROLLER_QUORUM_VOTERS=1@kafka-broker:9093 \
  -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 \
  -e KAFKA_TRANSACTION_STATE_LOG_REPLICATION_FACTOR=1 \
  -e KAFKA_TRANSACTION_STATE_LOG_MIN_ISR=1 \
  -e CLUSTER_ID=MkU3OEVBNTcwNTJENDM2Qk \
  confluentinc/cp-kafka:7.5.0
```

Wait 15 seconds.

---

### Step 3: Create Topic

```bash
docker exec kafka-broker kafka-topics \
  --bootstrap-server localhost:9092 \
  --create \
  --topic vehicle-location \
  --partitions 3 \
  --replication-factor 1
```

Verify:

```bash
docker exec kafka-broker kafka-topics \
  --bootstrap-server localhost:9092 \
  --describe \
  --topic vehicle-location
```

---

### Cleanup

```bash
docker rm -f kafka-broker
docker network rm kafka-net
```

---

## Connection Info

**Broker:** `localhost:9092`
