# Base image
FROM node:20.0.0-alpine

# Set working directory
WORKDIR /app

# Copy remaining app files
COPY . .

# Install Node.js dependencies
RUN yarn install

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV PYTHON_PATH=/usr/bin/python3

# Install Python and pip
RUN apk update && \
    apk add --no-cache python3 && \
    apk add --no-cache --virtual .build-deps \
        python3-dev \
        musl-dev \
        gcc \
        git \
        g++ && \
    python3 -m ensurepip && \
    rm -r /usr/lib/python*/ensurepip && \
    pip3 install --no-cache --upgrade pip setuptools && \
    if [ ! -e /usr/bin/pip ]; then ln -s pip3 /usr/bin/pip ; fi && \
    if [[ ! -e /usr/bin/python ]]; then ln -sf /usr/bin/python3 /usr/bin/python; fi

# Install Python dependencies

RUN pip3 install -e ./roles_royce && \
    pip3 install -r requirements.txt 
    
# RUN pip3 install -r requirements.txt
# COPY test.py ./roles_royce

# Remove build dependencies
RUN apk del .build-deps

# Expose port
EXPOSE 3000

# Start the app
CMD [ "yarn", "dev" ]
