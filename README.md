# Vybe Driver Allocation System

## Overview

A scalable ride allocation backend built using NestJS, PostgreSQL, Redis, BullMQ, and WebSockets.

Features:

* Driver Registration
* Driver Location Updates
* Redis GEO Nearby Driver Search
* Ride Creation
* Multi-driver Notification
* Atomic Ride Assignment using Redis Lua Script
* BullMQ Retry Queue
* Ride Timeout Handling
* WebSocket Notifications
* Swagger API Documentation

## Tech Stack

* NestJS
* PostgreSQL
* Redis
* BullMQ
* TypeORM
* Swagger
* WebSockets

## Setup

### Clone Repository

git clone <repository-url>

cd vybe-driver-allocation

### Install Dependencies

npm install

### Configure Environment

Create .env

PORT=3000

DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=vybe_db

REDIS_HOST=localhost
REDIS_PORT=6379

### Start Application

npm run start:dev

### Swagger

http://localhost:3000/api-docs

### Health Check

http://localhost:3000/health

## Concurrency Handling

Ride assignment is protected using Redis Lua scripting. Only one driver can successfully acquire a ride.

Concurrency Test Result:

1 Successful Assignment
49 Rejected Requests

## Notification Strategy

WebSockets are used to notify multiple nearby drivers simultaneously. The top 5 nearest drivers are selected and notified in parallel.

## Retry Strategy

BullMQ retries ride allocation if no driver accepts. After the maximum retry count is reached, the ride is marked TIMEOUT.

The project uses Docker Compose to provision PostgreSQL and Redis.

Start infrastructure:

docker compose up -d

PostgreSQL:
localhost:5433

Redis:
localhost:6379

# Start PostgreSQL and Redis

docker compose up -d

# Stop services

docker compose down


## API Examples

### Create Driver

curl -X POST http://localhost:3000/drivers 
-H "Content-Type: application/json" 
-d '{
"name":"Driver 1",
"phone":"9999999999"
}'

### Update Driver Location

curl -X POST http://localhost:3000/drivers/location 
-H "Content-Type: application/json" 
-d '{
"driverId":"<driver-id>",
"lat":12.9716,
"lng":77.5946
}'

### Create Ride

curl -X POST http://localhost:3000/rides 
-H "Content-Type: application/json" 
-d '{
"riderId":"rider-1",
"pickupLat":12.9716,
"pickupLng":77.5946
}'

### Accept Ride

curl -X POST http://localhost:3000/rides/accept 
-H "Content-Type: application/json" 
-d '{
"rideId":"<ride-id>",
"driverId":"<driver-id>"
}'

### Get Ride

curl http://localhost:3000/rides/<ride-id>

