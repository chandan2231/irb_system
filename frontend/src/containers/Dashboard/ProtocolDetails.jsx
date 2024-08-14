
    import * as React from 'react';
    import { useLocation } from "react-router-dom";
    import ClinicalResearcherDetails from '../Dashboard/ClinicalResearcherDetails'
    import ContractorResearcherDetails from '../Dashboard/ContractorResearcherDetails'
    import MultiSiteSponsorDetails from '../Dashboard/MultiSiteSponsorDetails'

    const ProtocolDetails = () => {
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

    export default ProtocolDetails