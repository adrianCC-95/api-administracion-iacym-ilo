import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { envConfig } from '../../config/env/env.config';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: envConfig().allowedDomains } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private clients = new Map<string, Socket>();

    handleConnection(client: Socket) {
        this.clients.set(client.id, client);

        client.on('joinDevice', async (biometricDeviceId: string) => {
            if (biometricDeviceId) {
                await client.join(biometricDeviceId);
            }
        });
    }

    handleDisconnect(client: Socket) {
        this.clients.delete(client.id);
    }

    // emitToDevice(biometricDeviceId: string, event: string, payload: any) {
    //     if (!this.server) return;
    //     this.server.to(biometricDeviceId).emit(event, payload);
    // }
    async emitToDevice(biometricDeviceId: string, event: string, payload: any): Promise<any> {
        return new Promise((resolve) => {
            if (!this.server) throw new Error('Socket server not initialized');

            const room = this.server.sockets.adapter.rooms.get(biometricDeviceId);
            if (!room || room.size === 0)
                throw new Error(`No client connected for device biometric ID: ${biometricDeviceId} `);

            const [socketId] = Array.from(room);
            const socket = this.server.sockets.sockets.get(socketId);
            if (!socket) throw new Error(`Socket not found for device ${biometricDeviceId}`);

            const requestId = `${biometricDeviceId}-${Date.now()}`;
            const responseEvent = `${event}_RESPONSE_${requestId}`;

            const timeoutMs = 20_000;
            const timer = setTimeout(() => {
                socket.off(responseEvent, handler);
                throw new Error(
                    `No response from device ${biometricDeviceId}, : Hubo un problema con la conexion del biometrico,tiempo de espera agotado y/o no responde a lo soclicitado!`,
                );
            }, timeoutMs);

            const handler = (data: any) => {
                clearTimeout(timer);
                socket.off(responseEvent, handler);
                resolve(data);
            };

            socket.once(responseEvent, (data) => {
                clearTimeout(timer);
                resolve(data);
            });

            socket.emit(event, { ...payload, requestId });
        });
    }

    emitToAll(event: string, payload: any) {
        if (!this.server) return;
        this.server.emit(event, payload);
    }
}
