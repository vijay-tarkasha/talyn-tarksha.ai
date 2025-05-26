const storeAuthInfo = (result: any) => {
    localStorage.setItem("int_token", result.access)
    localStorage.setItem("int_domain", result.domain)
    localStorage.setItem("int_refresh", result.refresh)
}

const clearAuthInfo = () => {
    localStorage.removeItem("int_token")
    localStorage.removeItem("int_domain")
    localStorage.removeItem("int_refresh")
}

const clearQnInfo = () => {
    localStorage.removeItem('submittedAns');
    localStorage.removeItem('revisitQn');
    localStorage.removeItem('submittedUserAns');
    localStorage.removeItem('timer');
    localStorage.removeItem('activePage');
    localStorage.removeItem("revisitedUserAns");
}

export { storeAuthInfo, clearAuthInfo, clearQnInfo }