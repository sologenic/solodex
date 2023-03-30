import axios from "axios";
import EventEmitter from "events";
import { getConnectionRefs } from "./utils/index";
import {
  ConnectionResponse,
  States,
  Transaction,
  SigningMeta,
} from "./types/index";

var ws = WebSocket;

if (ws === undefined) ws = require("ws");

interface SOLODEXProps {
  sign_expiry?: number;
}

class SOLODEX extends EventEmitter {
  #sign_expiry: number = 600_000;
  #push_token: string | undefined;

  constructor(props?: SOLODEXProps) {
    super();
    if (props?.sign_expiry) this.#sign_expiry = props.sign_expiry;
  }

  setPushToken(token: string) {
    this.#push_token = token;
  }

  async signIn() {
    try {
      const tx_json = {
        TransactionType: "NicknameSet",
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
        expiry: this.#sign_expiry,
        pushToken: this.#push_token,
      });

      this.#monitorConnection(connection);

      return {
        identifier: connection.meta.identifier,
        expires_at: connection.meta.expires_at,
        refs: {
          deeplink: connection.refs.deeplink,
          qr: connection.refs.qr,
        },
        tx,
      };
    } catch (e: any) {
      console.log("EEEEE", e);
      throw {
        thrower: e.thrower || "sign",
        error: e,
      };
    }
  }

  async #monitorConnection(connection: ConnectionResponse) {
    try {
      let ping: ReturnType<typeof setInterval>;
      let eventsEmitted: string[] = [];

      const connectionWS = new WebSocket(connection.refs.ws as string);

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
                  url: `https://api.sologenic.org/api/v1/issuer/transactions/${msg.meta.identifier}`,
                });

                this.#push_token = msg.meta.push_token;

                this.emit(States.SIGNED, msg.meta.identifier, {
                  signer: signedTX.data.signer,
                  tx: connection.tx_json,
                  push_token: msg.meta.push_token,
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
