import { useEffect, useState } from "react";
import { getFetchData } from "../../../../Validation.js";
import Form from "react-bootstrap/Form";

function SyncSelectMenu({ value, onChange, touched, errors, isPassport, defValueInstallationPlace, defValueLocation,onChangeValue }) {
    const [data, setData] = useState(null);
    const [positions, setPositions] = useState(['']);
    const [installationLocations, setInstallationLocations] = useState(['']);

    const getFromServer = async () => {
        const response = await getFetchData('getPositions');
        if (response && response.status === 'error') {
            console.log('Ошибка:', response.error);
        } else {
            setData(response.data);
            setPositions(response.data.map(p => p.position));
            if (response.data.length > 0) {
                setInstallationLocations(response.data[0].installationPlaces || []);
            }
        }
    };

    useEffect(() => {
        getFromServer();
    }, []);

    useEffect(() => {
        if (isPassport && data) {
            // Устанавливаем значение по умолчанию для позиции
            if (defValueLocation && positions.includes(defValueLocation)) {
                onChange({
                    target: {
                        name: 'position',
                        value: defValueLocation
                    }
                });
            }
        }
    }, [data, isPassport, defValueLocation, positions, onChange]);

    useEffect(() => {
        if (isPassport && value.position && data) {
            // Устанавливаем значение по умолчанию для места установки
            const selectedData = data.find(item => item.position === value.position);
            if (selectedData) {
                const newInstallationLocations = selectedData.installationPlaces || [];
                setInstallationLocations(newInstallationLocations);

                if (defValueInstallationPlace && newInstallationLocations.includes(defValueInstallationPlace)) {
                    onChange({
                        target: {
                            name: 'installationPlace',
                            value: defValueInstallationPlace
                        }
                    });
                } else if (newInstallationLocations.length > 0) {
                    onChange({
                        target: {
                            name: 'installationPlace',
                            value: newInstallationLocations[0]
                        }
                    });
                }
            }
        }
    }, [data, isPassport, value.position, defValueInstallationPlace, onChange]);

    const handleChangePosition = (e) => {
        const selectedPosition = e.target.value;
        const selectedData = data.find(item => item.position === selectedPosition);
        if (selectedData) {
            const newInstallationLocations = selectedData.installationPlaces || [];
            setInstallationLocations(newInstallationLocations);

            // Устанавливаем значение по умолчанию для места установки
            if (newInstallationLocations.length > 0) {
                onChange({
                    target: {
                        name: 'installationPlace',
                        value: newInstallationLocations[0]
                    }
                });
            }
        }
    };

    if (!data) {
        return <div className='text-center'><h1>Загрузка...</h1></div>;
    }

    const groupClass = isPassport ?
        "d-flex w-100 styles-card bg-gray justify-content-between p-2 align-items-center mb-3" :
        "mb-3";

    const selectClass = "w-100 pt-0 pb-0 ps-3";

    return (
        <>
            <Form.Group className={groupClass}>
                <Form.Label className="w-50 mb-0">Местонахождение:</Form.Label>
                <Form.Select
                    id='position'
                    name='position'
                    value={value.position || ''}
                    onChange={(e) => { onChange(e); handleChangePosition(e);}}
                    isInvalid={touched.position && !!errors.position}
                    className={selectClass}
                >
                    {positions.map((option, i) => (
                        <option key={i} value={option}>
                            {option}
                        </option>
                    ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.position}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className={groupClass}>
                <Form.Label className="w-50 mb-0">Место установки:</Form.Label>
                <Form.Select
                    id='installationPlace'
                    name='installationPlace'
                    value={value.installationPlace || ''}
                    onChange={(e)=>{onChange(e);}}
                    isInvalid={touched.installationPlace && !!errors.installationPlace}
                    className={selectClass}
                >
                    {installationLocations.map((option, i) => (
                        <option key={i} value={option}>
                            {option}
                        </option>
                    ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.installationPlace}</Form.Control.Feedback>
            </Form.Group>
        </>
    );
}

export default SyncSelectMenu;
