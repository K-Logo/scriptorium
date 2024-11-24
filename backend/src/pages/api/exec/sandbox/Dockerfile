FROM python:3.13-alpine AS pybuilder

WORKDIR /usr/src/app

RUN apk add --no-cache gcc g++ musl-dev libffi-dev openjdk17 ruby racket R go php perl

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt


FROM node:22-alpine AS jsbuild

WORKDIR /usr/src/app

RUN apk add --no-cache python3 py3-pip gcc g++ musl-dev libffi-dev openjdk17 ruby racket R go php perl

COPY --from=pybuilder /usr/local/lib /usr/local/lib
COPY --from=pybuilder /usr/local/bin /usr/local/bin
COPY --from=pybuilder /usr/lib /usr/lib

COPY package*.json ./

RUN npm install

COPY . . 
