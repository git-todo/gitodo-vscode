const API_ENDPOINT = 'https://dog.ceo/api/breeds/list/all';

export const fetchApi = async () => {
    try {
        const response = await fetch(API_ENDPOINT);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};
