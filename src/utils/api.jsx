const AUTH_URL="https://end-point.75e8s1syn0vdw.us-east-1.cs.amazonlightsail.com/guide_auth/"

const API = {
    login : async ( username, password, remember ) => {
        // we will switch to just username and password later, email excluded and replaced with username
        const user_remember = remember ? true : false;
        const response = await fetch(AUTH_URL+'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, remember: user_remember }),
        });                
        return response;
    },
    getRole : async ( token ) => {
        // Use this function to get the role of a user when needed
        const response = await fetch(AUTH_URL+'getRole', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        const res_json = await response.json();
        return res_json;
    }
}

export default API;