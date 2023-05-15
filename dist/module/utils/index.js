import dayjs from "dayjs";
import axios from "axios";
export const getConnectionRefs = async (tx, options) => {
    try {
        const url = "https://api.sologenic.org/api/v1";
        const axiosResponse = await axios.post(url + "/issuer/transactions", {
            tx_json: tx,
            options: {
                expires_at: dayjs().add(options.expiry, "s").toISOString(),
                submit: false,
                ...(options.pushToken ? { push_token: options.pushToken } : {}),
            },
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: options.api_key,
            },
        });
        if (axiosResponse.status !== 200)
            throw {
                thrower: "getConnectionRefs",
                error: axiosResponse,
            };
        axiosResponse.data.refs.deeplink = `https://solodex.page.link/?link=${axiosResponse.data.refs.deeplink}&apn=com.sologenicwallet&isi=1497396455&ibi=org.reactjs.native.example.SologenicWallet`;
        return axiosResponse.data;
    }
    catch (e) {
        console.log(e);
        throw {
            thrower: "getConnectionRefs",
            error: e,
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBRTFCLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQU8xQixNQUFNLENBQUMsTUFBTSxpQkFBaUIsR0FBRyxLQUFLLEVBQ3BDLEVBQU8sRUFDUCxPQUEwQixFQUNHLEVBQUU7SUFDL0IsSUFBSTtRQUNGLE1BQU0sR0FBRyxHQUFHLGtDQUFrQyxDQUFDO1FBRS9DLE1BQU0sYUFBYSxHQUFHLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FDcEMsR0FBRyxHQUFHLHNCQUFzQixFQUM1QjtZQUNFLE9BQU8sRUFBRSxFQUFFO1lBQ1gsT0FBTyxFQUFFO2dCQUNQLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUU7Z0JBQzFELE1BQU0sRUFBRSxLQUFLO2dCQUNiLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzthQUNoRTtTQUNGLEVBQ0Q7WUFDRSxPQUFPLEVBQUU7Z0JBQ1AsY0FBYyxFQUFFLGtCQUFrQjtnQkFDbEMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxPQUFPO2FBQy9CO1NBQ0YsQ0FDRixDQUFDO1FBRUYsSUFBSSxhQUFhLENBQUMsTUFBTSxLQUFLLEdBQUc7WUFDOUIsTUFBTTtnQkFDSixPQUFPLEVBQUUsbUJBQW1CO2dCQUM1QixLQUFLLEVBQUUsYUFBYTthQUNyQixDQUFDO1FBRUosYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLG1DQUFtQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLHdGQUF3RixDQUFDO1FBRS9MLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQztLQUMzQjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVmLE1BQU07WUFDSixPQUFPLEVBQUUsbUJBQW1CO1lBQzVCLEtBQUssRUFBRSxDQUFDO1NBQ1QsQ0FBQztLQUNIO0FBQ0gsQ0FBQyxDQUFDIn0=