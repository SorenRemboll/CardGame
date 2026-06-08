export const formatDate = (date: Date | string) => {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    const formatter = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    });
    return formatter.format(date);
};