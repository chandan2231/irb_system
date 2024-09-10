-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 05, 2024 at 06:44 PM
-- Server version: 10.1.36-MariaDB
-- PHP Version: 5.6.38

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `irb_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `adverse_event`
--

CREATE TABLE `adverse_event` (
  `id` int(11) NOT NULL,
  `protocol_id` varchar(500) NOT NULL,
  `protocol_number` varchar(500) NOT NULL,
  `adverse_event_criteria` varchar(500) NOT NULL,
  `participant_id_number` varchar(500) NOT NULL,
  `event_start_date` date NOT NULL,
  `event_end_date` date NOT NULL,
  `event_aware_date` date NOT NULL,
  `irb_report_date` date NOT NULL,
  `severity_level` varchar(500) NOT NULL,
  `unexpected_event` varchar(500) NOT NULL,
  `unexpected_event_explain` text NOT NULL,
  `event_nature` varchar(500) NOT NULL,
  `date_of_death` date NOT NULL,
  `event_nature_explain` text NOT NULL,
  `event_description` text NOT NULL,
  `event_study_relationship` varchar(500) NOT NULL,
  `study_discontinued` varchar(500) NOT NULL,
  `study_discontinued_explain` text NOT NULL,
  `person_name` varchar(500) NOT NULL,
  `email` varchar(500) NOT NULL,
  `phone` varchar(500) NOT NULL,
  `your_name` varchar(500) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '1->completed'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `adverse_event`
--

INSERT INTO `adverse_event` (`id`, `protocol_id`, `protocol_number`, `adverse_event_criteria`, `participant_id_number`, `event_start_date`, `event_end_date`, `event_aware_date`, `irb_report_date`, `severity_level`, `unexpected_event`, `unexpected_event_explain`, `event_nature`, `date_of_death`, `event_nature_explain`, `event_description`, `event_study_relationship`, `study_discontinued`, `study_discontinued_explain`, `person_name`, `email`, `phone`, `your_name`, `created_by`, `created_at`, `updated_at`, `status`) VALUES
(1, 'IRB578940', 'event_nature_explain', 'Yes', 'event_nature_explain', '2024-09-01', '2024-09-02', '2024-09-03', '2024-09-04', 'Mild (asymptomatic or mild symptoms not requiring intervention, clinical or diagnostic observations only)', 'Yes', 'event_nature_explain', 'Death', '2024-09-05', '', 'event_nature_explain', 'Unrelated (event is clearly NOT related to the study)', 'Yes', 'event_nature_explain', 'event_nature_explain', 'event_nature_explain', 'event_nature_explain', 'event_nature_explain', 2, '2024-09-04 00:00:00', '2024-09-04 00:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `clinical_consent_information`
--

CREATE TABLE `clinical_consent_information` (
  `id` int(11) NOT NULL,
  `protocol_id` varchar(100) NOT NULL,
  `principal_investigator_name` varchar(500) NOT NULL,
  `site_address` varchar(500) NOT NULL,
  `additional_site_address` varchar(500) NOT NULL,
  `primary_phone` varchar(500) NOT NULL,
  `always_primary_phone` varchar(500) NOT NULL,
  `site_electronic_consent` varchar(500) NOT NULL,
  `created_by` int(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `clinical_consent_information`
--

INSERT INTO `clinical_consent_information` (`id`, `protocol_id`, `principal_investigator_name`, `site_address`, `additional_site_address`, `primary_phone`, `always_primary_phone`, `site_electronic_consent`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'IRB756179', 'Test2', 'Test2', 'Test2', 'Test2', 'Test2', 'Yes', 2, '2024-08-28 00:00:00', '2024-08-28 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `contact_information`
--

CREATE TABLE `contact_information` (
  `id` int(11) NOT NULL,
  `protocol_id` varchar(500) NOT NULL,
  `name` varchar(500) NOT NULL,
  `title` varchar(500) NOT NULL,
  `company_name` varchar(500) NOT NULL,
  `address` varchar(500) NOT NULL,
  `city` varchar(500) NOT NULL,
  `state` varchar(500) NOT NULL,
  `zip_code` varchar(500) NOT NULL,
  `country` varchar(500) NOT NULL,
  `phone_number` varchar(500) NOT NULL,
  `email` varchar(500) NOT NULL,
  `secondary_contact_name` varchar(500) NOT NULL,
  `secondary_contact_title` varchar(500) NOT NULL,
  `secondary_contact_phone_number` varchar(500) NOT NULL,
  `secondary_contact_email` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `contact_information`
--

INSERT INTO `contact_information` (`id`, `protocol_id`, `name`, `title`, `company_name`, `address`, `city`, `state`, `zip_code`, `country`, `phone_number`, `email`, `secondary_contact_name`, `secondary_contact_title`, `secondary_contact_phone_number`, `secondary_contact_email`, `created_at`, `updated_at`, `created_by`) VALUES
(1, 'IRB568918', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', '2024-08-28 20:48:25', '2024-08-28 20:48:25', 2);

-- --------------------------------------------------------

--
-- Table structure for table `continuein_review_documents`
--

CREATE TABLE `continuein_review_documents` (
  `id` int(11) NOT NULL,
  `protocol_id` varchar(500) NOT NULL,
  `protocol_type` varchar(500) NOT NULL,
  `information_type` varchar(500) NOT NULL,
  `document_name` varchar(500) NOT NULL,
  `file_name` varchar(500) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `created_by` int(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `continuein_review_documents`
--

INSERT INTO `continuein_review_documents` (`id`, `protocol_id`, `protocol_type`, `information_type`, `document_name`, `file_name`, `file_url`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'IRB578940', 'continuein_review', 'risk_assessment', 'supporting_document', '1725004316210-651-1705563391376-ReferredTo (2).pdf', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1725004316210-651-1705563391376-ReferredTo%20%282%29.pdf', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(2, 'IRB578940', 'continuein_review', 'informed_consent_process', 'consent_form', '1725005718216-642-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2.png', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1725005718216-642-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2.png', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(3, 'IRB578940', 'continuein_review', 'informed_consent_process', 'icf_file', '1725005718206-519-1705328092698-ReferredTo.pdf', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1725005718206-519-1705328092698-ReferredTo.pdf', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(4, 'IRB578940', 'continuein_review', 'investigator_and_institution', 'q4_supporting_documents', '1725006403784-640-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2.png', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1725006403784-640-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2.png', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(5, 'IRB578940', 'continuein_review', 'investigator_and_institution', 'q1_supporting_documents', '1725006403773-331-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2 2.png', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1725006403773-331-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2%202.png', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(6, 'IRB578940', 'continuein_review', 'investigator_and_institution', 'q2_supporting_documents', '1725006403780-949-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2-removebg-preview (1).png', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1725006403780-949-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2-removebg-preview%20%281%29.png', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(7, 'IRB578940', 'continuein_review', 'investigator_and_institution', 'q3_supporting_documents', '1725006403794-968-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2-removebg-preview.png', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1725006403794-968-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2-removebg-preview.png', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(8, 'IRB578940', 'continuein_review', 'research_progress', 'q3_supporting_documents', '1725006403794-968-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2-removebg-preview.png', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1725006403794-968-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2-removebg-preview.png', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(9, 'IRB568918', 'continuein_review', 'risk_assessment', 'supporting_document', '1725551702135-642-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2 2.png', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1725551702135-642-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2%202.png', 2, '2024-09-05 00:00:00', '2024-09-05 00:00:00'),
(10, 'IRB756179', 'continuein_review', 'risk_assessment', 'supporting_document', '1725552477920-630-1705563391376-ReferredTo (2).pdf', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1725552477920-630-1705563391376-ReferredTo%20%282%29.pdf', 2, '2024-09-05 00:00:00', '2024-09-05 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `informed_consent`
--

CREATE TABLE `informed_consent` (
  `id` int(100) NOT NULL,
  `protocol_id` varchar(500) NOT NULL,
  `consent_type` varchar(500) NOT NULL,
  `include_icf` varchar(500) NOT NULL,
  `no_consent_explain` text NOT NULL,
  `other_language_selection` varchar(500) NOT NULL,
  `participation_compensated` varchar(500) NOT NULL,
  `professional_translator` varchar(500) NOT NULL,
  `professional_translator_explain` text NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `informed_consent`
--

INSERT INTO `informed_consent` (`id`, `protocol_id`, `consent_type`, `include_icf`, `no_consent_explain`, `other_language_selection`, `participation_compensated`, `professional_translator`, `professional_translator_explain`, `created_date`, `updated_date`, `created_by`) VALUES
(1, 'IRB578940', '1,2,3,4,7,6', 'Yes', 'Test', 'Yes', 'No', 'No', 'Test', '2024-08-30 08:57:36', '2024-08-30 08:57:36', '2'),
(2, 'IRB568918', '1,2,3', '', 'Test2', 'Yes', 'Yes', 'No', 'Test', '2024-08-30 10:19:30', '2024-08-30 10:19:30', '2');

-- --------------------------------------------------------

--
-- Table structure for table `informed_consent_process`
--

CREATE TABLE `informed_consent_process` (
  `id` int(11) NOT NULL,
  `protocol_id` varchar(500) NOT NULL,
  `challenges_faced` varchar(500) NOT NULL,
  `challenges_faced_explain` text NOT NULL,
  `changes_consent` varchar(500) NOT NULL,
  `changes_consent_explain` text NOT NULL,
  `ensuring_list` varchar(500) NOT NULL,
  `ensuring_list_explain` text NOT NULL,
  `icf_version` varchar(500) NOT NULL,
  `performing_consent` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `informed_consent_process`
--

INSERT INTO `informed_consent_process` (`id`, `protocol_id`, `challenges_faced`, `challenges_faced_explain`, `changes_consent`, `changes_consent_explain`, `ensuring_list`, `ensuring_list_explain`, `icf_version`, `performing_consent`, `created_at`, `updated_at`, `created_by`) VALUES
(2, 'IRB578940', 'Yes', 'Test2', 'Yes', 'Test2', 'Yes', 'Test2', 'Test2', 'Test2', '2024-08-28 00:00:00', '2024-08-28 00:00:00', '2'),
(3, 'IRB578940', 'Yes', 'consent_form', 'Yes', 'consent_form', 'Yes', 'consent_form', 'Test', 'Test2', '2024-08-30 00:00:00', '2024-08-30 00:00:00', '2');

-- --------------------------------------------------------

--
-- Table structure for table `investigator_information`
--

CREATE TABLE `investigator_information` (
  `id` int(11) NOT NULL,
  `protocol_id` varchar(100) NOT NULL,
  `fda_audit` varchar(100) NOT NULL,
  `fda_audit_explain` text NOT NULL,
  `fwa_number` varchar(100) NOT NULL,
  `investigator_email` varchar(100) NOT NULL,
  `investigator_name` varchar(100) NOT NULL,
  `investigator_research_number` varchar(100) NOT NULL,
  `investigators_npi` varchar(100) NOT NULL,
  `involved_years` varchar(100) NOT NULL,
  `pending_or_active_research` varchar(100) NOT NULL,
  `pending_or_active_research_explain` text NOT NULL,
  `primary_contact` varchar(100) NOT NULL,
  `primary_contact_email` varchar(100) NOT NULL,
  `site_fwp` varchar(100) NOT NULL,
  `sub_investigator_email` varchar(100) NOT NULL,
  `sub_investigator_name` varchar(100) NOT NULL,
  `training_completed` varchar(100) NOT NULL,
  `training_completed_explain` text NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `investigator_information`
--

INSERT INTO `investigator_information` (`id`, `protocol_id`, `fda_audit`, `fda_audit_explain`, `fwa_number`, `investigator_email`, `investigator_name`, `investigator_research_number`, `investigators_npi`, `involved_years`, `pending_or_active_research`, `pending_or_active_research_explain`, `primary_contact`, `primary_contact_email`, `site_fwp`, `sub_investigator_email`, `sub_investigator_name`, `training_completed`, `training_completed_explain`, `created_date`, `updated_date`, `created_by`) VALUES
(1, 'IRB578940', 'Yes', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'New to research-1 year', 'Yes', 'Test', 'Test', 'Test', 'Yes', 'Test', 'Test', '1,2,3,4,5,6,7,8', 'Test', '2024-08-30 08:25:09', '2024-08-30 08:25:09', '2');

-- --------------------------------------------------------

--
-- Table structure for table `investigator_instuation_info`
--

CREATE TABLE `investigator_instuation_info` (
  `id` int(11) NOT NULL,
  `protocol_id` varchar(100) NOT NULL,
  `changes_explain` text NOT NULL,
  `changes_law` varchar(500) NOT NULL,
  `changes_law_explain` text NOT NULL,
  `changes_reported` varchar(500) NOT NULL,
  `changes_reported_explain` text NOT NULL,
  `facility_any_changes` varchar(500) NOT NULL,
  `facility_any_changes_explain` text NOT NULL,
  `facility_change_item` varchar(500) NOT NULL,
  `facility_changes` varchar(500) NOT NULL,
  `inv_or_comp` varchar(500) NOT NULL,
  `inv_or_comp_explain` text NOT NULL,
  `inv_sit_quali` varchar(500) NOT NULL,
  `investigator_changes` varchar(500) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `created_by` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `investigator_instuation_info`
--

INSERT INTO `investigator_instuation_info` (`id`, `protocol_id`, `changes_explain`, `changes_law`, `changes_law_explain`, `changes_reported`, `changes_reported_explain`, `facility_any_changes`, `facility_any_changes_explain`, `facility_change_item`, `facility_changes`, `inv_or_comp`, `inv_or_comp_explain`, `inv_sit_quali`, `investigator_changes`, `created_at`, `updated_at`, `created_by`) VALUES
(1, 'IRB578940', 'Please describe the changes and explain in as much detail as possible. Please provide any solutions, whether temporary or permanent, work-arounds, and/or protocol adjustments', 'Yes', 'Have there been any changes to state or local law regarding research that affects the conduct of research', 'Yes', '', 'Yes', 'Have there been any changes in facility regulations, standard operating procedures, or standards of professional conduct?', '1,2,3,4,5', 'Yes', 'Yes', 'sdfdsfsdf', 'Yes', '1,2,3', '2024-08-30 00:00:00', '2024-08-30 00:00:00', 2);

-- --------------------------------------------------------

--
-- Table structure for table `investigator_protocol_information`
--

CREATE TABLE `investigator_protocol_information` (
  `id` int(11) NOT NULL,
  `protocol_id` varchar(100) NOT NULL,
  `investigator_name` varchar(100) NOT NULL,
  `investigator_email` varchar(100) NOT NULL,
  `sub_investigator_name` varchar(100) NOT NULL,
  `sub_investigator_email` varchar(100) NOT NULL,
  `additional_study_name` varchar(100) NOT NULL,
  `additional_study_email` varchar(100) NOT NULL,
  `site_name` varchar(100) NOT NULL,
  `site_address` varchar(500) NOT NULL,
  `more_site` varchar(500) NOT NULL,
  `site_name_address` varchar(500) NOT NULL,
  `protocol_title` varchar(500) NOT NULL,
  `protocol_number` varchar(500) NOT NULL,
  `study_criteria` varchar(500) NOT NULL,
  `subject_number` varchar(500) NOT NULL,
  `site_number` varchar(500) NOT NULL,
  `disapproved_or_withdrawn` varchar(100) NOT NULL,
  `disapproved_or_withdrawn_explain` text NOT NULL,
  `oversite` varchar(100) NOT NULL,
  `oversite_explain` text NOT NULL,
  `immediate_family` varchar(100) NOT NULL,
  `immediate_family_explain` text NOT NULL,
  `stock_ownership` varchar(100) NOT NULL,
  `stock_ownership_explain` text NOT NULL,
  `property_interest` varchar(100) NOT NULL,
  `property_interest_explain` text NOT NULL,
  `financial_agreement` varchar(100) NOT NULL,
  `financial_agreement_explain` text NOT NULL,
  `server_position` varchar(100) NOT NULL,
  `server_position_explain` text NOT NULL,
  `influence_conduct` varchar(100) NOT NULL,
  `influence_conduct_explain` text NOT NULL,
  `interest_conflict` varchar(100) NOT NULL,
  `interest_conflict_explain` text NOT NULL,
  `fda_audit` varchar(100) NOT NULL,
  `fda_audit_explain` text NOT NULL,
  `involved_years` varchar(500) NOT NULL,
  `investigators_npi` varchar(500) NOT NULL,
  `training_completed` varchar(500) NOT NULL,
  `training_completed_explain` text NOT NULL,
  `investigator_research_number` varchar(500) NOT NULL,
  `pending_or_active_research` varchar(500) NOT NULL,
  `pending_or_active_research_explain` text NOT NULL,
  `created_by` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `investigator_protocol_information`
--

INSERT INTO `investigator_protocol_information` (`id`, `protocol_id`, `investigator_name`, `investigator_email`, `sub_investigator_name`, `sub_investigator_email`, `additional_study_name`, `additional_study_email`, `site_name`, `site_address`, `more_site`, `site_name_address`, `protocol_title`, `protocol_number`, `study_criteria`, `subject_number`, `site_number`, `disapproved_or_withdrawn`, `disapproved_or_withdrawn_explain`, `oversite`, `oversite_explain`, `immediate_family`, `immediate_family_explain`, `stock_ownership`, `stock_ownership_explain`, `property_interest`, `property_interest_explain`, `financial_agreement`, `financial_agreement_explain`, `server_position`, `server_position_explain`, `influence_conduct`, `influence_conduct_explain`, `interest_conflict`, `interest_conflict_explain`, `fda_audit`, `fda_audit_explain`, `involved_years`, `investigators_npi`, `training_completed`, `training_completed_explain`, `investigator_research_number`, `pending_or_active_research`, `pending_or_active_research_explain`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'IRB756179', 'Test2', 'Test2', 'Test2', 'Test2', 'Test2', 'Test2', 'Test2', 'Test2', 'Yes', 'Test2', 'Test2', 'Test2', 'Test2', 'Test2', 'Test2', 'Yes', 'Test2', 'Yes', 'Test2', 'Yes', 'Test2', 'Yes', 'Test2', 'Yes', 'Test2', 'Yes', 'Test2', 'Yes', 'Test2', 'Yes', 'Test2', 'Yes', 'Test2', 'Yes', 'Test2', 'New to research-1 year', 'Test2', '1,2,8', 'Test2', 'Test2', 'Yes', 'Test2', '2', '2024-08-28 00:00:00', '2024-08-28 00:00:00'),
(2, 'IRB756179', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', '', '', 'Test', 'Test', 'Test', 'Test', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2', '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(3, 'IRB756179', 'sssss', 'sssss', 'sssss', '', '', '', 'sssss', 'sssss', '', '', 'sssss', 'sssss', 'ssssss', 'sssss', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '2', '2024-08-30 00:00:00', '2024-08-30 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `promptly_reportable_event`
--

CREATE TABLE `promptly_reportable_event` (
  `id` int(11) NOT NULL,
  `protocol_id` varchar(100) NOT NULL,
  `submitter_type` varchar(500) NOT NULL,
  `irb_protocol_number` varchar(500) NOT NULL,
  `sponsor_name` varchar(500) NOT NULL,
  `described_category` varchar(500) NOT NULL,
  `described_category_explain` text NOT NULL,
  `involved_subject` varchar(500) NOT NULL,
  `date_problem_discovered` date NOT NULL,
  `date_of_occurrence` date NOT NULL,
  `date_reported_to_sponsor` date NOT NULL,
  `describe_problem` text NOT NULL,
  `action_taken` text NOT NULL,
  `plan_action_taken` text NOT NULL,
  `subject_harmed` varchar(500) NOT NULL,
  `protocol_change` varchar(500) NOT NULL,
  `question_not_covered` text NOT NULL,
  `person_name` varchar(500) NOT NULL,
  `email` varchar(500) NOT NULL,
  `phone` varchar(500) NOT NULL,
  `your_name` varchar(500) NOT NULL,
  `created_by` int(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '1->completed'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `promptly_reportable_event`
--

INSERT INTO `promptly_reportable_event` (`id`, `protocol_id`, `submitter_type`, `irb_protocol_number`, `sponsor_name`, `described_category`, `described_category_explain`, `involved_subject`, `date_problem_discovered`, `date_of_occurrence`, `date_reported_to_sponsor`, `describe_problem`, `action_taken`, `plan_action_taken`, `subject_harmed`, `protocol_change`, `question_not_covered`, `person_name`, `email`, `phone`, `your_name`, `created_by`, `created_at`, `updated_at`, `status`) VALUES
(1, 'IRB578940', 'Site', 'Test', 'Test', 'Other', 'Test', 'Yes', '2024-09-01', '2024-09-02', '2024-09-03', 'Test', 'Test', 'Test', 'Yes', 'Yes', 'Test', 'Test', 'Test', 'Test', 'Test', 2, '2024-09-04 00:00:00', '2024-09-04 00:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `protocol_documents`
--

CREATE TABLE `protocol_documents` (
  `id` int(11) NOT NULL,
  `protocol_id` varchar(500) NOT NULL,
  `protocol_type` varchar(500) NOT NULL,
  `information_type` varchar(500) NOT NULL,
  `document_name` varchar(500) NOT NULL,
  `file_name` varchar(500) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `created_by` int(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `protocol_documents`
--

INSERT INTO `protocol_documents` (`id`, `protocol_id`, `protocol_type`, `information_type`, `document_name`, `file_name`, `file_url`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'IRB578940', 'Contractor Researcher', 'protocol_information', 'protocol', '1724953218046-682-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2 2.png', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1724953218046-682-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2%202.png', 2, '2024-08-29 00:00:00', '2024-08-29 00:00:00'),
(2, 'IRB578940', 'Contractor Researcher', 'investigator_information', 'investigator_cv', '1724986505103-788-1724934887079-704-1705563391376-ReferredTo (2).pdf', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1724986505103-788-1724934887079-704-1705563391376-ReferredTo%20%282%29.pdf', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(3, 'IRB578940', 'Contractor Researcher', 'investigator_information', 'investigator_cv', '1724986506868-197-A screenshot of a phone__Description automatically generated.jpeg', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1724986506868-197-A%20screenshot%20of%20a%20phone__Description%20automatically%20generated.jpeg', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(4, 'IRB578940', 'Contractor Researcher', 'investigator_information', 'medical_license', '1724986507753-143-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2-removebg-preview (1).png', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1724986507753-143-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2-removebg-preview%20%281%29.png', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(5, 'IRB578940', 'Contractor Researcher', 'investigator_information', 'training_certificates', '1724986509063-412-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2 2.png', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1724986509063-412-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2%202.png', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(6, 'IRB578940', 'Contractor Researcher', 'study_information', 'ingredient_list', '1724987164989-240-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2 2.png', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1724987164989-240-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2%202.png', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(7, 'IRB578940', 'Contractor Researcher', 'informed_consent', 'consent_files', '1724988454233-85-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2 2.png', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1724988454233-85-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2%202.png', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(8, 'IRB578940', 'Contractor Researcher', 'informed_consent', 'consent_files', '1724988455139-593-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2-removebg-preview (1).png', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1724988455139-593-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2-removebg-preview%20%281%29.png', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(9, 'IRB578940', 'Contractor Researcher', 'protocol_procedure', 'subject_facing_materials', '1724990446725-812-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2 2.png', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1724990446725-812-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2%202.png', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(10, 'IRB578940', 'Contractor Researcher', 'protocol_procedure', 'subject_facing_materials', '1724990447809-689-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2-removebg-preview (1).png', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1724990447809-689-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2-removebg-preview%20%281%29.png', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(11, 'IRB578940', 'Contractor Researcher', 'protocol_procedure', 'subject_facing_materials', '1724990721022-409-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2 2.png', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1724990721022-409-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2%202.png', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(12, 'IRB568918', 'Multi Site Sponsor', 'protocol_information', 'protocol', '1724991542856-475-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2 2.png', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1724991542856-475-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2%202.png', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(13, 'IRB568918', 'Multi Site Sponsor', 'informed_consent', 'consent_files', '1724993368835-558-1705328092698-ReferredTo.pdf', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1724993368835-558-1705328092698-ReferredTo.pdf', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(14, 'IRB568918', 'Multi Site Sponsor', 'protocol_procedure', 'subject_facing_materials', '1724998258041-804-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2.png', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1724998258041-804-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2.png', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(15, 'IRB756179', 'Clinical Researcher', 'investigator_protocol_information', 'investigator_cv', '1725000645256-925-1724934887079-704-1705563391376-ReferredTo (2).pdf', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1725000645256-925-1724934887079-704-1705563391376-ReferredTo%20%282%29.pdf', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(16, 'IRB756179', 'Clinical Researcher', 'investigator_protocol_information', 'investigator_cv', '1725000646641-432-A screenshot of a phone__Description automatically generated.jpeg', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1725000646641-432-A%20screenshot%20of%20a%20phone__Description%20automatically%20generated.jpeg', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(17, 'IRB756179', 'Clinical Researcher', 'investigator_protocol_information', 'investigator_cv', '1725000763288-632-A screenshot of a phone__Description automatically generated.jpeg', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1725000763288-632-A%20screenshot%20of%20a%20phone__Description%20automatically%20generated.jpeg', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(18, 'IRB756179', 'Clinical Researcher', 'investigator_protocol_information', 'medical_license', '1725000764259-547-1724934887079-704-1705563391376-ReferredTo (2).pdf', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1725000764259-547-1724934887079-704-1705563391376-ReferredTo%20%282%29.pdf', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(19, 'IRB756179', 'Clinical Researcher', 'investigator_protocol_information', 'training_certificates', '1725000765568-490-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2.png', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1725000765568-490-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2.png', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00'),
(20, 'IRB568918', 'Multi Site Sponsor', 'study_information', 'ingredient_list', '1724987164989-240-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2 2.png', 'https://dev-patient-reports.s3.us-east-2.amazonaws.com/public/images/1724987164989-240-360_F_770290178_BwtN1NmmYkHKCITzw5nkMDQhkX6z5ME2%202.png', 2, '2024-08-30 00:00:00', '2024-08-30 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `protocol_information`
--

CREATE TABLE `protocol_information` (
  `id` int(100) NOT NULL,
  `protocol_id` varchar(500) NOT NULL,
  `protocol_title` varchar(500) NOT NULL,
  `protocol_number` varchar(500) NOT NULL,
  `study_duration` varchar(500) NOT NULL,
  `sponsor` varchar(500) NOT NULL,
  `disapproved_or_withdrawn` varchar(500) NOT NULL,
  `disapproved_or_withdrawn_explain` text NOT NULL,
  `first_time_protocol` varchar(500) NOT NULL,
  `funding_source` varchar(500) NOT NULL,
  `oversite` varchar(500) NOT NULL,
  `oversite_explain` text NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `protocol_information`
--

INSERT INTO `protocol_information` (`id`, `protocol_id`, `protocol_title`, `protocol_number`, `study_duration`, `sponsor`, `disapproved_or_withdrawn`, `disapproved_or_withdrawn_explain`, `first_time_protocol`, `funding_source`, `oversite`, `oversite_explain`, `created_date`, `updated_date`, `created_by`) VALUES
(1, 'IRB578940', 'Test', 'Test', 'Test', 'Test', '', '', 'Yes', 'U.S. Federal Grant', '', '', '2024-08-29 23:10:20', '2024-08-29 23:10:20', '2'),
(2, 'IRB568918', 'Test2', 'Test2', 'Test2', 'Test2', 'Yes', 'Multi Site Sponsor ', 'No', 'Industry', 'Yes', 'Multi Site Sponsor ', '2024-08-30 09:49:03', '2024-08-30 09:49:03', '2');

-- --------------------------------------------------------

--
-- Table structure for table `protocol_procedure`
--

CREATE TABLE `protocol_procedure` (
  `id` int(11) NOT NULL,
  `protocol_id` varchar(500) NOT NULL,
  `enrolled_group` varchar(500) NOT NULL,
  `enrolled_group_explain` text NOT NULL,
  `enrolled_study_type` varchar(500) NOT NULL,
  `enrolled_subject` varchar(500) NOT NULL,
  `enrolled_type_explain` text NOT NULL,
  `future_research` varchar(500) NOT NULL,
  `future_research_explain` text NOT NULL,
  `recurement_method` varchar(500) NOT NULL,
  `recurement_method_explain` text NOT NULL,
  `research_place_name_address` varchar(500) NOT NULL,
  `study_excluded` varchar(500) NOT NULL,
  `study_excluded_explain` text NOT NULL,
  `irb_approval` varchar(100) NOT NULL,
  `expected_number_sites` varchar(500) NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `protocol_procedure`
--

INSERT INTO `protocol_procedure` (`id`, `protocol_id`, `enrolled_group`, `enrolled_group_explain`, `enrolled_study_type`, `enrolled_subject`, `enrolled_type_explain`, `future_research`, `future_research_explain`, `recurement_method`, `recurement_method_explain`, `research_place_name_address`, `study_excluded`, `study_excluded_explain`, `irb_approval`, `expected_number_sites`, `created_date`, `updated_date`, `created_by`) VALUES
(1, 'IRB568918', '1,2,3,4,5,6,7,9', 'Test2', '1,2,3,4,5,20', 'Test2', 'Test2', 'Yes', 'Test2', '1,2,3,10', 'Test2', '', 'Yes', 'Test2', 'Yes', 'Test2', '2024-08-30 11:40:59', '2024-08-30 11:40:59', '2'),
(2, 'IRB578940', '1,2,3,4,5,6,7,9', 'Test2', '1,2,3,4,5,20', 'Test2', 'Test2', 'Yes', 'Test2', '1,2,3,10', 'Test2', '', 'Yes', 'Test2', 'Yes', 'Test2', '2024-08-30 11:40:59', '2024-08-30 11:40:59', '2');

-- --------------------------------------------------------

--
-- Table structure for table `research_progress_info`
--

CREATE TABLE `research_progress_info` (
  `id` int(11) NOT NULL,
  `protocol_id` varchar(500) NOT NULL,
  `adverse_event_explain` text NOT NULL,
  `adverse_event_not_reported_explain` text NOT NULL,
  `adverse_event_submission` varchar(500) NOT NULL,
  `changes_not_reported_to_irb` varchar(500) NOT NULL,
  `discontinued_subjects` varchar(500) NOT NULL,
  `last_approval_change` varchar(500) NOT NULL,
  `last_approval_change_report` varchar(500) NOT NULL,
  `occured_adverse_event` varchar(500) NOT NULL,
  `sub_terminated_before_completion` varchar(500) NOT NULL,
  `sub_withdrew` varchar(500) NOT NULL,
  `subjecte_completed` varchar(500) NOT NULL,
  `subjects_enrolled` varchar(500) NOT NULL,
  `termination_reason_explain` text NOT NULL,
  `withdrawal_reason_explain` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `research_progress_info`
--

INSERT INTO `research_progress_info` (`id`, `protocol_id`, `adverse_event_explain`, `adverse_event_not_reported_explain`, `adverse_event_submission`, `changes_not_reported_to_irb`, `discontinued_subjects`, `last_approval_change`, `last_approval_change_report`, `occured_adverse_event`, `sub_terminated_before_completion`, `sub_withdrew`, `subjecte_completed`, `subjects_enrolled`, `termination_reason_explain`, `withdrawal_reason_explain`, `created_at`, `updated_at`, `created_by`) VALUES
(2, 'IRB578940', 'qwewqewqewq', 'qwewqewqewq', 'No', 'qweqweqwewqewqe', 'wqewqewq', 'Yes', 'No', 'qweqwewq', '2', '2', 'qwewqewqewq', 'weqwewqe', 'qwewqewqe', 'wqewqewq', '2024-08-04 00:00:00', '2024-08-04 00:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `risk_assessment`
--

CREATE TABLE `risk_assessment` (
  `id` int(11) NOT NULL,
  `protocol_id` varchar(100) NOT NULL,
  `criteria_report` varchar(100) NOT NULL,
  `criteria_report_explain` text NOT NULL,
  `irb_report` varchar(100) NOT NULL,
  `irb_report_explain` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `risk_assessment`
--

INSERT INTO `risk_assessment` (`id`, `protocol_id`, `criteria_report`, `criteria_report_explain`, `irb_report`, `irb_report_explain`, `created_at`, `updated_at`, `created_by`) VALUES
(1, 'IRB578940', 'Yes', 'Since the date of the last approval, have you encountered any unanticipated problems? Unanticipated problems involve risks to subjects or others and include any incident, experience, or outcome that meets all of the following criteria:\n1. is unexpected (in terms of nature, severity, or frequency) given (a) the research procedures that are described in the protocol-related documents, such as the IRB-approved research protocol and informed consent document; and (b) the characteristics of the subject population being studied:\n2. is related or possibly related to a subject’s participation in the research; and\n3. suggests that the research places subjects or others at a greater risk of harm (including physical, psychological, economic, or social harm) related to the research than was previously known or recognized.', 'Yes', 'Since the date of the last approval, has any regulatory agency including, but not limited to, the sponsor, statistical agency, medical monitor, data safety monitoring board (DSMB), or a data monitoring committee (DMC) provided any correspondence that has not yet been reported to the IRB?', '2024-08-30 00:00:00', '2024-08-30 00:00:00', 2),
(2, 'IRB568918', 'Yes', 'Test', 'Yes', 'sdsadsadas', '2024-09-05 00:00:00', '2024-09-05 00:00:00', 2),
(3, 'IRB756179', 'No', '', 'No', '', '2024-09-05 00:00:00', '2024-09-05 00:00:00', 2);

-- --------------------------------------------------------

--
-- Table structure for table `study_closeout_request`
--

CREATE TABLE `study_closeout_request` (
  `id` int(11) NOT NULL,
  `protocol_id` varchar(100) NOT NULL,
  `protocol_number` varchar(500) NOT NULL,
  `pi_name` varchar(500) NOT NULL,
  `study_completion_date` date NOT NULL,
  `study_closeout_reason` varchar(500) NOT NULL,
  `study_closeout_reason_other` text NOT NULL,
  `subject_enrolled_number` varchar(500) NOT NULL,
  `subject_withdrew_number` varchar(500) NOT NULL,
  `subject_withdrew_by_other` varchar(500) NOT NULL,
  `subject_fails` varchar(500) NOT NULL,
  `subject_lost_followup` varchar(500) NOT NULL,
  `subject_completed` varchar(500) NOT NULL,
  `subject_complaints_review` varchar(500) NOT NULL,
  `subject_complaints_review_explain` text NOT NULL,
  `not_reported_irb` varchar(500) NOT NULL,
  `not_reported_irb_explain` text NOT NULL,
  `promptly_reportable_info` varchar(500) NOT NULL,
  `adverse_event_info` varchar(500) NOT NULL,
  `your_name` varchar(500) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '1->completed'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `study_closeout_request`
--

INSERT INTO `study_closeout_request` (`id`, `protocol_id`, `protocol_number`, `pi_name`, `study_completion_date`, `study_closeout_reason`, `study_closeout_reason_other`, `subject_enrolled_number`, `subject_withdrew_number`, `subject_withdrew_by_other`, `subject_fails`, `subject_lost_followup`, `subject_completed`, `subject_complaints_review`, `subject_complaints_review_explain`, `not_reported_irb`, `not_reported_irb_explain`, `promptly_reportable_info`, `adverse_event_info`, `your_name`, `created_by`, `created_at`, `updated_at`, `status`) VALUES
(1, 'IRB578940', 'Test', 'Test', '2024-09-04', 'Other', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'Yes', 'Test', 'Yes', 'Test', 'Yes', 'Yes', 'Test', 2, '2024-09-04 00:00:00', '2024-09-04 00:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `study_information`
--

CREATE TABLE `study_information` (
  `id` int(100) NOT NULL,
  `protocol_id` varchar(500) NOT NULL,
  `research_type` varchar(500) NOT NULL,
  `research_type_explain` text NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `study_information`
--

INSERT INTO `study_information` (`id`, `protocol_id`, `research_type`, `research_type_explain`, `created_date`, `updated_date`, `created_by`) VALUES
(1, 'IRB578940', 'Other', 'Test', '2024-08-30 08:36:06', '2024-08-30 08:36:06', '2'),
(2, 'IRB568918', 'Other', 'Test', '2024-08-30 08:36:06', '2024-08-30 08:36:06', '2');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `mobile` varchar(100) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(200) NOT NULL,
  `researcher_type` varchar(200) NOT NULL,
  `city` varchar(45) DEFAULT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `mobile`, `email`, `password`, `researcher_type`, `city`, `created_date`) VALUES
(1, 'Suresh Kumar', '0000000000', 'neuroheadachecenter@gmail.com', '$2a$10$u03.xr3/FXiEjzKdZ4LnZeTDnNLw/1gADQ9PSGta4c6l35Dm4kXDa', 'admin', 'USA', '2024-08-16 21:46:29'),
(2, 'Chandan Prakash', '8553611554', 'chandanprakash2231@gmail.com', '$2a$10$u03.xr3/FXiEjzKdZ4LnZeTDnNLw/1gADQ9PSGta4c6l35Dm4kXDa', 'contractor_researcher', 'Bangalore', '2024-08-16 21:48:31');

-- --------------------------------------------------------

--
-- Table structure for table `user_research`
--

CREATE TABLE `user_research` (
  `id` int(11) NOT NULL,
  `protocol_id` varchar(100) NOT NULL,
  `research_type` varchar(100) NOT NULL,
  `added_by` int(100) NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `added_timestamp` varchar(100) NOT NULL,
  `updated_timestamp` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_research`
--

INSERT INTO `user_research` (`id`, `protocol_id`, `research_type`, `added_by`, `created_date`, `updated_date`, `added_timestamp`, `updated_timestamp`) VALUES
(1, 'IRB578940', 'clinical_site', 2, '2024-07-28 21:03:07', '2024-07-28 21:03:07', '1722180787963', '1722180787963'),
(2, 'IRB568918', 'multi_site_sponsor', 2, '2024-07-28 21:04:25', '2024-07-28 21:04:25', '1722180865548', '1722180865548'),
(3, 'IRB756179', 'principal_investigator', 2, '2024-07-28 21:07:26', '2024-07-28 21:07:26', '1722181046497', '1722181046497'),
(5, 'IRB370305', 'clinical_site', 2, '2024-08-16 21:48:31', '2024-08-16 21:48:31', '1723825111805', '1723825111805'),
(6, 'IRB739836', 'principal_investigator', 2, '2024-09-03 16:27:56', '2024-09-03 16:27:56', '1725361076313', '1725361076313'),
(7, 'IRB346884', 'multi_site_sponsor', 2, '2024-09-03 16:32:16', '2024-09-03 16:32:16', '1725361336498', '1725361336498'),
(8, 'IRB134497', 'principal_investigator', 2, '2024-09-03 20:35:07', '2024-09-03 20:35:07', '1725375907469', '1725375907469'),
(9, 'IRB406192', 'clinical_site', 2, '2024-09-03 20:35:20', '2024-09-03 20:35:20', '1725375920767', '1725375920767'),
(10, 'IRB505630', 'multi_site_sponsor', 2, '2024-09-03 20:35:32', '2024-09-03 20:35:32', '1725375932341', '1725375932341'),
(11, 'IRB820097', 'clinical_site', 2, '2024-09-05 21:05:34', '2024-09-05 21:05:34', '1725550534050', '1725550534050');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adverse_event`
--
ALTER TABLE `adverse_event`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `clinical_consent_information`
--
ALTER TABLE `clinical_consent_information`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_information`
--
ALTER TABLE `contact_information`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `continuein_review_documents`
--
ALTER TABLE `continuein_review_documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `informed_consent`
--
ALTER TABLE `informed_consent`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `informed_consent_process`
--
ALTER TABLE `informed_consent_process`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `investigator_information`
--
ALTER TABLE `investigator_information`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `investigator_instuation_info`
--
ALTER TABLE `investigator_instuation_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `investigator_protocol_information`
--
ALTER TABLE `investigator_protocol_information`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `promptly_reportable_event`
--
ALTER TABLE `promptly_reportable_event`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `protocol_documents`
--
ALTER TABLE `protocol_documents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `protocol_information`
--
ALTER TABLE `protocol_information`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `protocol_procedure`
--
ALTER TABLE `protocol_procedure`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `research_progress_info`
--
ALTER TABLE `research_progress_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `risk_assessment`
--
ALTER TABLE `risk_assessment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `study_closeout_request`
--
ALTER TABLE `study_closeout_request`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `study_information`
--
ALTER TABLE `study_information`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_research`
--
ALTER TABLE `user_research`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adverse_event`
--
ALTER TABLE `adverse_event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `clinical_consent_information`
--
ALTER TABLE `clinical_consent_information`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `contact_information`
--
ALTER TABLE `contact_information`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `continuein_review_documents`
--
ALTER TABLE `continuein_review_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `informed_consent`
--
ALTER TABLE `informed_consent`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `informed_consent_process`
--
ALTER TABLE `informed_consent_process`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `investigator_information`
--
ALTER TABLE `investigator_information`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `investigator_instuation_info`
--
ALTER TABLE `investigator_instuation_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `investigator_protocol_information`
--
ALTER TABLE `investigator_protocol_information`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `promptly_reportable_event`
--
ALTER TABLE `promptly_reportable_event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `protocol_documents`
--
ALTER TABLE `protocol_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `protocol_information`
--
ALTER TABLE `protocol_information`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `protocol_procedure`
--
ALTER TABLE `protocol_procedure`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `research_progress_info`
--
ALTER TABLE `research_progress_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `risk_assessment`
--
ALTER TABLE `risk_assessment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `study_closeout_request`
--
ALTER TABLE `study_closeout_request`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `study_information`
--
ALTER TABLE `study_information`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_research`
--
ALTER TABLE `user_research`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
