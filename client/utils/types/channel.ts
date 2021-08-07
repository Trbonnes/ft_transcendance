interface Channel {
  id: string
  password: string
  name: string
  isPublic: boolean
  isSticky: boolean
  createdDate: Date
  lastUpdated: Date
  members: any[]
  // messages: Messages[]
}

interface CreateChannelDto {
  // no owner specified, will be deduced from the JWT auth token
  channelName: string
  isPublic: boolean
  channelPassword: string
}

export { Channel, CreateChannelDto }
