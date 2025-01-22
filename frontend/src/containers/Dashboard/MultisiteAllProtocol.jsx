import React, { useEffect } from "react";
import CommonModal from "../../components/CommonModal/Modal";
import Loader from "../../components/Loader";
import { getMultiSiteChildProtocols } from "../../services/Dashboard/DashboardService";
import { useDispatch, useSelector } from "react-redux";

const MultisiteChildProtocol = ({ open, onClose, data = {} }) => {
    const [loader, setLoader] = React.useState(false);
    const dispatch = useDispatch();

    const { multiSiteChildProtocolsList, loading, error } = useSelector(
        (state) => ({
            error: state.dashboard.error,
            multiSiteChildProtocolsList: state.dashboard.multiSiteChildProtocolsList,
            loading: state.dashboard.loading,
        })
    );

    useEffect(() => {
        const getDetails = async () => {
            console.log(data);
            if (data?.protocolId) {
                setLoader(true);
                dispatch(getMultiSiteChildProtocols(data?.protocolId)).then((data) => {
                    setLoader(false);
                });
            }
        }
        getDetails();
    }, [dispatch, data])

    console.group("multiSiteChildProtocolsList ====>", multiSiteChildProtocolsList)

    const getContentForHaveProtocolId = () => {
        return <>hiiii</>;
    };

    if (loader) {
        return <Loader />;
    }

    return (
        <React.Fragment>
            <CommonModal
                open={open}
                onClose={() =>
                    onClose()
                }
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
