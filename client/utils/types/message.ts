interface Message {
  sender: string
}

interface ChannelMessageDto {
  // message that will be sent
  channelId: string
  content: string
}

export { ChannelMessageDto }
