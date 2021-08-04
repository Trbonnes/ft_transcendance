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
  users: string[] // list of ids
  owner: string // id of admin
}

export { Channel, CreateChannelDto }
