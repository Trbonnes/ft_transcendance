// MIght add type check from vuex and vuex-decorator

function createWebSocketPlugin(store : any) {
    console.log("Before mutation")
    console.log(store)
    store.subscribe((mutation : any) => {
      if (mutation.type == "chat/pushChannel")
      {
        console.log("Registered a mutation")
        console.log(mutation)
      }
    })
}

export default createWebSocketPlugin
