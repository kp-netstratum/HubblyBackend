FROM node:20.18.3

WORKDIR /app

# Install Python and pip to support cqlsh
RUN apt-get update && apt-get install -y python3-pip python3-venv && \
    python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install cqlsh

# Add the virtual environment to PATH
ENV PATH="/opt/venv/bin:$PATH"

# Copy package files first for better cache
COPY package.json yarn.lock ./
RUN yarn install

# Copy rest of the app
COPY . .

# Copy the wait script
COPY wait-for-cassandra.sh .

# Make it executable
RUN chmod +x wait-for-cassandra.sh

EXPOSE 3000

CMD ["sh", "./wait-for-cassandra.sh"]
