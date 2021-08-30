

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

interface Channel {
  id: string
  name: string
  isPublic: boolean
  isSticky: boolean
  createdDate: Date
  lastUpdated: Date
  members: any[]
  messages: Message[]
}

interface CreateChannelDto {
  // no owner specified, will be deduced from the JWT auth token
  channelName: string
  isPublic: boolean
  channelPassword: string
}

export { ChannelMessageDto, Message, Channel, CreateChannelDto }
