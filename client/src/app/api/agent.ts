import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";


const sleep = () => new Promise(resolve => setTimeout(resolve, 300));

axios.defaults.baseURL = "http://localhost:5000/api/";

axios.interceptors.response.use(async response => { 
    await sleep();
    return response },
    (error: AxiosError) => {
        const { data, status } = error.response as AxiosResponse;
        switch (status) {
            case 400:
                if (data.errors) {
                    const modelStateError: string[] = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modelStateError.push(data.errors[key])
                        }
                    }
                    throw modelStateError.flat();
                }
                toast.error(data.title);
                break;
            case 401:
                toast.error(data.title);
                break;
            case 500:
                router.navigate('/server-error', {state: {error: data}}); //Page redirection is asynchronous
                break;
            default:
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