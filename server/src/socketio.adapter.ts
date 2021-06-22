import { INestApplicationContext } from '@nestjs/common'
import { isFunction, isNil } from '@nestjs/common/utils/shared.utils'
import { AbstractWsAdapter, MessageMappingProperties } from '@nestjs/websockets'
import { DISCONNECT_EVENT } from '@nestjs/websockets/constants'
import { fromEvent, Observable } from 'rxjs'
import { filter, first, map, mergeMap, share, takeUntil } from 'rxjs/operators'
import { Namespace, Server } from 'socket.io'
// import { Adapter } from 'socket.io-adapter'

export class SocketIOAdapter extends AbstractWsAdapter {
  constructor(
    appOrHttpServer?: INestApplicationContext | any,
    private readonly corsOrigins = [],
  ) {
    super(appOrHttpServer)
  }

  public create(
    port: number,
    options?: { namespace?: string; server?: Server; adapter?: any },
  ): any {
    if (!options) {
      return this.createIOServer(port)
    }
    let { namespace, server, adapter, ...opt } = options

    let serv: Server = server || this.createIOServer(port, opt)

    if (adapter) serv.adapter(adapter)

    let srv: Server | Namespace = serv
    if (namespace)
      srv = serv.of(namespace)

    return srv
  }

  public createIOServer(port: number, options?: any) {
    if (this.httpServer && port === 0) {
      const s = new Server(this.httpServer, {
        cors: {
          origin: this.corsOrigins,
          methods: ['GET', 'POST'],
          credentials: true,
        },
        cookie: {
          //   name: 'io',
          httpOnly: true,
          path: '/',
        },
        // Allow 1MB of data per request.
        maxHttpBufferSize: 1e6,
      })

      return s
    }
    return new Server(port, options)
  }

  public bindMessageHandlers(
    client: any,
    handlers: MessageMappingProperties[],
    transform: (data: any) => Observable<any>,
  ) {
    const disconnect$ = fromEvent(client, DISCONNECT_EVENT).pipe(
      share(),
      first(),
    )

    handlers.forEach(({ message, callback }) => {
      const source$ = fromEvent(client, message).pipe(
        mergeMap((payload: any) => {
          const { data, ack } = this.mapPayload(payload)
          return transform(callback(data, ack)).pipe(
            filter((response: any) => !isNil(response)),
            map((response: any) => [response, ack]),
          )
        }),
        takeUntil(disconnect$),
      )
      source$.subscribe(([response, ack]) => {
        if (response.event) {
          return client.emit(response.event, response.data)
        }
        isFunction(ack) && ack(response)
      })
    })
  }

  public mapPayload(payload: any): { data: any; ack?: Function } {
    if (!Array.isArray(payload)) {
      return { data: payload }
    }
    const lastElement = payload[payload.length - 1]
    const isAck = isFunction(lastElement)
    if (isAck) {
      const size = payload.length - 1
      return {
        data: size === 1 ? payload[0] : payload.slice(0, size),
        ack: lastElement,
      }
    }
    return { data: payload }
  }
}
