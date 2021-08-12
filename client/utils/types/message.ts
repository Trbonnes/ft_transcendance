interface Message {
  id: string
  channelId: string
  senderId: string
  content: string
}

interface ChannelMessageDto {
  // message that will be sent
  channelId: string
  content: string
}

export { ChannelMessageDto, Message }
