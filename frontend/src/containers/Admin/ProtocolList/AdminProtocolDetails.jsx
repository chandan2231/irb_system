
import * as React from 'react';
import { useLocation } from "react-router-dom";
import ClinicalResearcherDetails from './AdminClinicalResearcherDetails'
import ContractorResearcherDetails from './AdminContractorResearcherDetails'
import MultiSiteSponsorDetails from './AdminMultiSiteSponsorDetails'
import { fetchProtocolDetailsById } from '../../../services/Admin/ProtocolListService';
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";

const AdminProtocolDetails = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const protocolTypeDetails = location.state.details
    const [user, setUser] = useState([]);
    useEffect(() => {
        const userDetails = JSON.parse(localStorage.getItem('user'));
        if (userDetails) {
            setUser(userDetails);
        }
    }, []);

    useEffect(() => {
        let data = {protocolId: protocolTypeDetails?.protocolId, protocolType: protocolTypeDetails?.researchType}
        dispatch(fetchProtocolDetailsById(data));
    }, [dispatch, user.id]);

    const { protocolDetailsById, loading, error } = useSelector(
        state => ({
            error: state.admin.error,
            protocolDetailsById: state.admin.protocolDetailsById,
            loading: state.admin.loading,
        })
    );
    
    return (
        <>
        {
            protocolTypeDetails.researchType === 'Contractor Researcher' ? (
                <ContractorResearcherDetails protocolTypeDetails = {protocolTypeDetails} protocolDetailsById = {protocolDetailsById} />
            ) : (protocolTypeDetails.researchType === 'Multi Site Sponsor' ) ? (
                <MultiSiteSponsorDetails protocolTypeDetails = {protocolTypeDetails} protocolDetailsById = {protocolDetailsById} />
            ) : (
                <ClinicalResearcherDetails protocolTypeDetails = {protocolTypeDetails} protocolDetailsById = {protocolDetailsById} />
            )
        }
        </>
    )
}

export default AdminProtocolDetails