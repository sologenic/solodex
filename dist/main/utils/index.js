"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectionRefs = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const axios_1 = __importDefault(require("axios"));
const getConnectionRefs = async (tx, options) => {
    try {
        const url = "https://api.sologenic.org/api/v1";
        const axiosResponse = await axios_1.default.post(url + "/issuer/transactions", {
            tx_json: tx,
            options: Object.assign({ expires_at: (0, dayjs_1.default)().add(options.expiry, "s").toISOString(), submit: false }, (options.pushToken ? { push_token: options.pushToken } : {})),
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
exports.getConnectionRefs = getConnectionRefs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsa0RBQTBCO0FBRTFCLGtEQUEwQjtBQU9uQixNQUFNLGlCQUFpQixHQUFHLEtBQUssRUFDcEMsRUFBTyxFQUNQLE9BQTBCLEVBQ0csRUFBRTtJQUMvQixJQUFJO1FBQ0YsTUFBTSxHQUFHLEdBQUcsa0NBQWtDLENBQUM7UUFFL0MsTUFBTSxhQUFhLEdBQUcsTUFBTSxlQUFLLENBQUMsSUFBSSxDQUNwQyxHQUFHLEdBQUcsc0JBQXNCLEVBQzVCO1lBQ0UsT0FBTyxFQUFFLEVBQUU7WUFDWCxPQUFPLGtCQUNMLFVBQVUsRUFBRSxJQUFBLGVBQUssR0FBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxFQUMxRCxNQUFNLEVBQUUsS0FBSyxJQUNWLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDaEU7U0FDRixFQUNEO1lBQ0UsT0FBTyxFQUFFO2dCQUNQLGNBQWMsRUFBRSxrQkFBa0I7Z0JBQ2xDLGFBQWEsRUFBRSxPQUFPLENBQUMsT0FBTzthQUMvQjtTQUNGLENBQ0YsQ0FBQztRQUVGLElBQUksYUFBYSxDQUFDLE1BQU0sS0FBSyxHQUFHO1lBQzlCLE1BQU07Z0JBQ0osT0FBTyxFQUFFLG1CQUFtQjtnQkFDNUIsS0FBSyxFQUFFLGFBQWE7YUFDckIsQ0FBQztRQUVKLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxtQ0FBbUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSx3RkFBd0YsQ0FBQztRQUUvTCxPQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUM7S0FDM0I7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFZixNQUFNO1lBQ0osT0FBTyxFQUFFLG1CQUFtQjtZQUM1QixLQUFLLEVBQUUsQ0FBQztTQUNULENBQUM7S0FDSDtBQUNILENBQUMsQ0FBQztBQTFDVyxRQUFBLGlCQUFpQixxQkEwQzVCIn0=