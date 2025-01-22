import React, { useEffect } from "react";
import CommonModal from "../../components/CommonModal/Modal";

const MultisiteChildProtocol = ({ open, onClose, data = {} }) => {
    const [tableDetails, setTableDetails] = React.useState([]);

    const getContentForHaveProtocolId = () => {
        return <>hiiii</>;
    };

    useEffect(() => {
        const getDetails = async () => {
            console.log(data);
            if (data?.protocolId) {
            }
        }

        getDetails();
    }, [data])

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
