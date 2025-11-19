import * as yup from "yup";
import clientConfig from './src/clientConfig.js';

const serverIP = clientConfig.serverIP
// Функция для создания схемы валидации на основе действия
export const validationSchema = (action) => {
    switch (action) {
        case 'addEngine':
            return yup.object().shape({
                title: yup.string().required('Обязательно'),
                position: yup.string().required('Обязательно'),
                installationPlace: yup.string().required('Обязательно'),
                inventoryNumber: yup.string().required('Обязательно'),
                account: yup.string().required('Обязательно'),
                type: yup.string().required('Обязательно'),
                power: yup.string().required('Обязательно'),
                coupling: yup.string().required('Обязательно'),
                status: yup.string().required('Обязательно'),
                date: yup.string().required('Обязательно')
            });

        case 'addPosition':
            return yup.object().shape({
                position: yup.string().required('Обязательно'),
                installationPlace: yup.string()  // Поле необязательное, без required
            });
        case 'addHistoryRepair':
            return yup.object().shape({
                repairType: yup.string().required('Обязательно'),
                repairDescription: yup.string().required('Обязательно'),
                repairDate:yup.string().required('Обязательно')
            });
        default:
            return yup.object().shape({});
    }
};


export const getApiDataSearch = async (values, action) => {
    const requestOptions = {
        method: 'GET'
    };
    const queryParams = new URLSearchParams(values).toString();
    switch (action){
        case 'getEngineByLocation':
            return await fetch(`http://${serverIP}/api/getEngineByLocation?${queryParams}`,requestOptions)
                .then((response) => {
                    return response.json()
                        .then((data) => {
                            return (data);
                        })
                })
        case 'getEngineByInstallationPlace':
            return await fetch(`http://${serverIP}/api/getEngineByInstallationPlace?${queryParams}`,requestOptions)
                .then((response) => {
                    return response.json()
                        .then((data) => {
                            return (data);
                        })
                })
        case 'getEngineByInventoryNumber':
            return await fetch(`http://${serverIP}/api/getEngineByInventoryNumber?${queryParams}`,requestOptions)
                .then((response) => {
                    return response.json()
                        .then((data) => {
                            return (data);
                        })
                })
        case 'getEngineByID':
            console.log(queryParams)
            return await fetch(`http://${serverIP}/api/getEngineByID?${queryParams}`,requestOptions)
                .then((response) => {
                    return response.json()
                        .then((data) => {
                            return (data);
                        })
                })
    }
}
export const getAllEngines = async () => {
    const requestOptions = {
        method: 'GET'
    };
    return await fetch(`http://${serverIP}/api/getAllEngines`, requestOptions)
        .then((response) => {
            return response.json()
                .then((data) => {
                    return (data);
                })
        })
}
export const fetchData = async (values, action, method) => {
    let requestOptions;

    // Условно формируем тело запроса в зависимости от действия
    if (action === 'addEngine' || action === 'updateEngine') {
        const formData = new FormData();
        for (const key in values) {
            formData.append(key, values[key]);
        }
        requestOptions = {
            method: method,
            body: formData
        };
    } else {
        requestOptions = {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        };
    }


    switch (action) {
        case 'addEngine':
            console.log('В фетч:', values);
            try {
                const response = await fetch(`http://${serverIP}/api/addEngine`, requestOptions);

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const data = await response.json();


                return data;
            } catch (error) {
                console.error('Ошибка при выполнении fetch:', error);
                throw error;
            }
        case 'updateEngine':
            try {
                console.log('values.id:',values.id)
                const response = await fetch(`http://${serverIP}/api/updateEngine/${values.id}`, requestOptions);

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const data = await response.json();


                return data;
            } catch (error) {
                console.error('Ошибка при выполнении fetch:', error);
                throw error;
            }
        case 'deleteEngine':
            try {
                console.log('values.id:',values.id)
                const response = await fetch(`http://${serverIP}/api/deleteEngine/${values.id}`, requestOptions);

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const data = await response.json();


                return data;
            } catch (error) {
                console.error('Ошибка при выполнении fetch:', error);
                throw error;
            }
        case 'addPosition':
            console.log('В фетч:', values);
            try {
                console.log(requestOptions)
                const response = await fetch(`http://${serverIP}/api/addPosition`, requestOptions);

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const data = await response.json();


                return data;
            } catch (error) {

                console.error('Ошибка при выполнении fetch:', error);
                throw error; // или обработайте ошибку по-другому
            }
        case 'delPosition':
            console.log('В фетч:', values);
            try {
                const response = await fetch(`http://${serverIP}/api/delPosition`, requestOptions);

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const data = await response.json();


                return data;
            } catch (error) {

                console.error('Ошибка при выполнении fetch:', error);
                throw error; // или обработайте ошибку по-другому
            }
        case 'addInstallationPlace':
            console.log('В фетч:', values);
            try {
                const response = await fetch(`http://${serverIP}/api/addInstallationPlace`, requestOptions);

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const data = await response.json();



                return data;
            } catch (error) {

                console.error('Ошибка при выполнении fetch:', error);
                throw error; // или обработайте ошибку по-другому
            }
        case 'delInstallationPlace':
            console.log('В фетч:', values);
            try {
                const response = await fetch(`http://${serverIP}/api/delInstallationPlace`, requestOptions);

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const data = await response.json();



                return data;
            } catch (error) {

                console.error('Ошибка при выполнении fetch:', error);
                throw error; // или обработайте ошибку по-другому
            }
        case 'addHistoryRepair':
            console.log('В фетч:', values);
            try {
                const response = await fetch(`http://${serverIP}/api/addHistoryRepair`, requestOptions);

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const data = await response.json();



                return data;
            } catch (error) {

                console.error('Ошибка при выполнении fetch:', error);
                throw error; // или обработайте ошибку по-другому
            }
    }
};
export const getFetchData = async (action) => {
    const requestOptions = {
        method: 'GET'
    };
    switch (action){
        case 'getPositions':
            console.log('В фетч:');
            try {
                const response = await fetch(`http://${serverIP}/api/getPositions`, requestOptions);

                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }

                const data = await response.json();


                return data;
            } catch (error) {

                console.error('Ошибка при выполнении fetch:', error);
                throw error; // или обработайте ошибку по-другому
            }
    }
}