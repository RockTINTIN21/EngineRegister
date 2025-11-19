import { useEffect, useState } from "react";
import { Modal, Button } from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import { Formik } from "formik";
import SuccessModal from "../SuccessModal/SuccessModal.jsx";
import { fetchData, validationSchema } from "../../../../Validation.js";
import FileUpload from "../../Forms/FileUpload/FileUpload.jsx";
import { useNavigate } from 'react-router-dom';
import SyncSelectMenu from "../../Forms/SyncSelectMenu/SyncSelectMenu.jsx";
const UniversalModal = ({ show, title, handleClose, formFields, modalType, closeModal, initialValues, action, method, onSubmit, positionsData, onPositionChange,propsFormDeleteModal }) => {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [serverErrors, setServerErrors] = useState({});

    const navigate = useNavigate();
    const delEngine =  async () =>{
        try {

            const values = propsFormDeleteModal.values
            const action = propsFormDeleteModal.action
            const method = propsFormDeleteModal.method
            console.log('КНОПКА:',propsFormDeleteModal)
            console.log('values:',propsFormDeleteModal.values)
            console.log(
                'Обновленные значения:',values
            )
            console.log('response:',values, action,method)
            const response = await fetchData(values, action,method);
            if (response.status === 'error') {
                console.error('Ошибка:', response.message);
            } else {
                setShowSuccessModal(true)
                setTimeout(() => {
                    navigate('/');
                }, 2000);
                console.log('Cool!')
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
        }
    }
    const closeUniversalModal = () => setShowSuccessModal(false);



    const submitOnServer = async (values, action, method) => {
        console.log('Данные для отправки:', values); // Логирование значений формы перед отправкой
        try {
            const response = await fetchData(values, action, method);
            console.log('Ответ от сервера:', response); // Логирование ответа сервера
            if (!response || response.status === 'error') {
                const nameField = response?.errors?.field || 'unknown';
                setServerErrors({ [nameField]: response?.errors?.message || 'Ошибка сервера' });
                setTimeout(() => {
                    setServerErrors({ [nameField]: false });
                }, 3000);
            } else {
                console.log('Успешно отправлено!');
                setShowSuccessModal(true);
                onSubmit(); // Закрываем модальное окно при успешной отправке
            }
        } catch (error) {
            console.error('Ошибка при отправке формы:', error); // Логирование ошибок отправки
        }
    };

    const renderModalContent = () => {
        switch (modalType) {
            case 'form':
                return (
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema(action)}
                        onSubmit={(values) => {
                            console.log('Отправлено!', values);
                            submitOnServer(values, action, method);
                        }}
                    >
                        {({ handleSubmit, handleChange, values, touched, errors }) => (
                            <Form onSubmit={handleSubmit}>
                                {formFields.map((field, index) => (
                                    <Form.Group key={index} className="mb-3">
                                        {(() => {
                                            const { id, isPosition, formType, selectMenu } = field;
                                            switch (formType) {
                                                case 'selectMenu':
                                                    if(isPosition){
                                                        return <SyncSelectMenu errors={errors} onChange={handleChange} touched={touched} value={values}/>

                                                    }else{
                                                        return(
                                                            <>
                                                                <Form.Label>{field.label}</Form.Label>
                                                                <Form.Select
                                                                    id={id}
                                                                    name={id}
                                                                    value={values[id]}
                                                                    onChange={(e) => {
                                                                        handleChange(e);  // Сначала обрабатываем изменение через Formik
                                                                    }}
                                                                    isInvalid={touched[id] && (!!errors[id] || !!serverErrors[id])}
                                                                >
                                                                    {selectMenu.map((option, i) => (
                                                                        <option key={i} value={typeof option === 'object' ? option.position : option}>
                                                                            {typeof option === 'object' ? option.position : option}
                                                                        </option>
                                                                    ))}
                                                                </Form.Select>
                                                                <Form.Control.Feedback type="invalid">{errors[id] || serverErrors[id]}</Form.Control.Feedback>
                                                            </>
                                                        )
                                                    }
                                                case 'date':
                                                    return (
                                                        <>
                                                            <Form.Label>{field.label}</Form.Label>
                                                            <Form.Control
                                                                type="date"
                                                                id={id}
                                                                name={id}
                                                                value={values[id]}
                                                                onChange={handleChange}
                                                                isInvalid={touched[id] && (!!errors[id] || !!serverErrors[id])}
                                                            />
                                                            <Form.Control.Feedback type="invalid">{errors[id] || serverErrors[id]}</Form.Control.Feedback>
                                                        </>
                                                    );
                                                case 'field':
                                                    return (
                                                        <>
                                                            <Form.Label>{field.label}</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                id={id}
                                                                name={id}
                                                                onChange={handleChange}
                                                                isInvalid={touched[id] && (!!errors[id] || !!serverErrors[id])}
                                                            />
                                                            <Form.Control.Feedback type="invalid">{errors[id] || serverErrors[id]}</Form.Control.Feedback>
                                                        </>
                                                    );
                                                case 'image':
                                                    return (
                                                        <>
                                                            <FileUpload name="file" label="Обновить фото"/>
                                                        </>
                                                    )
                                                case 'fieldTextArea':
                                                    return (
                                                        <>
                                                            <Form.Label>{field.label}</Form.Label>
                                                            <Form.Control
                                                                as="textarea"
                                                                rows={field.rows || 3}
                                                                id={id}
                                                                name={id}
                                                                value={values[id]}
                                                                onChange={handleChange}
                                                                isInvalid={touched[id] && (!!errors[id] || !!serverErrors[id])}
                                                            />
                                                            <Form.Control.Feedback type="invalid">{errors[id] || serverErrors[id]}</Form.Control.Feedback>
                                                        </>
                                                    );
                                                default:
                                                    return null;
                                            }
                                        })()}
                                    </Form.Group>
                                ))}
                                <Button className="w-100" type='submit'>
                                    {title}
                                </Button>
                            </Form>
                        )}
                    </Formik>
                );
            case 'retryMenu':
                return (
                    <div className="text-center">
                        <p className='p-3'>
                            Вы уверены что хотите удалить эту запись?
                        </p>
                        <Modal.Footer>
                            <Button variant="danger" onClick={delEngine}>Удалить</Button>
                            <Button variant="primary" onClick={handleClose}>Закрыть</Button>
                        </Modal.Footer>
                    </div>
                );
            default:
                return null;
        }
    };
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{title || 'Подтверждение'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderModalContent()}
                </Modal.Body>
            </Modal>
            <SuccessModal showModal={showSuccessModal} closeModal={closeUniversalModal}></SuccessModal>
        </>
    );
};

export default UniversalModal;