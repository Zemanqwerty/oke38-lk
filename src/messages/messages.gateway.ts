import { InjectRepository } from '@nestjs/typeorm';
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ApplicationsService } from 'src/applications/applications.service';
import { ChatService } from 'src/chat/chat.service';
import { MessagesService } from 'src/messages/messages.service';
import { Role } from 'src/roles/roles.enum';
import { Message } from './messages.entity';
import { Repository } from "typeorm";
import { ResponseMessages } from 'src/dtos/messages/ResponseMessages.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private applicationService: ApplicationsService,
    private chatService: ChatService,
    // private messageService: MessagesService,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {};

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('Init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    console.log(`user ${client.id} connected to ${room}`);
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string) {
    client.leave(room);
    client.emit('leftRoom', room);
  }

  // @SubscribeMessage('message')
  // handleMessage(client: Socket, message: any) {
  //   console.log('----');
  //   console.log(message);
  //   console.log(message.room);
  //   console.log('----');
  //   this.createMessage(message.message, message.userRole, message.user, parseInt(message.room))
  //   this.server.to(message.room).emit('message', message);
  // }

  // sendFileMessage(room: string, message: ResponseMessages) {
  //   this.server.to(room).emit('message', message); 
  // }

  // async createMessage(message: string, userRole: Role, user: string, chatId: number) {
  //     const chat = await this.chatService.getChatById(chatId);

  //     if (!chat) {
  //         await this.applicationService.getApplicationById(chatId).then((application) => {
  //             this.chatService.createChat(application);
  //         })
  //     }

  //     const newMessage = this.messageRepository.create({
  //         messageText: message,
  //         senderRole: userRole,
  //         sender: user,
  //         chat: chat,
  //     });

  //     return await this.messageRepository.save(newMessage);
  // }
}