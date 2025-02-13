import dayjs from "dayjs";
import { ConnectionResponse } from "../types/index";
import axios from "axios";
interface ConnectionOptions {
  pushToken?: string;
  expiry: number;
  api_key?: string;
  custom_endpoint?: string;
}

export const url = "https://api.sologenic.org/api/v1";

export const getConnectionRefs = async (
  tx: any,
  options: ConnectionOptions
): Promise<ConnectionResponse> => {
  try {
    const endpoint = options.custom_endpoint || url;

    const axiosResponse = await axios.post(
      endpoint + "/issuer/transactions",
      {
        tx_json: tx,
        options: {
          expires_at: dayjs().add(options.expiry, "ms").toISOString(),
          submit: false,
          ...(options.pushToken ? { push_token: options.pushToken } : {}),
          ...(options.api_key ? { api_key: options.api_key } : {}),
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (axiosResponse.status !== 200)
      throw {
        thrower: "getConnectionRefs",
        error: axiosResponse,
      };

    axiosResponse.data.refs.deeplink = `https://solodex.page.link/?link=${axiosResponse.data.refs.deeplink}&apn=com.sologenicwallet&isi=1497396455&ibi=org.reactjs.native.example.SologenicWallet`;

    return axiosResponse.data;
  } catch (e) {
    console.log(e);

    throw {
      thrower: "getConnectionRefs",
      error: e,
    };
  }
};
