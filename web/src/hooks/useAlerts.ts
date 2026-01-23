import { useContext } from "react";
import { AlertContext } from "../context/AlertProvider";

/*
const { setAlert } = useAlerts();

setAlert({
    type: AppAlertType.ERROR,
    message: 'Failed to load dashboard data',
})
*/

const useAlerts = () => useContext(AlertContext);

export default useAlerts;