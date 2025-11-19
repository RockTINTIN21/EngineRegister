
// import styles from './MenuCard.module.css';
import { useState } from "react";
import successIcon from '../../../assets/icons/mark.png';

import { Modal, Button } from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import {Formik} from "formik";

const SuccessModal = ({ showModal, handleClose,closeModal}) => {
    return(
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Успешно</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center">
                    <h4>Успешно!</h4>
                    <img src={successIcon} alt="successIcon"/>
                    <div className='w-100 pt-3'><Button onClick={closeModal} className='w-100'>
                        Понятно
                    </Button></div>
                </div>
            </Modal.Body>
        </Modal>
    )
};

export default SuccessModal;



