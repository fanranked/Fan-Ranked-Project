import { HttpClient } from './HttpClient.js';

class PollAPI {
    api = new HttpClient({"verbose": true})

    handleError(data, defaultValue)
    {
        if(data == null)
        {
            data = defaultValue;
        }
        if(data["error"] != null)
        {
            console.log(data["error"]);
            data = defaultValue;
        }
        return data;
    }

    async getPoll() {
        let endpoint = `/poll`;
        return this.handleError(await this.api.request("GET", endpoint, {}), {});
    }

    async getPollResults() {
        let endpoint = `/poll/results`;
        return this.handleError(await this.api.request("GET", endpoint, {}), {});
    }

    async sendPoll(data) {
        let endpoint = `/poll`;
        return this.handleError(await this.api.request("POST", endpoint, data), {});
    }


}

export { PollAPI }