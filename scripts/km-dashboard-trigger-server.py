#!/usr/bin/env python3
import json
import os
import subprocess
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HOST = os.environ.get("KM_TRIGGER_HOST", "127.0.0.1")
PORT = int(os.environ.get("KM_TRIGGER_PORT", "8791"))
TOKEN_FILE = os.environ.get("KM_TRIGGER_TOKEN_FILE", "/opt/km-dashboard/.km-trigger-token")
DEPLOY_SERVICE = os.environ.get("KM_DEPLOY_SERVICE", "km-dashboard-deploy.service")
INGEST_SERVICE = os.environ.get("KM_INGEST_SERVICE", "km-raindrop-ingest.service")


def load_token():
    try:
        with open(TOKEN_FILE, "r", encoding="utf-8") as handle:
            return handle.read().strip()
    except FileNotFoundError:
        return ""


class Handler(BaseHTTPRequestHandler):
    server_version = "KMTrigger/1.0"

    def log_message(self, fmt, *args):
        return

    def send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path != "/health":
            self.send_json(404, {"ok": False, "error": "not_found"})
            return
        self.send_json(200, {"ok": True, "deploy_service": DEPLOY_SERVICE, "ingest_service": INGEST_SERVICE})

    def do_POST(self):
        services = {
            "/deploy": DEPLOY_SERVICE,
            "/ingest": INGEST_SERVICE,
        }
        service = services.get(self.path)
        if service is None:
            self.send_json(404, {"ok": False, "error": "not_found"})
            return
        expected = load_token()
        received = self.headers.get("X-KM-Token", "")
        if not expected or received != expected:
            self.send_json(403, {"ok": False, "error": "forbidden"})
            return
        result = subprocess.run(
            ["systemctl", "start", service],
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            timeout=120,
        )
        self.send_json(
            200 if result.returncode == 0 else 500,
            {
                "ok": result.returncode == 0,
                "service": service,
                "returncode": result.returncode,
                "stdout": result.stdout[-2000:],
                "stderr": result.stderr[-2000:],
            },
        )


if __name__ == "__main__":
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
