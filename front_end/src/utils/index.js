const key = 'city'
const tokenKey = 'token'
export const setCurrentCity = value => {
    localStorage.setItem(key,JSON.stringify(value))
}
export const getCurrentCity = () => {
    try {
        const localCity = JSON.parse(localStorage.getItem(key))
        return Promise.resolve(localCity)
    }catch{
        const defaultCity = {label:'上海',value: 'AREA|dbf46d32-7e76-1196'}
        setCurrentCity(defaultCity)
        return Promise.resolve(defaultCity)

    }
}



export const setToken = token => {
    localStorage.setItem(tokenKey, token)
}

export {Request} from './request'
export {Request as API} from './request'
export {BASE_URL} from './url'
export * from './auth'
export * from './city'