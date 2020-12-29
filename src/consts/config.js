// const testDomain = window.location.host.startsWith('front-basement');
// export const ENV = process.env.NODE_ENV === 'production' ? (testDomain ? 'test' :  'prod') : 'dev';
export const ENV = 'dev'

const configs = {
    dev: {
        domain: 'https://projload.russpass.iteco.dev/project-load',
        // postfix: 'billingapi/data',
        api: 'https://projload.russpass.iteco.dev/project-load',
        // token_v2: 'standard_auth_token',
        // isDisableReports: false
    }
}

export const BASE_URL = configs[ENV].domain;
// export const POSTFIX = configs[ENV].postfix;
export const API = configs[ENV].api;
// export const STANDARD_TOKEN = configs[ENV].token_v2;
// export const IS_DISABLE_REPORTS = configs[ENV].isDisableReports;
export default `${BASE_URL}${configs[ENV].postfix}`;

