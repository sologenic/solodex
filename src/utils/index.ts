import { post } from "axios";
import dayjs from "dayjs";
import { ConnectionResponse } from "../types/index";

interface ConnectionOptions {
  pushToken?: string;
  expiry: number;
}

export const getConnectionRefs = async (
  tx: any,
  options: ConnectionOptions
): Promise<ConnectionResponse> => {
  try {
    const url = "https://api.sologenic.org/api/v1";

    const axiosResponse = await post(
      url + "/issuer/transactions",
      {
        tx_json: tx,
        options: {
          expires_at: dayjs().add(options.expiry, "s").toISOString(),
          submit: false,
          ...(options.pushToken ? { push_token: options.pushToken } : {}),
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
