export const timeFormater = (timestamp) => {
    
    const date = new Date(timestamp);

    const formattedTime = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }).format(date);

    return formattedTime;
}

