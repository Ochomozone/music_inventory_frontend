// Purpose: Contains functions to check if a user has permission to view certain pages or components.

export const LoggedIn = (profile) => {
    const loggedIn = profile?.role;
    return loggedIn;
};
export const ViewUserInfo = (profile) => {
    const showUserInfo = profile?.role && 
    ['INVENTORY MANAGER', 'ADMINISTRATOR', 'MUSIC TEACHER', 'MUSIC TA']
    .includes(profile.role);
    return showUserInfo;
};

export const ViewInstruments = (profile) => {
    const showAllInstruments = profile?.role && 
    ['INVENTORY MANAGER', 'ADMINISTRATOR', 'MUSIC TEACHER', 'MUSIC TA']
    .includes(profile.role);
    return showAllInstruments;
};

export const RequestInstruments = (profile) => {
    const canRequestInstruments = profile?.role && 
    ['MUSIC TEACHER', 'TEACHER', 'MUSIC TA', 'STUDENT']
    .includes(profile.role);
    return canRequestInstruments;
};

export const ViewAllInstrumentRequests = (profile) => {
    const canViewInstrumentRequests = profile?.role && 
    ['INVENTORY MANAGER', 'ADMINISTRATOR', 'MUSIC TEACHER', 'MUSIC TA']
    .includes(profile.role);
    return canViewInstrumentRequests;
};
export const GrantInstrumentRequests = (profile) => {
    const canGrantInstrumentRequests = profile?.role && 
    ['INVENTORY MANAGER']
    .includes(profile.role);
    return canGrantInstrumentRequests;
};


export const ViewUsers = (profile) => {
    const showUsers = profile?.role && 
    ['INVENTORY MANAGER', 'ADMINISTRATOR', 'MUSIC TEACHER', 'MUSIC TA']
    .includes(profile.role);
    return showUsers;
};
export const CreateNewInstrument = (profile) => {
    const createNewInstrument = profile?.role && 
    ['INVENTORY MANAGER']
    .includes(profile.role);
    return createNewInstrument;
};
export const ViewCheckouts = (profile) => {
    const viewCheckouts = profile?.role && 
    ['INVENTORY MANAGER', 'ADMINISTRATOR', 'MUSIC TEACHER', 'MUSIC TA']
    .includes(profile.role);
    return viewCheckouts;
};
export const CreateCheckout = (profile) => {
    const createCheckout = profile?.role && 
    ['INVENTORY MANAGER', 'MUSIC TEACHER']
    .includes(profile.role);
    return createCheckout;
};
export const TurnInCheckout = (profile) => {
    const turnInCheckout = profile?.role && 
    ['INVENTORY MANAGER', 'MUSIC TEACHER', 'MUSIC TA']
    .includes(profile.role);
    return turnInCheckout;
}

export const ViewLogs = (profile) => {
    const viewLogs = profile?.role && 
    ['INVENTORY MANAGER', 'ADMINISTRATOR']
    .includes(profile.role);
    return viewLogs;
};
export const ShowLogsLink = (profile) => {
    const showLogsLink = profile?.role && 
    ['INVENTORY MANAGER', 'ADMINISTRATOR']
    .includes(profile.role);
    return showLogsLink;
};
export const ShowNewCheckoutLink = (profile) => {
    const showNewCheckoutLink = profile?.role && 
    ['INVENTORY MANAGER', 'MUSIC TEACHER']
    .includes(profile.role);
    return showNewCheckoutLink;
};
export const ShowUsersLink = (profile) => {
    const showUsersLink = profile?.role && 
    ['INVENTORY MANAGER', 'MUSIC TEACHER', 'MUSIC TA', 'ADMINISTRATOR']
    .includes(profile.role);
    return showUsersLink;
};
export const ShowInstrumentsLink = (profile) => {
    const showInstrumentsLink = profile?.role && 
    ['INVENTORY MANAGER', 'MUSIC TEACHER', 'ADMINISTRATOR']
    .includes(profile.role);
    return showInstrumentsLink;
};
export const ShowCheckoutsLink = (profile) => {
    const showCheckoutsLink = profile?.role && 
    ['INVENTORY MANAGER', 'MUSIC TEACHER', 'MUSIC TA', 'ADMINISTRATOR']
    .includes(profile.role);
    return showCheckoutsLink;
};