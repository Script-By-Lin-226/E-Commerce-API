import datetime
import json , os
from json import JSONDecodeError
from app.config.config import settings
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import time
import logging

LOG_FILE = "./logs/E_Commerce_LOGS.json"

def load_json(path):
    try:
        with open(path, "r") as f:
            return json.load(f)
    except (FileNotFoundError, JSONDecodeError):
        return {"Logs" : []}


def save(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=4)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("E-Commerce API - Logging")

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = round(time.time() - start_time, 4)
        data = load_json(LOG_FILE)
        response_code = ""
        if response.status_code == 200:
            response_code = f"{response.status_code} OK"
        elif response.status_code == 404:
            response_code = f"{response.status_code} NOT FOUND"


        log_entry = {
            "Ip": request.client.host,
            "Port": request.client.port,
            "Method": request.method,
            "Status": response_code,
            "Process Time": f"{process_time} seconds",
            "Time": f"{datetime.datetime.now().strftime('%c')}"
        }
        data["Logs"].append(log_entry)
        save(LOG_FILE, data)
        logger.info(f"{request.client.host}:{request.client.port} - {request.method} - {response.status_code} - {process_time}")


        return response

