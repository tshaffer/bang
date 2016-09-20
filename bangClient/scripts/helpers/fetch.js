import isoFetch from 'isomorphic-fetch';

// import includes from 'lodash/includes'

export const serialize = (obj) => Object.keys(obj).map(key => key + '=' + encodeURIComponent(obj[key])).join('&');

export const tokenize = (payload, getState) => {
    const state = getState();
    payload.headers = payload.headers || {};
    if(state.user) {
        payload.headers.Authorization = `${state.user.token_type} ${state.user.access_token}`;
    }
    return payload;
};

export const fetch = (path, params, dispatch, getState, isBlob = false) => {
    return isoFetch(path, tokenize(params, getState))
        .then(response => {
            // if(response.status === 401) dispatch(logout())

            let responseResult;

            if (isBlob) {
                responseResult = response.blob();
            } else {
                responseResult = response.json();
            }

            return responseResult.then(json => {
                return response.ok
                    ? json
                    : Promise.reject(json.error_description || json.message || json.error || response.statusText || 'Request failed');
            }, () => {
                if(response.status === 200) {
                    // Some POSTs returns empty body with status 200 on success. Ex. POST {contentId}/tags
                    return Promise.resolve(response);
                } else {
                    return Promise.reject('Request failed');
                }});
        });
};
