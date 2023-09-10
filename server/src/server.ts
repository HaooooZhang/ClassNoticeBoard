import WebSocket from 'ws';
import logger from "./utils/logger";
import * as crypto from "crypto";

function startServer(port: number) {
  let clients: Map<string, {
    ws: WebSocket,
    nickname: string,
    chats: string[]
  }> = new Map();

  const wss = new WebSocket.Server({port: port});
  logger.info(`Server started on port ${port}`)

  wss.on('connection', function connection(ws) {
    const uuid = crypto.randomUUID()

    clients.set(uuid, {
      ws: ws,
      nickname: 'Anonymous',
      chats: []
    })
    logger.info(`Client ${uuid} connected. Total clients: ${clients.size}`)

    ws.on('message', (message: string) => {
      const data: {
        type: string,
        nickname?: string,
        chat?: string,
        chats?: string[],
        content?: string
      } = JSON.parse(message)
      switch (data.type) {
        case 'setNickname':
          clients.get(uuid).nickname = data.nickname
          logger.info(`Client ${uuid} set nickname to "${data.nickname}"`)
          break;
        case 'joinChat':
          clients.get(uuid).chats.push(data.chat)
          logger.info(`Client ${uuid} joined chat "${data.chat}"`)
          break;
        case 'setChats':
          clients.get(uuid).chats = data.chats
          logger.info(`Client ${uuid} set chats to "${data.chats}"`)
          break;
        case 'leaveChat':
          clients.get(uuid).chats = clients.get(uuid).chats.filter(chat => chat !== data.chat)
          logger.info(`Client ${uuid} left chat "${data.chat}"`)
          break;
        case 'message':
          logger.info(`Client ${uuid} sent message to chat "${data.chat}"`)
          clients.forEach((client, id) => {
            if (client.chats.includes(data.chat) && id !== uuid) {
              client.ws.send(JSON.stringify({
                chat: data.chat,
                message: {
                  sender: clients.get(uuid).nickname,
                  content: data.content,
                  time: Date.now()
                }
              }))
            }
          })
          break;
      }
    });

    ws.on('close', () => {
      clients.delete(uuid)
      logger.info(`Client ${uuid} disconnected. Total clients: ${clients.size}`)
    });
  })
}

export default startServer;