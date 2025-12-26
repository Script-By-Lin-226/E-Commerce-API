#!/usr/bin/env python3
import os
import http.server
import socketserver
from pathlib import Path

# Get PORT from environment variable or default to 3000
port = int(os.getenv("PORT", 3000))

# Get the directory where this script is located
script_dir = Path(__file__).parent
dist_dir = script_dir / "dist"

# Change to dist directory
os.chdir(dist_dir)

# Add SPA routing support - serve index.html for all routes
class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def do_GET(self):
        # Remove query string for path checking
        path = self.path.split('?')[0]
        
        # If it's a file that exists, serve it
        file_path = Path(path.lstrip('/'))
        if path != '/' and file_path.exists() and file_path.is_file():
            return super().do_GET()
        
        # For API routes or non-existent files, serve index.html for SPA routing
        self.path = '/index.html'
        return super().do_GET()

# Start server
with socketserver.TCPServer(("", port), SPAHandler) as httpd:
    print(f"Server running on port {port}")
    print(f"Serving from {dist_dir}")
    httpd.serve_forever()

