# Stage 1: Python dependencies
FROM python:3.13-alpine AS pybuilder

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt


# Stage 2: Node.js dependencies
FROM node:22-alpine AS jsbuild

WORKDIR /usr/src/app

# Install Python runtime and dependencies from pybuilder
RUN apk add --no-cache python3-dev py3-pip

# Copy Python runtime files
COPY --from=pybuilder /usr/local/lib /usr/local/lib
COPY --from=pybuilder /usr/local/bin /usr/local/bin
COPY --from=pybuilder /usr/lib /usr/lib

# Copy application files
COPY . .

# Install Node.js dependencies
COPY package*.json ./
RUN npm install
