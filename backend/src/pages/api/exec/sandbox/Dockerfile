FROM python:3.13-alpine AS python-builder
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt


FROM node:22-alpine AS node-builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .


FROM ruby:3.3-alpine AS ruby-builder
WORKDIR /usr/src/app
RUN apk add --no-cache build-base


FROM eclipse-temurin:21-alpine AS java-builder
WORKDIR /usr/src/app


FROM golang:1.21-alpine AS go-builder
WORKDIR /usr/src/app


FROM alpine:latest AS racket-builder
WORKDIR /usr/src/app
RUN apk add --no-cache racket


FROM perl:5.38 AS perl-builder
WORKDIR /usr/src/app


FROM alpine:latest AS final
WORKDIR /usr/src/app

RUN apk add --no-cache bash gcc g++ musl-dev libffi lz4-libs R php perl

COPY --from=python-builder /usr/local/bin /usr/local/bin
COPY --from=python-builder /usr/local/lib /usr/local/lib
COPY --from=python-builder /usr/lib /usr/lib

COPY --from=node-builder /usr/local/bin /usr/local/bin
COPY --from=node-builder /usr/local/lib /usr/local/lib

COPY --from=ruby-builder /usr/local/bin /usr/local/bin
COPY --from=ruby-builder /usr/local/lib /usr/local/lib

COPY --from=java-builder /opt/java /opt/java
ENV PATH="/opt/java/openjdk/bin:$PATH"

COPY --from=go-builder /usr/local/go /usr/local/go
ENV PATH="/usr/local/go/bin:$PATH"

COPY --from=racket-builder /usr/bin/racket /usr/bin/racket
COPY --from=racket-builder /usr/share/racket/collects /usr/share/racket/collects
ENV PATH="/usr/bin:$PATH"

COPY --from=perl-builder /usr/local/bin/perl /usr/local/bin/perl
COPY --from=perl-builder /usr/local/lib/perl5 /usr/local/lib/perl5
ENV PATH="/usr/local/bin:$PATH"
