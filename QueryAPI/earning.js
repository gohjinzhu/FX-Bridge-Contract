import axios from "axios";
import writeCSV from "../utils/writeCSV.js";

const columns = [
    "Address",
    "Moniker",
    "Cumulative earnings (FX)",
];
//fetch the validators info from https://fx-rest.functionx.io/cosmos/staking/v1beta1/validators
const getValidatorsEarning = async () => {
    //data will contain validators address,monika and cumulative earnings
    const data = []
    const validatorsResponse = await axios.get('https://fx-rest.functionx.io/cosmos/staking/v1beta1/validators')
    const validators = validatorsResponse.data.validators
    for (const validator of validators) {
        const address = validator.operator_address
        const commissionResponse = await axios.get(`https://fx-rest.functionx.io/cosmos/distribution/v1beta1/validators/${address}/commission`)
        const commissionArray = commissionResponse.data.commission.commission
        //some response return empty array
        if (commissionArray.length !== 0) data.push([address, validator.description.moniker, commissionArray[0].amount.toString()])
        else data.push([address, validator.description.moniker, 0])
    }
    console.log(data)
    // writeCSV('validators earnings.csv', columns, data)
}
getValidatorsEarning()


