interface Channel {
  id: string
  owner: string // id of admin
  password: string
  users: string[] // list of ids
  createdDate: Date
  lastUpdated: Date
  members: any[]
}

interface CreateChannelDto {
  // no owner specified, will be deduced from the JWT auth token
  name: string
  isPublic: boolean
  password: string
}

export { Channel, CreateChannelDto }
