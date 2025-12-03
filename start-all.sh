#!/bin/bash

echo "🚀 Starting Saqtau Platform..."

# Function to check if port is in use
check_port() {
    lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null
}

# Function to kill process on port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo "🔄 Killing process on port $port (PID: $pid)"
        kill $pid
        sleep 2
    fi
}

# Clean up any existing processes
echo "🧹 Cleaning up existing processes..."
kill_port 3001  # Backend
kill_port 8080  # Frontend

echo "📦 Installing dependencies..."

# Install backend dependencies
echo "⚡ Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies (already done)
echo "⚡ Frontend dependencies already installed"

echo "🏃 Starting services..."

# Start backend in background
echo "🔧 Starting backend server..."
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Check if backend is running
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend started successfully on http://localhost:3001"
else
    echo "❌ Backend failed to start. Check logs/backend.log"
    exit 1
fi

# Start frontend in background
echo "🌐 Starting frontend server..."
npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 5

# Check if frontend is running (simplified check)
if ps -p $FRONTEND_PID > /dev/null 2>&1; then
    echo "✅ Frontend started successfully on http://localhost:8080"
else
    echo "❌ Frontend failed to start. Check logs/frontend.log"
fi

echo ""
echo "🎉 Saqtau Platform is running!"
echo ""
echo "📱 Applications:"
echo "   🌐 Web App:     http://localhost:8080"
echo "   ⚡ Backend API: http://localhost:3001"
echo "   📱 Mobile:      cd mobile_flutter && flutter run"
echo ""
echo "🧪 Testing:"
echo "   🖥️  Open test-interface.html in browser"
echo "   📖 See LOGIN_INSTRUCTIONS.md for test accounts"
echo ""
echo "🔑 Test Credentials:"
echo "   👤 Buyer:  buyer@example.com / password123"
echo "   🏪 Seller: seller@saqtau.kz / seller123"
echo "   ⚙️ Admin:  admin@saqtau.kz / admin123"
echo ""
echo "🛑 To stop all services:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "📝 Backend PID: $BACKEND_PID"
echo "📝 Frontend PID: $FRONTEND_PID"

# Create logs directory if it doesn't exist
mkdir -p logs

# Keep script running to show logs
echo ""
echo "📋 Showing backend logs (Ctrl+C to exit)..."
tail -f logs/backend.log
