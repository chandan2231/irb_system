import React, { useEffect } from "react";
import CommonModal from "../../components/CommonModal/Modal";
import Loader from "../../components/Loader";
import { getMultiSiteChildProtocols } from "../../services/Dashboard/DashboardService";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";

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
      let payload = { protocolId: data?.protocolId };
      if (data?.protocolId) {
        dispatch(getMultiSiteChildProtocols(payload));
      }
    };
    getDetails();
  }, [dispatch, data]);

  const getContentForHaveProtocolId = () => {
    return (
      <Box
        sx={{
          marginTop: "-20px",
        }}
      >
        {multiSiteChildProtocolsList?.length > 0 ? (
          <div>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Protocol ID</th>
                  <th>Assigned Applicant</th>
                  <th>Applicant Mobile No.</th>
                  <th>Applicant Email</th>
                </tr>
              </thead>
              <tbody>
                {multiSiteChildProtocolsList?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item?.protocol_id ? item?.protocol_id : "-"}</td>
                      <td>{item?.name ? item?.name : "-"}</td>
                      <td>{item?.mobile ? item?.mobile : "-"}</td>
                      <td>{item?.email ? item?.email : "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div>No Data Found</div>
        )}
      </Box>
    );
  };

  if (loader) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <CommonModal
        open={open}
        onClose={() => onClose()}
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
