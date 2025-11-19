import MenuHeader from "../components/MenuHeader/MenuHeader.jsx";
import Row from 'react-bootstrap/Row';
import MenuCard from "../components/MenuCard/MenuCard.jsx";
import StorageOfAggregatesIcon from '../assets/icons/StorageOfAggregatesIcon.svg'
import AddressableStorage from '../assets/icons/AddressableStorage.svg'
import AggregateJournal from '../assets/icons/AggregateJournal.svg'
import RepairSchedule from '../assets/icons/RepairSchedule.svg'
function Menu(){
    return(
        <>
            <MenuHeader title="Меню"/>
            <Row xs={1} md={2} className="g-4 pt-5">
                <MenuCard title="Склад агрегатов" img={StorageOfAggregatesIcon}/>
                <MenuCard title="Адресное хранение" img={AddressableStorage}/>
                <MenuCard title="Агрегатный журнал" img={AggregateJournal} path="/AggregateJournal" element={<AggregateJournal/>}/>
                <MenuCard title="Состояние проката. График ремонтов" img={RepairSchedule}/>
            </Row>
        </>
    )
}
export default Menu;