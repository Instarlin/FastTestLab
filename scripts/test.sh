#!/bin/bash

set -e

echo "🚀 Starting..."

if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm i
fi

# Функция для проверки, запущен ли dev сервер
check_dev_server() {
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

wait_for_server() {
    echo "⏳ Waiting for server to be ready..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if check_dev_server; then
            echo "✅ Server is ready!"
            return 0
        fi
        
        echo "⏳ Attempt $attempt/$max_attempts: Server not ready yet..."
        sleep 1
        attempt=$((attempt + 1))
    done
    
    echo "❌ Server failed to start after $max_attempts attempts"
    return 1
}

if check_dev_server; then
    echo "✅ Dev server is already running on port 3000"
    echo "🧪 Running tests against existing server..."
    npm run test:dev
else
    echo "🚀 Dev server is not running, starting it with tests..."
    echo "🧹 Cleaning up any existing processes..."
    pkill -f "react-router dev" || true
    pkill -f "vitest" || true

    if npm run docker:dev; then
        echo "✅ Dev server started"
    else
        echo "❌ Dev server failed to start"
        exit 1
    fi
    
    if npm run test; then
        echo "✅ Tests completed successfully!"
    else
        echo "❌ Tests failed or server failed to start"
    fi
fi
