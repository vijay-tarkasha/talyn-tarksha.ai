const ServiceEndpoint = {
    apiBaseUrl: "https://apicoredev.talyn.ai/",
    uiBaseUrl: "https://uicoredev.talyn.ai/",
    mainDomain: "uicoredev.talyn.ai",
    auth: {
        client: {
            regClient: 'registerclient',
        },
        tenant: {
            user: {
                regUser: 'createuser',
                checkuser: 'checkuser',
                checkclientuser: 'checkclientuser'
            }
        },
        password: {
            setPassword: 'setpassword',
            validationCode: 'validatecode',
            forgotPwd: 'forgotpassword',
            resetPwd: 'validatelink',
        },
        login: {
            api: 'login',
            refresh: 'loginrefresh',
            loginKey: 'loginkey',
            loginKeyLogin: 'urllogin/{uuid}/'
        },
        logout: {
            api: 'logout',
        }
    },
    job: {
        restApi: 'jobpostings',
        byId: 'jobpostings/{id}/',
        sugg: 'getinterviewsuggestions'
    },
    candidate: {
        restApi: 'candidates',
        byId: 'candidates/{id}/',
        upload: 'candidates/{id}/upload-resume/',
    },
    application: {
        restApi: 'applications',
        byId: 'application/{id}/',
        upload: 'uploadfiles/{id}/',
    },
    interview: {
        restApi: 'interviews',
        evaluate: 'interviews/evaluate/{id}/',
        submit: 'interviews/submit',
        feedback: 'interviews/feedback'
    },
    videoUpload: {
        restApi: 'interviews/videos/chunk/{id}',
    },
    company: {
        restApi: 'getme'
    },
    profile: {
        restApi: '',
        update: 'updateuser'
    },
    user: {
        restApi: 'users',
        addUser: 'newuser',
        updateUser: 'updateuser',
        byId: 'users/{id}'
    },
    dashboard: {
        restApi: 'dashboard'
    },
}

export { ServiceEndpoint }