import React, { useEffect } from "react";
import CommonModal from "../../components/CommonModal/Modal";
import Loader from "../../components/Loader";
import { getCTMProtocolsReport } from "../../services/Dashboard/DashboardService";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/material";
import moment from "moment";

const CTMProtocolReport = ({ open, onClose, data = {}, type }) => {
  const [loader, setLoader] = React.useState(false);
  const dispatch = useDispatch();

  const { CTMProtocolsReport, loading, error } = useSelector((state) => ({
    error: state.dashboard.error,
    CTMProtocolsReport: state.dashboard.CTMProtocolsReport,
    loading: state.dashboard.loading,
  }));

  useEffect(() => {
    const getDetails = async () => {
      let payload = { protocolId: data?.protocolId };
      if (data?.protocolId) {
        dispatch(getCTMProtocolsReport(payload));
      }
    };
    getDetails();
  }, [dispatch, data]);

  const getContentForHaveProtocolId = () => {
    return (
      <Box>
        {CTMProtocolsReport?.length > 0 ? (
          <Box sx={{ mt: 2, mr: 1 }}>
            <table className="table table-bordered">
              <thead style={{ textAlign: "left" }}>
                <tr>
                  <th>CTM Name</th>
                  <th>CTM Email</th>
                  <th>CTM Mobile</th>
                  <th>Document Type</th>
                  <th>Attachment</th>
                  <th>Added Date</th>
                </tr>
              </thead>
              <tbody>
                {CTMProtocolsReport?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item?.name ? item?.name : "-"}</td>
                      <td>{item?.email ? item?.email : "-"}</td>
                      <td>{item?.mobile ? item?.mobile : "-"}</td>
                      <td>
                        {item?.information_type ? item?.information_type : "-"}
                      </td>
                      <td>
                        {item?.file_url ? (
                          <a
                            href={item.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {"Attachment"}
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        {item?.created_at
                          ? moment(item?.created_at).format("DD-MM-YYYY")
                          : "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        ) : (
          <Box sx={{ mt: 2, mr: 1, textAlign: "center" }}>
            {(type = "ctm" ? "No report uploaded by the CTM" : "No Data Found")}
          </Box>
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
        title="External Monitor Protocol Report Details"
        subTitle={`${data?.researchType} (${data?.protocolId})`}
        content={getContentForHaveProtocolId()}
        hideSubmitButton={true}
        hideCancelButton={true}
        identifier="ctm"
      />
    </React.Fragment>
  );
};

export default CTMProtocolReport;
