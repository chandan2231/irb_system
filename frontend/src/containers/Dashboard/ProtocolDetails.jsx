import * as React from "react";
import { useLocation } from "react-router-dom";
import ClinicalResearcherDetails from "../Dashboard/ClinicalResearcherDetails";
import ContractorResearcherDetails from "../Dashboard/ContractorResearcherDetails";
import MultiSiteSponsorDetails from "../Dashboard/MultiSiteSponsorDetails";
import { fetchProtocolDetailsById } from "../../services/Admin/ProtocolListService";
import { useDispatch, useSelector } from "react-redux";

export const RESERCH_TYPE = {
  CLINICAL_SITE: 'Clinical Site',
  MULTI_SITE_SPONSOR: 'Multi-Site Sponsor',
  CLINICAL_RESEARCHER: 'Clinical Researcher'
}

const renderComponentWithResearchType = (protocolTypeDetails, protocolDetailsById) => {
  switch (protocolTypeDetails.researchType) {
    case RESERCH_TYPE.CLINICAL_SITE:
      return (
        <ContractorResearcherDetails
          protocolTypeDetails={protocolTypeDetails}
          protocolDetailsById={protocolDetailsById}
        />
      )
    case RESERCH_TYPE.MULTI_SITE_SPONSOR:
      return (
        <MultiSiteSponsorDetails
          protocolTypeDetails={protocolTypeDetails}
          protocolDetailsById={protocolDetailsById}
        />
      )
    default:
      return (
        <ClinicalResearcherDetails
          protocolTypeDetails={protocolTypeDetails}
          protocolDetailsById={protocolDetailsById}
        />
      )
  }
}

const ProtocolDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const protocolTypeDetails = location.state.details;
  const [user, setUser] = React.useState([]);
  React.useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    if (userDetails) {
      setUser(userDetails);
    }
  }, []);

  React.useEffect(() => {
    let data = {
      protocolId: protocolTypeDetails?.protocolId,
      protocolType: protocolTypeDetails?.researchType,
    };
    dispatch(fetchProtocolDetailsById(data));
  }, [dispatch, user.id]);

  const { protocolDetailsById, loading, error } = useSelector((state) => ({
    error: state.admin.error,
    protocolDetailsById: state.admin.protocolDetailsById,
    loading: state.admin.loading,
  }));
  // here
  return (
    <React.Fragment>
      {renderComponentWithResearchType(protocolTypeDetails, protocolDetailsById)}
    </React.Fragment>
  );
};

export default ProtocolDetails;
