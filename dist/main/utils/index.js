"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectionRefs = exports.url = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const axios_1 = __importDefault(require("axios"));
exports.url = "https://api.sologenic.org/api/v1";
const getConnectionRefs = async (tx, options) => {
    try {
        const endpoint = options.custom_endpoint || exports.url;
        const axiosResponse = await axios_1.default.post(endpoint + "/issuer/transactions", {
            tx_json: tx,
            options: Object.assign(Object.assign({ expires_at: (0, dayjs_1.default)().add(options.expiry, "ms").toISOString(), submit: false }, (options.pushToken ? { push_token: options.pushToken } : {})), (options.api_key ? { api_key: options.api_key } : {})),
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
exports.getConnectionRefs = getConnectionRefs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvdXRpbHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsa0RBQTBCO0FBRTFCLGtEQUEwQjtBQVFiLFFBQUEsR0FBRyxHQUFHLGtDQUFrQyxDQUFDO0FBRS9DLE1BQU0saUJBQWlCLEdBQUcsS0FBSyxFQUNwQyxFQUFPLEVBQ1AsT0FBMEIsRUFDRyxFQUFFO0lBQy9CLElBQUk7UUFDRixNQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsZUFBZSxJQUFJLFdBQUcsQ0FBQztRQUVoRCxNQUFNLGFBQWEsR0FBRyxNQUFNLGVBQUssQ0FBQyxJQUFJLENBQ3BDLFFBQVEsR0FBRyxzQkFBc0IsRUFDakM7WUFDRSxPQUFPLEVBQUUsRUFBRTtZQUNYLE9BQU8sZ0NBQ0wsVUFBVSxFQUFFLElBQUEsZUFBSyxHQUFFLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLEVBQzNELE1BQU0sRUFBRSxLQUFLLElBQ1YsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUM1RCxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQ3pEO1NBQ0YsRUFDRDtZQUNFLE9BQU8sRUFBRTtnQkFDUCxjQUFjLEVBQUUsa0JBQWtCO2FBQ25DO1NBQ0YsQ0FDRixDQUFDO1FBRUYsSUFBSSxhQUFhLENBQUMsTUFBTSxLQUFLLEdBQUc7WUFDOUIsTUFBTTtnQkFDSixPQUFPLEVBQUUsbUJBQW1CO2dCQUM1QixLQUFLLEVBQUUsYUFBYTthQUNyQixDQUFDO1FBRUosYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLG1DQUFtQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLHdGQUF3RixDQUFDO1FBRS9MLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQztLQUMzQjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVmLE1BQU07WUFDSixPQUFPLEVBQUUsbUJBQW1CO1lBQzVCLEtBQUssRUFBRSxDQUFDO1NBQ1QsQ0FBQztLQUNIO0FBQ0gsQ0FBQyxDQUFDO0FBMUNXLFFBQUEsaUJBQWlCLHFCQTBDNUIifQ==