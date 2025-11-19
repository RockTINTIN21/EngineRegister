import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import styles from './MenuCard.module.css';
import { useState } from "react";
import {Link} from "react-router-dom";

function MenuCard({ title, img,path }) {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <Col>
            <Link to={path}>
                <Card.Body
                    className={`${styles.cardBody} p-5 text-center styles-card`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <Card.Title>
                        <img
                            className={`${styles.icon} ${isHovered ? styles.hover : ''}`}
                            src={img}
                            alt={title}
                        />
                        {title}
                    </Card.Title>
                </Card.Body>
            </Link>
        </Col>
    );
}

export default MenuCard;
