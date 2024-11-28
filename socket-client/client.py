import socketio
import signal
import sys
import os
import time
import json
from command_handler import CommandHandler
from dotenv import load_dotenv

# Set environment variables
load_dotenv()
APP_ENV = os.getenv("APP_ENV", "production")
APP_HOST = os.getenv("APP_HOST", "http://localhost")
APP_PORT = os.getenv("APP_PORT", 4113)
DEBUG = os.getenv("DEBUG", "False").lower() == "true"


# Set up socket.io connection and handling
sio = socketio.Client()
command_handler = CommandHandler(sio)
init_connection_established = False

@sio.event
def connect():
    sio.emit('rc.join')
    print('Connected to server')

@sio.on('rc.data')
def rc_data(data):
    if DEBUG: print('DEBUG:', data)

@sio.on('rc.command')
def rc_command(data):
    if DEBUG: print('DEBUG:', data)
    parsed_data = json.loads(data)
    command_handler.run(parsed_data[command], parsed_data[arguments])

@sio.event
def disconnect():
    print('Disconnected from server')

@sio.event
def connect_error(err):
    if init_connection_established: print('Connection error:', err)

def cleanup():
    sio.disconnect()


# Set up signal interrupts
def signal_handler(sig, frame):
    cleanup()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)


# Establish connection
print(f'Connecting to {APP_HOST}:{APP_PORT}...')
while not init_connection_established:
    try:
        sio.connect(f'{APP_HOST}:{APP_PORT}')
        init_connection_established = True
        sio.wait()
    except Exception as e:
        print('Failed to establish connection to server:', e)
        time.sleep(5)