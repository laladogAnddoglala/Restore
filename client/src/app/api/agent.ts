import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

axios.defaults.baseURL = "http://localhost:5000/api/";

axios.interceptors.response.use(response => { return response },
    (error: AxiosError) => {
        const { data, status } = error.response as AxiosResponse;
        switch (status) {
            case 400:
                toast.error(data.title);
                break;
            case 401:
                toast.error(data.title);
                break;
            case 500:
                toast.error(data.title);
                break;
        }

        return Promise.reject(error.response);
    })

const respondBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string) => axios.get(url).then(respondBody),
    post: (url: string, body: {}) => axios.post(url, body).then(respondBody),
    put: (url: string, body: {}) => axios.put(url, body).then(respondBody),
    delete: (url: string) => axios.delete(url).then(respondBody)
}

const Catalog = {
    list: () => requests.get('products'),
    details: (id: number) => requests.get(`products/${id}`)
}

const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorised'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error')
}

const agent = {
    Catalog,
    TestErrors
}

export default agent;