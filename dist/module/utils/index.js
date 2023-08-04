import dayjs from "dayjs";
import axios from "axios";
export const url = "https://api.test.sologenic.org/api/v1";
export const getConnectionRefs = async (tx, options) => {
    try {
        const axiosResponse = await axios.post(url + "/issuer/transactions", {
            tx_json: tx,
            options: {
                expires_at: dayjs().add(options.expiry, "ms").toISOString(),
                submit: false,
                ...(options.pushToken ? { push_token: options.pushToken } : {}),
                ...(options.api_key ? { api_key: options.api_key } : {}),
            },
        }, {
            headers: {
                "Content-Type": "application/json",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBRTFCLE9BQU8sS0FBSyxNQUFNLE9BQU8sQ0FBQztBQU8xQixNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsdUNBQXVDLENBQUM7QUFFM0QsTUFBTSxDQUFDLE1BQU0saUJBQWlCLEdBQUcsS0FBSyxFQUNwQyxFQUFPLEVBQ1AsT0FBMEIsRUFDRyxFQUFFO0lBQy9CLElBQUk7UUFDRixNQUFNLGFBQWEsR0FBRyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQ3BDLEdBQUcsR0FBRyxzQkFBc0IsRUFDNUI7WUFDRSxPQUFPLEVBQUUsRUFBRTtZQUNYLE9BQU8sRUFBRTtnQkFDUCxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFO2dCQUMzRCxNQUFNLEVBQUUsS0FBSztnQkFDYixHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQy9ELEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQzthQUN6RDtTQUNGLEVBQ0Q7WUFDRSxPQUFPLEVBQUU7Z0JBQ1AsY0FBYyxFQUFFLGtCQUFrQjthQUNuQztTQUNGLENBQ0YsQ0FBQztRQUVGLElBQUksYUFBYSxDQUFDLE1BQU0sS0FBSyxHQUFHO1lBQzlCLE1BQU07Z0JBQ0osT0FBTyxFQUFFLG1CQUFtQjtnQkFDNUIsS0FBSyxFQUFFLGFBQWE7YUFDckIsQ0FBQztRQUVKLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxtQ0FBbUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSx3RkFBd0YsQ0FBQztRQUUvTCxPQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUM7S0FDM0I7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFZixNQUFNO1lBQ0osT0FBTyxFQUFFLG1CQUFtQjtZQUM1QixLQUFLLEVBQUUsQ0FBQztTQUNULENBQUM7S0FDSDtBQUNILENBQUMsQ0FBQyJ9