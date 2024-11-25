# Python Docker image
FROM python:3.13-alpine AS python-builder

WORKDIR /usr/src/app

RUN apk add --no-cache gcc g++ musl-dev libffi-dev

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt


# Node.js Docker image
FROM node:22-alpine AS node-builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .


# Ruby Docker image
FROM ruby:3.3-alpine AS ruby-builder

WORKDIR /usr/src/app

RUN apk add --no-cache build-base

# Add Ruby-specific dependencies or gems here if needed


# Java Docker image
FROM openjdk:17-alpine AS java-builder

WORKDIR /usr/src/app

# Add Java-specific build steps if necessary


# Go Docker image
FROM golang:1.21-alpine AS go-builder

WORKDIR /usr/src/app

# Add Go-specific build steps if necessary


# R Docker image
FROM r-base:4.3.1 AS r-builder

WORKDIR /usr/src/app

# Add R-specific build steps if necessary


# Final unified image if combining outputs is necessary
FROM alpine:latest AS final

WORKDIR /usr/src/app

RUN apk add --no-cache libffi

# Optionally, copy outputs from the specific language images if needed
COPY --from=python-builder /usr/local/lib /usr/local/lib
COPY --from=node-builder /usr/local/lib/node_modules /usr/local/lib/node_modules
