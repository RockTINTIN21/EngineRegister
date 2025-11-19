import MenuHeader from "../../components/MenuHeader/MenuHeader.jsx";
import MenuIcon from "../../assets/icons/MenuIcon.svg"
import search from '../../assets/icons/SearchIcon.svg'
import Button from 'react-bootstrap/Button';
import {useEffect, useState} from "react";
import UniversalModal from "../../components/Modals/UniversalModal/UniversalModal.jsx";
import {fetchData, getFetchData} from "../../../Validation.js";

function EditDataBase(){
    const [showModal, setShowModal] = useState(false);
    const [formFields, setFormFields] = useState([]);
    const [modalTitle, setModalTitle] = useState('');
    const [modalType, setModalType] = useState('');
    const [action, setAction] = useState('');
    const [method, setMethod] = useState('');
    const [initialValues, setInitialValues] = useState({});
    const [positionsData, setPositionsData] = useState([]); // Данные позиций с сервера
    const [positions,setPositions] = useState( [''])
    const [installationLocations,setInstallationLocations] = useState([''])

    const handleDataSubmission = () => {
        setShowModal(false);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    // Загрузка данных с сервера
    const getFromServer = async () => {
        const response = await getFetchData('getPositions');
        if (response && response.status === 'error') {
            console.log('Ошибка:', response.error);
        } else {
            setPositionsData(response.data);
            setPositionsData(response.data);
            setPositions(response.data.map(p => p.position));
            if (response.data.length > 0) {
                setInstallationLocations(response.data[0].installationPlaces || []);
            }
        }
    }



    useEffect(() => {
        getFromServer();
    }, []);


    const saveFormType = (formType) => {
        switch (formType) {
            case 'addPosition':
                setFormFields([
                    { id: 'position', label: 'Место нахождения:', formType: 'field' },
                    { id: 'installationPlace', label: 'Необязательно - Места установки (через запятую):', formType: 'fieldTextArea' }
                ]);
                setInitialValues({
                    position: '',
                    installationPlace: ''
                });
                setModalTitle('Добавить место нахождения');
                setAction('addPosition');
                setMethod('POST');
                setModalType('form');
                setShowModal(true);
                break;

            case 'delPosition':
                setFormFields([
                    { id: 'position', label: 'Место нахождения:', formType: 'selectMenu', selectMenu: positionsData.map(position => position.position)},
                ]);
                setInitialValues({
                    position: positionsData[0]?.position || '',
                });
                setAction('delPosition');
                setMethod('DELETE');
                setModalTitle('Удалить место нахождения');
                setModalType('form');
                setShowModal(true);
                break;

            case 'addInstallationPlace':
                setFormFields([
                    { id: 'position', label: 'Место нахождения:', formType: 'selectMenu', selectMenu: positionsData.map(position => position.position)},
                    { id: 'installationPlace', label: 'Необязательно - Места установки (через запятую):', formType: 'fieldTextArea' }
                ]);
                setInitialValues({
                    position: positionsData[0]?.position || '',
                    installationPlace: ''
                });
                setModalTitle('Добавить место установки');
                setAction('addInstallationPlace');
                setMethod('POST');
                setModalType('form');
                setShowModal(true);
                break;

            case 'delInstallationPlace':
                if (positionsData.length > 0) {

                    setInitialValues({
                        position: positions[0] || '', // Установите значение по умолчанию
                        installationPlace: installationLocations[0] || '', // Установите значение по умолчанию
                    });

                    setFormFields([
                        {formType: 'selectMenu',isPosition:true}
                    ]);
                }

                setAction('delInstallationPlace');
                setMethod('DELETE');
                setModalTitle('Удалить место установки');
                setModalType('form');
                setShowModal(true);
                break;
        }
    }

    return(
        <>
            <MenuHeader title="Управление БД" pathToMain={"/"} titleButtonMain="Меню" imgPathToMain={MenuIcon} imgPathToSearch={search} pathToSearch={'/AggregateJournal'} titleButtonSearch="Поиск"/>
            <div className=" ">
                <div className="col-12 styles-card bg-gray mt-3 mt-md-0 d-flex flex-column flex-md-row pt-3 pb-3 p-md-auto">
                    <Button className='m-2 col-auto' onClick={() => saveFormType('addPosition')}>Добавить место нахождения</Button>
                    <Button className='m-2 col-auto' onClick={() => saveFormType('delPosition')}>Удалить место нахождения</Button>
                </div>
                <div className="col-12 styles-card bg-gray mt-3 mt-md-3 d-flex flex-column flex-md-row pt-3 pb-3 p-md-auto">
                    <Button className='m-2 col-auto' onClick={() => saveFormType('addInstallationPlace')}>Добавить место установки</Button>
                    <Button className='m-2 col-auto' onClick={() => saveFormType('delInstallationPlace')}>Удалить место установки</Button>
                </div>
            </div>
            <UniversalModal
                show={showModal}
                handleClose={closeModal}
                modalType={modalType}
                formFields={formFields}
                title={modalTitle}
                initialValues={initialValues}
                onSubmit={handleDataSubmission}
                action={action}
                method={method}
            />
        </>
    )
}

export default EditDataBase;