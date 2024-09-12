const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString().replace('T', ' ').substring(0, 19);
}

export const formatDateForTable = (data) => {
    return data.content.map(item => {
        const formattedDate = formatDateTime(item.transactionDate);
        item.transactionDate = formattedDate;
        return item;
    });
}


export const formatDateTimeForBackend = (dateStr, isStartDate) => {
    const date = new Date(dateStr);
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);

    if (isStartDate) {
        date.setHours(5, 30, 0, 0); 
    } else {
        date.setHours(29, 29, 59, 999);
    }

    return date.toISOString().slice(0, 19);
  };


export const formatRoleForTable = (data) => {
    return data.content.map(item => {
        const role = item.roles.includes("ROLE_ADMIN") ? "Admin" : "Customer";
        item.role = role;
        return item;
    });
}


export const covertIdDataIntoTable = (data) => {
    const result = {
        content: [data],
        page: 0,
        size: 1,
        totalElements: 1,
        totalPages: 1,
        last: true
    };

    return result;
}