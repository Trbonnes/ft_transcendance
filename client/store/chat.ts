import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Channel } from '~/utils/types'
import Vuex from 'vuex'
import * as createWebSocket from '~/store/plugins/websocket.js'

@Module({namespaced : true})
export default class ChatModule extends VuexModule {

  channels: Channel[] = [ {id : "1", users :["Bob", "Sophie"], name: "", admin: "Bob", messages :[{sender : "Bob", content : "Hello"}]}];
  // list of all the availble channels, TODO truncate to like the first 20 if there's too much of 'em
  
  @Action({rawError : true})
  createChannel(newChannel : Channel)
  {
      console.log("Action called")
       this.context.commit("pushChannel", newChannel) 
  }

  get getAll()
  {
    return this.channels;
  }

  @Action
  deleteChannel(id : string) // takes the id of the channel
  {
    // should make a remote api call, this is just for mock for now
    for (let i = 0; i < this.channels.length; i++)
    {
      if (this.channels[i].id == id)
      {
        this.channels.splice(i,1)
        break;
      }
    }
  }

  @Mutation
  pushChannel(newChannel : Channel) {
    console.log("Mutation called")
    this.channels.push(newChannel);
  }
}
