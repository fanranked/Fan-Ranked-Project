//http request calls implemented as async
class HttpClient
{
    settings = {}

    constructor(options)
    {
        this.settings = {
            verbose: (options && options.hasOwnProperty('verbose') ? options.verbose:false),
            BASE_URL: (options && options.hasOwnProperty('baseUrl') ? options.baseUrl:"http://localhost:8082"),
            onsuccess: options && options.onsuccess || function() { console.log("onsuccess: MISSING callback"); },
            onfailure: options && options.onfailure || function(err, response) { console.log("onfailure: MISSING callback", err, response); },
            onmessage: options && options.onmessage || function(message) { console.log("onmessage: MISSING callback", message); },
            sessionid: null
        }
    }

    async request(method, endpoint, params, baseUrl) {
        var settings = this.settings

        // request options
        let options = {
            method: method.toUpperCase(),
            //data: JSON.stringify(json),
            mode: 'cors',
            //headers: {
            //    'Content-Type': 'application/json'
            //}
        }
        if(method.toUpperCase() == "POST")
        {
            options.body = JSON.stringify(params)
            options.headers = { "Content-Type": "application/json", "Accept": "application/json" }
        }

        if(baseUrl == null) baseUrl = settings.BASE_URL;
        endpoint = baseUrl + endpoint;
        if (settings.verbose) console.log(method, endpoint, params);

        return fetch(endpoint, options)
            .then(res => res.json())
//            .then(res => console.log(res))
            .catch(err => console.error(err));
/*
        // send post request
        var response = (await fetch(endpoint, options)).json()
        console.log(response)
        return response
        //    .then(res => res.json())
        //    .then(res => console.log(res))
        //    .catch(err => console.error(err));
 */
    }

    requestAjax(method, endpoint, params, baseUrl)
    {
        var settings = this.settings
        return new Promise( (resolve, reject) => {
            if(baseUrl == null) baseUrl = settings.BASE_URL;
            endpoint =  baseUrl + endpoint;
            if (settings.verbose) console.log(method, endpoint, params);

            $.ajax({
                type: method,
                url: endpoint,
                data: params,
                dataType: "json"
            })
                .done(function (data) {
                    resolve(data)
                })
                .fail(function (xhr, status, error) {
                    if (settings.verbose) console.log("failed:", {xhr, status, error});

                    let errorMessage = xhr.status + ': ' + xhr.statusText

                    if (xhr.status === 401) {
                        errorMessage = xhr.responseJSON.msg;
                    } else if (xhr.status === 0) {
                        errorMessage = "Server not responding";
                    } else {

                    }
                    reject(new Error(errorMessage))
                })
                .always(function () {
                })
        })
    }

    get = async function get(endpoint, params) {
        try { return await this.request("GET", endpoint, params) } catch(e){ console.log(e); }
    }

    post = async function post(endpoint, params) {
        try { return await this.request("POST", endpoint, params) } catch(e){ console.log(e); }
    }

    put = async function put(endpoint, params) {
        try { return await this.request("PUT", endpoint, params) } catch(e){ console.log(e); }
    }

    // delete is a keyword, so had to use _delete
    delete = async function _delete(endpoint, params) {
        try { return await this.request("DELETE", endpoint, params) } catch(e){ console.log(e); }
    }

}

export { HttpClient };