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
      let payload = { protocolId: data?.protocolId };
      if (data?.protocolId) {
        setLoader(true);
        dispatch(getMultiSiteChildProtocols(payload)).then((data) => {
          setLoader(false);
        });
      }
    };
    getDetails();
  }, [dispatch, data]);

  console.group(
    "multiSiteChildProtocolsList ====>",
    multiSiteChildProtocolsList
  );

  const getContentForHaveProtocolId = () => {
    return (
      <div>
        {multiSiteChildProtocolsList?.length > 0 ? (
          <div>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Protocol ID</th>
                  <th>Protocol Name</th>
                  <th>Protocol Version</th>
                  <th>Protocol Status</th>
                </tr>
              </thead>
              <tbody>
                {multiSiteChildProtocolsList?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item?.protocolId}</td>
                      <td>{item?.protocolName}</td>
                      <td>{item?.protocolVersion}</td>
                      <td>{item?.protocolStatus}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div>No Data Found</div>
        )}
      </div>
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
