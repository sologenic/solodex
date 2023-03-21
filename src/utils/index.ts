import axios from "axios";
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
  const url = "https://api.sologenic.org/api/v1/issuer/transactions";

  const axiosResponse = await axios({
    url,
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      tx_json: tx,
      options: {
        expires_at: dayjs().add(options.expiry, "s").toISOString(),
        submit: false,
        ...(options.pushToken ? { push_token: options.pushToken } : {}),
      },
    }),
  });

  if (axiosResponse.status !== 200)
    throw {
      thrower: "getConnectionRefs",
      error: axiosResponse,
    };

  axiosResponse.data.refs.deeplink = `https://solodex.page.link/?link=${axiosResponse.data.refs.deeplink}&apn=com.sologenicwallet&isi=1497396455&ibi=org.reactjs.native.example.SologenicWallet`;

  return axiosResponse.data;
};
