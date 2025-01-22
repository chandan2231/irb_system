import React, { useEffect } from "react";
import CommonModal from "../../components/CommonModal/Modal";
import { getMultiSiteChildProtocols } from "../../services/Dashboard/DashboardService";
import { useDispatch, useSelector } from "react-redux";

const MultisiteChildProtocol = ({ open, onClose, data = {} }) => {
    const [tableDetails, setTableDetails] = React.useState([]);
    const dispatch = useDispatch();

    // const { protocolList, loading, error, createdProtocol } = useSelector(
    //     (state) => ({
    //         error: state.dashboard.error,
    //         protocolList: state.dashboard.protocolList,
    //         loading: state.dashboard.loading,
    //         createdProtocol: state.dashboard.createdProtocol,
    //     })
    // );

    const getContentForHaveProtocolId = () => {
        return <>hiiii</>;
    };

    useEffect(() => {
        const getDetails = async () => {
            console.log(data);
            if (data?.protocolId) {
                return dispatch(getMultiSiteChildProtocols(data?.protocolId));
            }
        }
        getDetails();
    }, [dispatch, data])

    return (
        <React.Fragment>
            <CommonModal
                open={open}
                onClose={() => {
                    setTableDetails([]);
                    onClose();
                }}
                title="Multisite Child Protocol"
                subTitle=""
                content={getContentForHaveProtocolId()}
                hideSubmitButton={true}
                hideCancelButton={true}
            />
        </React.Fragment>
    );
};

export default MultisiteChildProtocol;
