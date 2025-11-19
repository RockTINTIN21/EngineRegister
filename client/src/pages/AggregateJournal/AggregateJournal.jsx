// AggregateJournal.jsx
import MenuHeader from "../../components/MenuHeader/MenuHeader.jsx";
import MenuIcon from "../../assets/icons/MenuIcon.svg";
import DataBaseIcon from "../../assets/icons/DataBaseIcon.svg";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styles from "./AggregateJournal.module.css";
import { Formik } from "formik";
import search from '../../assets/icons/SearchIcon.svg';
import edit from '../../assets/icons/EditIcon.svg';
import {useEffect, useRef, useState} from "react";
import UniversalModal from "../../components/Modals/UniversalModal/UniversalModal.jsx";
import {getAllEngines, getApiDataSearch, getFetchData} from "../../../Validation.js";
import {Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import SyncSelectMenu from "../../components/Forms/SyncSelectMenu/SyncSelectMenu.jsx";

function AggregateJournal() {
    const [isMainHovered, setIsMainHovered] = useState(false);
    const [isEditHovered, setIsEditHovered] = useState(false);
    const [initialValues, setInitialValues] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [formFields, setFormFields] = useState([]);
    const [modalType, setModalType] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [positionsData, setPositionsData] = useState([]);
    const [positions,setPositions] = useState( [''])
    const [installationLocations,setInstallationLocations] = useState([''])
    const [isDataLoaded, setIsDataLoaded] = useState(false); // Состояние загрузки данных

    const formSelectCoupling = ['Готов', 'Не готов'];
    const formSelectStatus = ['В кап. рем', 'Готов', 'В ср. рем'];

    const handleDataSubmission = () => {
        setShowModal(false);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const getFromServer = async () => {
        const response = await getFetchData('getPositions');
        if (response && response.status === 'error') {
            console.log('Ошибка:', response.error);
        } else {
            setPositionsData(response.data);
            setPositions(response.data.map(p => p.position)); // Установите массив позиций
            if (response.data.length > 0) {
                setInstallationLocations(response.data[0].installationPlaces || []); // Установите места установки для первой позиции
            }
        }
    };
    useEffect(() => {
        getFromServer();
    }, []);
    // Установите начальные значения после загрузки данных
    useEffect(() => {
        if (positions.length > 0 && installationLocations.length > 0) {
            setInitialValues({
                title: '',
                position: positions[0], // Установите значение по умолчанию
                installationPlace: installationLocations[0], // Установите значение по умолчанию
                inventoryNumber: '',
                account: '',
                type: '',
                power: '',
                coupling: formSelectCoupling[0],
                status: formSelectStatus[0],
                linkOnAddressStorage: '',
                docFromPlace: '',
                date: ''
            });

            setFormFields([
                { id: 'title', label: 'Название двигателя:', formType: 'field' },
                { formType: 'selectMenu', isPosition: true },
                { formType: 'image' },
                { id: 'inventoryNumber', label: 'Ивент. Номер:', formType: 'field' },
                { id: 'account', label: 'Учет. Номер:', formType: 'field' },
                { id: 'type', label: 'Тип:', formType: 'field' },
                { id: 'power', label: 'Мощность:', formType: 'field' },
                { id: 'coupling', label: 'Муфта:', formType: 'selectMenu', selectMenu: formSelectCoupling },
                { id: 'status', label: 'Готов / Не готов:', formType: 'selectMenu', selectMenu: formSelectStatus },
                { id: 'linkOnAddressStorage', label: 'Ссылка на адрес хранения:', formType: 'field' },
                { id: 'docFromPlace', label: 'Ссылка на документацию от производителя:', formType: 'field' },
                { id: 'date', label: 'Дата:', formType: 'date' }
            ]);
        }
    }, [positions, installationLocations]); // Зависимость от позиций и мест установки

    useEffect(() => {
        console.log('positions3:',positions)
    }, [positions]);

    const saveFormType = async () => {
        // Открытие модального окна
        setModalTitle('Добавить запись');
        setModalType('form');
        setShowModal(true);
    };


    const [status, setStatus] = useState('Здесь пока ничего нет. Начните искать в поиске');
    const formSelectList = [
        { title: 'Место нахождения', validationType: 'getEngineByLocation', value: { location: "" } },
        { title: 'Место установки', validationType: 'getEngineByInstallationPlace', value: { installationPlace: "" } },
        { title: 'Инвентарный номер', validationType: 'getEngineByInventoryNumber', value: { inventoryNumber: "" } }
    ];

    const [formTitle, setFormTitle] = useState(formSelectList[0].title);
    const [formValue, setFormValue] = useState(formSelectList[0].value);
    const [actionSearch, setActionSearch] = useState(formSelectList[0].validationType);
    const handleChangeSelectMenu = (e, resetForm) => {
        const key = formSelectList.findIndex(elem => elem.title === e.target.value);
        setFormTitle(formSelectList[key].title);
        setActionSearch(formSelectList[key].validationType);
        setFormValue(formSelectList[key].value || {}); // Убедитесь, что value всегда определено
        resetForm({ values: formSelectList[key].value || {} });
    };

    const formSelectedList = formSelectList.map((elem, index) => (
        <option key={index} value={elem.title}>{elem.title}</option>
    ));
    const [engineList, setEngineList] = useState([]);
    const submitOnServer = async (values) => {
        const response = await getApiDataSearch(values, actionSearch);
        setStatus('Ничего не найдено')
        if (response.status === 'error' || response.data < 1) {
            setEngineList('')
        } else {
            setStatus('');
            // Оборачиваем объект в массив, если ответ не является массивом
            const data = Array.isArray(response.data) ? response.data : [response.data];
            setEngineList(data);
        }
    };
    const showAllEngines = async () =>{
        const response = await getAllEngines();
        if (response.status === 'error') {
            setStatus('Ничего не найдено')
        } else {
            setStatus('')
            setEngineList(response.data)
        }
    }
    useEffect(() => {
        console.log('Двигатели:',engineList)
    }, [engineList]);
    function truncateText(text, maxLength) {
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }
        return text;
    }
    return (
        <>
            <MenuHeader title="Агрегатный журнал" pathToMain={"/"} titleButtonMain="Меню" imgPathToMain={MenuIcon}
                        imgPathToSearch={DataBaseIcon} pathToSearch={'/AggregateJournal/EditDataBase'}
                        titleButtonSearch="Управление БД"/>
            <div className={`container styles-card p-2 bg-gray `}>
                <div className="m-2 ">
                    <Formik
                        initialValues={formValue}
                        enableReinitialize={true}
                        onSubmit={(values) => {
                            submitOnServer(values);
                        }}
                    >
                        {({handleSubmit, handleChange, values, touched, errors, resetForm}) => (
                            <Form onSubmit={handleSubmit}
                                  className="m-1 col-md-12 col-auto d-flex flex-column flex-md-row">
                                <div className="col-md-7 col-auto d-flex">
                                    <Form.Group controlId="formBasic" className="col-md-10 col-auto">
                                        <Form.Control type="text" className={`h-100 ${styles.formSearch}`}
                                                      placeholder={formTitle}
                                                      name={Object.keys(formValue)[0]}
                                                      value={values[Object.keys(formValue)[0]]}
                                                      onChange={handleChange}
                                                      isInvalid={touched[Object.keys(formValue)[0]] && !!errors[Object.keys(formValue)[0]]}
                                        />
                                        <Form.Control.Feedback
                                            type="invalid">{errors[Object.keys(formValue)[0]]}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Button type="submit"
                                            className={`h-100 col ${styles.btnSubmit} pt-2 p-0 pe-md-3 pe-1 ms-0 text-center `}
                                            onMouseEnter={() => setIsMainHovered(true)}
                                            onMouseLeave={() => setIsMainHovered(false)}
                                    >
                                        <img src={search}
                                             className={`${styles.icon} ${isMainHovered ? styles.hover : ''} p-0`}
                                             alt="Search"/>
                                        Найти
                                    </Button>
                                </div>

                                <Form.Select defaultValue={formSelectList[0].title}
                                             className={`col ms-md-3 pt-2  mt-2 mt-md-0 selectMenu`}
                                             onChange={(e) => handleChangeSelectMenu(e, resetForm)}
                                >
                                    {formSelectedList || 'Пусто'}
                                </Form.Select>
                                <Button className="ms-md-3 col-md-auto col-12  mt-2 mt-md-0"
                                        onClick={() => showAllEngines()}
                                >
                                    Показать все
                                </Button>
                                <Button className="ms-md-3 col-md-auto col-12  mt-2 mt-md-0"
                                        onMouseEnter={() => setIsEditHovered(true)}
                                        onMouseLeave={() => setIsEditHovered(false)}
                                        onClick={() => saveFormType()}
                                >
                                    <img src={edit}
                                         className={`${styles.icon} ${isEditHovered ? styles.hover : ''} pe-1`}
                                         alt="Search"/>
                                    Добавить
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            <div className={`container styles-card p-2 bg-gray mt-3`}>
                <div className={`table-responsive`}>
                    <Table striped bordered hover className={`engineList`} style={{maxHeight: '400px'}}>
                        <thead className={`engineListThead`}>
                        <tr>
                            <th>#</th>
                            <th>Название:</th>
                            <th>Место нахождения:</th>
                            <th>Место установки:</th>
                            <th>Ивент. Номер:</th>
                            <th>Учет. Номер:</th>
                            <th>Тип:</th>
                            <th>Мощность:</th>
                            <th>Муфта:</th>
                            <th>Статус:</th>
                            <th>Комментарии:</th>
                            <th>Дата:</th>
                        </tr>
                        </thead>
                        <tbody>
                        {engineList.length > 0 ? (
                            engineList.map((engine, index) => {
                                const handleRowClick = () => {
                                    window.location.href = `/AggregateJournal/EnginePassport/${engine._id}`;
                                };

                                const renderRow = () => (
                                    <>
                                        <td>{index + 1}</td>
                                        <td>{truncateText(engine.title, 8)}</td>
                                        <td>{truncateText(engine.location, 8)}</td>
                                        <td>{truncateText(engine.installationPlace,8)}</td>
                                        <td>{truncateText(engine.inventoryNumber, 8) }</td>
                                        <td>{truncateText(engine.accountNumber,8) }</td>
                                        <td>{truncateText(engine.type, 8)}</td>
                                        <td>{truncateText(engine.power, 8) } кВт</td>
                                        <td>{truncateText(engine.coupling, 8)}</td>
                                        <td>{truncateText(engine.status, 8)}</td>
                                        <td>{truncateText(engine.comments, 8)}</td>
                                        <td>{engine.date}</td>
                                    </>
                                );

                                switch (engine.status) {
                                    case 'Готов':
                                        return (
                                            <tr key={index} className={`bgReady`} onClick={handleRowClick}
                                                style={{cursor: 'pointer'}}>
                                                {renderRow()}
                                            </tr>
                                        );
                                    case 'В кап. рем':
                                        return (
                                            <tr key={index} className={`bgHeavyRepair`} onClick={handleRowClick}
                                                style={{cursor: 'pointer'}}>
                                                {renderRow()}
                                            </tr>
                                        );
                                    case 'В ср. рем':
                                        return (
                                            <tr key={index} className={`bgLowRepair`} onClick={handleRowClick}
                                                style={{cursor: 'pointer'}}>
                                                {renderRow()}
                                            </tr>
                                        );
                                    default:
                                        return (
                                            <tr key={index} onClick={handleRowClick} style={{cursor: 'pointer'}}>
                                                {renderRow()}
                                            </tr>
                                        );
                                }
                            })
                        ) : (
                            <tr>
                                <td colSpan="12" className="text-center">{status}</td>
                            </tr>
                        )}
                        </tbody>


                    </Table>
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
                action='addEngine'
                method='POST'
            />
        </>
    )
}

export default AggregateJournal;