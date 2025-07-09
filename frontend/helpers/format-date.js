const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // JS month starts from 0
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${hours}:${minutes}, ${month}/${day}/${year}`;
};

export default formatDateTime;