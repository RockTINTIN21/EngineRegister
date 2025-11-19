import Form from 'react-bootstrap/Form';

function FormControl({ label, name, value, onChange, handleChange, formikValue, serverErrors, touched, errors }) {
    return (
        <Form.Group className="mb-3 d-flex w-100 styles-card bg-gray justify-content-between p-2 align-items-center">
            <Form.Label className="w-50 mb-0">{label}</Form.Label>
            <Form.Control
                type="text"
                name={name}
                id={name}
                value={formikValue || value || ''}
                onChange={(e) => { onChange(e); handleChange(e); }}
                className="w-100 pt-0 pb-0 ps-3"
                isInvalid={touched[name] && (!!errors[name] || !!serverErrors[name])}
            />
            <Form.Control.Feedback type="invalid">
                {errors[name] || serverErrors[name]}
            </Form.Control.Feedback>

        </Form.Group>
    );
}

export default FormControl;