import axios from "axios";
import EventEmitter from "events";
import { getConnectionRefs, url } from "./utils";
import { ConnectionResponse, States, Transaction, SigningMeta } from "./types";

const Websocket = WebSocket || require("ws");

interface SOLODEXProps {
  sign_expiry?: number;
  api_key?: string;
}

class SOLODEX extends EventEmitter {
  private _sign_expiry: number = 600_000;
  private _push_token: string | undefined;
  private _api_key: string | undefined;

  constructor(props: SOLODEXProps) {
    super();

    if (props?.sign_expiry) this._sign_expiry = props.sign_expiry;

    if (props?.api_key) this._api_key = props.api_key;
  }

  setPushToken(token: string) {
    this._push_token = token;
  }

  async signIn() {
    try {
      const tx_json = {
        TransactionType: "NickNameSet",
        TransactionKind: "SignIn",
      };

      return await this.signTransaction(tx_json);
    } catch (e) {
      throw {
        thrower: "signIn",
        error: e,
      };
    }
  }

  async signTransaction(tx: Transaction): Promise<SigningMeta> {
    try {
      const connection = await getConnectionRefs(tx, {
        expiry: this._sign_expiry,
        pushToken: this._push_token, // On SignIn this is undefined
        api_key: this._api_key,
      });

      this._monitorConnection(connection);

      return {
        identifier: connection.meta.identifier,
        expires_at: connection.meta.expires_at,
        refs: {
          deeplink: connection.refs.deeplink,
          qr: connection.refs.qr,
          ws: connection.refs.ws,
        },
        tx,
      };
    } catch (e: any) {
      throw {
        thrower: e.thrower || "sign",
        error: e,
      };
    }
  }

  private async _monitorConnection(connection: ConnectionResponse) {
    try {
      let ping: ReturnType<typeof setInterval>;
      let eventsEmitted: string[] = [];

      const connectionWS = new Websocket(connection.refs.ws as string);

      connectionWS.onerror = (error: any) => {
        throw {
          thrower: "WS Monitor connection",
          error: error,
        };
      };
      connectionWS.addEventListener("open", () => {
        console.log(
          `Connection to WS for ${connection.meta.identifier} initialized`
        );
        ping = setInterval(() => {
          connectionWS.send("ping");
        }, 5000);
      });
      connectionWS.addEventListener("message", async (message: any) => {
        if (message.data === "pong") return;

        const msg = JSON.parse(message.data);

        if (msg.meta.hasOwnProperty("identifier")) {
          Object.entries(msg.meta).map(async (entry) => {
            if (entry[1] === true && !eventsEmitted.includes(entry[0])) {
              if (entry[0] === States.SIGNED) {
                const signedTX = await axios({
                  method: "get",
                  url: `${url}/issuer/transactions/${msg.meta.identifier}`,
                });

                this._push_token = msg.meta.push_token;

                this.emit(States.SIGNED, msg.meta.identifier, {
                  signer: signedTX.data.signer,
                  tx: connection.tx_json,
                  push_token: msg.meta.push_token,
                  tx_blob: signedTX.data.tx_hex,
                });
              } else {
                this.emit(entry[0], msg.meta.identifier);
                eventsEmitted.push(entry[0]);
              }

              if (
                [States.SIGNED, States.CANCELLED, States.EXPIRED].includes(
                  entry[0] as States
                )
              ) {
                connectionWS.close();
                clearInterval(ping);
              }
            }
          });
        }
      });
    } catch (e: any) {
      throw {
        thrower: e.thrower || "monitorConnection",
        error: e,
      };
    }
  }
}

export default SOLODEX;
