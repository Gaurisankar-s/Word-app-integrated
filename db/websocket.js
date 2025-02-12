const WebSocket = require('ws');

const setupWebSocket = (server) => {
    const wss = new WebSocket.Server({ noServer: true });
    const connections = new Map();

    wss.on("connection", (ws, email) => {
        console.log(`WebSocket connected for user: ${email}`);
        connections.set(email, ws);

        ws.on("close", () => {
            console.log(`WebSocket closed for user: ${email}`);
            connections.delete(email);
        });
    });

    // Handle upgrade
    server.on("upgrade", (request, socket, head) => {
        const url = new URL(request.url, `http://${request.headers.host}`);
        const email = url.searchParams.get("email");

        if (!email) {
            socket.destroy();
            return;
        }

        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit("connection", ws, email);
        });
    });

    return { wss, connections };
};

module.exports = setupWebSocket; 