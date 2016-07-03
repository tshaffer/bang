/**
 * Created by tedshaffer on 6/24/16.
 */
import { NEW_HTML_SITE } from '../actions/index';
import { guid } from '../utilities/utils';

const initialState =
{
    htmlSitesById: {}
};

let newState = null;

let htmlSite = null;

export default function(state = initialState, action) {

    // console.log("reducer_html_sites:: action.type=" + action.type);

    switch (action.type) {
        case NEW_HTML_SITE:

            const id = guid();
            const htmlSiteData = action.payload;

            htmlSite =
            {
                id: id,
                name: htmlSiteData.name,
                siteSpec: htmlSiteData.siteSpec,
                type: htmlSiteData.type
            };

            const newItem = {};
            newItem[id] = htmlSite;
            let newHtmlSitesById = Object.assign({}, state.htmlSitesById, newItem);

            newState = {
                htmlSitesById: newHtmlSitesById
            }
            return newState;
    }

    return state;
};
