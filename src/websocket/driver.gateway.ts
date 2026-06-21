import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DriverGateway
  implements
    OnGatewayConnection,
    OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private connectedDrivers =
    new Map<string, string>();

  handleConnection(
    client: Socket,
  ) {
    console.log(
      `Connected: ${client.id}`,
    );
  }

  handleDisconnect(
    client: Socket,
  ) {

    for (const [
      driverId,
      socketId,
    ] of this.connectedDrivers) {

      if (socketId === client.id) {

        this.connectedDrivers.delete(
          driverId,
        );

        break;
      }
    }

    console.log(
      `Disconnected: ${client.id}`,
    );
  }

  @SubscribeMessage(
    'register-driver',
  )
  registerDriver(
    @MessageBody()
    driverId: string,

    @ConnectedSocket()
    client: Socket,
  ) {

    this.connectedDrivers.set(
      driverId,
      client.id,
    );

    return {
      success: true,
    };
  }

  notifyDrivers(
    driverIds: string[],
    rideId: string,
  ) {

    for (const driverId of driverIds) {

      const socketId =
        this.connectedDrivers.get(
          driverId,
        );

      if (!socketId) continue;

      this.server
        .to(socketId)
        .emit(
          'ride-request',
          {
            rideId,
          },
        );
    }
  }
}