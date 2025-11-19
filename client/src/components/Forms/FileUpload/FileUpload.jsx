import React from 'react';
import { useFormikContext } from 'formik';
import Form from 'react-bootstrap/Form';

function FileUpload({ name, label, applyStyles = false }) {
    const { setFieldValue, errors, touched } = useFormikContext();

    const handleFileChange = (event) => {
        setFieldValue(name, event.currentTarget.files[0]);
    };

    return (
        <Form.Group
            controlId="formFile"
            className={applyStyles ? "mb-3 p-2 w-100 bg-gray styles-card" : ""}
        >
            <Form.Label>{label}</Form.Label>
            <Form.Control
                className='w-100'
                accept=".png, .jpg, .jpeg"
                type="file"
                onChange={handleFileChange}  // Обработчик изменения файла
            />
            {touched[name] && errors[name] && (
                <div className="error">{errors[name]}</div>
            )}
        </Form.Group>
    );
}

export default FileUpload;
