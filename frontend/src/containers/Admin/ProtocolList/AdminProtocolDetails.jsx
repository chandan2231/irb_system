
import * as React from 'react';
import { useLocation } from "react-router-dom";
import ClinicalResearcherDetails from './AdminClinicalResearcherDetails'
import ContractorResearcherDetails from './AdminContractorResearcherDetails'
import MultiSiteSponsorDetails from './AdminMultiSiteSponsorDetails'

const AdminProtocolDetails = () => {
    const location = useLocation();
    const protocolTypeDetails = location.state.details
    return (
        <>
        {
            protocolTypeDetails.researchType === 'Contractor Researcher' ? (
                <ContractorResearcherDetails protocolTypeDetails = {protocolTypeDetails} />
            ) : (protocolTypeDetails.researchType === 'Multi Site Sponsor' ) ? (
                <MultiSiteSponsorDetails protocolTypeDetails = {protocolTypeDetails} />
            ) : (
                <ClinicalResearcherDetails protocolTypeDetails = {protocolTypeDetails} />
            )
        }
        </>
    )
}

export default AdminProtocolDetails