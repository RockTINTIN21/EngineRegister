import Form from 'react-bootstrap/Form';

function FormSelect({ label, name, options, value, onChange,handleChange,formikValue,serverErrors, touched, errors  }){
    // Определяем класс для всего <select> на основе выбранного значения
    let selectClass = '';
    if (value === 'В кап. рем') {
        selectClass = 'bgHeavyRepair';
    } else if (value === 'Готов') {
        selectClass = 'bgReady';
    } else if (value === 'В ср. рем') {
        selectClass = 'bgLowRepair';
    }

    return (
        <Form.Group className="mb-3 d-flex w-100 styles-card bg-gray justify-content-between p-2 align-items-center">
            <Form.Label className="w-50 mb-0">{label}</Form.Label>
            <Form.Select
                name={name}
                value={formikValue || value || ''}
                onChange={(e)=> {onChange(e); handleChange(e)}}
                className={`w-100 pt-0 pb-0 ps-3 ${selectClass}`}
                isInvalid={touched[name] && (!!errors[name] || !!serverErrors[name])}
            >
                {options.map((option, index) => {
                    // Определяем класс для каждого <option>
                    let optionClass = '';
                    if (option === 'В кап. рем') {
                        optionClass = 'bgHeavyRepair';
                    } else if (option === 'Готов') {
                        optionClass = 'bgReady';
                    } else if (option === 'В ср. рем') {
                        optionClass = 'bgLowRepair';
                    }

                    return (
                        <option key={index} value={option} className={optionClass}>
                            {option}
                        </option>
                    );
                })}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
                {errors[name] || serverErrors[name]}
            </Form.Control.Feedback>
        </Form.Group>
    );
}

export default FormSelect;
