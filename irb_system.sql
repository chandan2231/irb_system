-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 14, 2024 at 06:53 PM
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
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL,
  `created_by` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TRIGGER before_update_contact_information
BEFORE UPDATE ON contact_information
FOR EACH ROW
SET NEW.updated_at = NOW();

--
-- Dumping data for table `contact_information`
--

INSERT INTO `contact_information` (`id`, `protocol_id`, `name`, `title`, `company_name`, `address`, `city`, `state`, `zip_code`, `country`, `phone_number`, `email`, `secondary_contact_name`, `secondary_contact_title`, `secondary_contact_phone_number`, `secondary_contact_email`, `created_at`, `updated_at`, `created_by`) VALUES
(1, 'IRB568918', 'sadsd', 'sadsds', 'asdsds', 'asdsads', 'sadsadsa', 'asdasdsad', 'sadsadsad', 'sadsadsd', 'sadsadsadsad', 'asdsadsadsa', 'sadsadsadsa', 'sadsadsad', 'sadsadsad', 'sadsadsa', '2024-08-09 08:40:42', '2024-08-09 08:40:42', 1);

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
  `created_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` DATETIME NOT NULL,
  `created_by` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TRIGGER before_update_informed_consent
BEFORE UPDATE ON informed_consent
FOR EACH ROW
SET NEW.updated_date = NOW();

--
-- Dumping data for table `informed_consent`
--

INSERT INTO `informed_consent` (`id`, `protocol_id`, `consent_type`, `include_icf`, `no_consent_explain`, `other_language_selection`, `participation_compensated`, `professional_translator`, `professional_translator_explain`, `created_date`, `updated_date`, `created_by`) VALUES
(1, 'IRB578940', '1,2,3,4', '', 'hgfhgfh', 'Yes', 'Yes', 'No', 'jhgfhgfhj', '2024-08-08 22:43:25', '2024-08-08 22:43:25', '1'),
(2, 'IRB578940', '', '', '', '', '', '', '', '2024-08-08 22:48:09', '2024-08-08 22:48:09', '1'),
(3, 'IRB578940', '1,2,3,4,5,6,7,8', 'No', 'Test 2', 'Yes', 'Yes', 'No', 'sfsdfdsfdsfds', '2024-08-08 22:50:46', '2024-08-08 22:50:46', '1'),
(4, 'IRB568918', '1,2,3,4,5,6,7,8', 'No', 'fsdfdsfdsfdsfsd', 'Yes', 'Yes', 'No', 'sdfdsfdsfdsfdsfsd', '2024-08-09 09:03:04', '2024-08-09 09:03:04', '1');

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
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL,
  `created_by` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TRIGGER before_update_informed_consent_process
BEFORE UPDATE ON informed_consent_process
FOR EACH ROW
SET NEW.updated_at = NOW();

--
-- Dumping data for table `informed_consent_process`
--

INSERT INTO `informed_consent_process` (`id`, `protocol_id`, `challenges_faced`, `challenges_faced_explain`, `changes_consent`, `changes_consent_explain`, `ensuring_list`, `ensuring_list_explain`, `icf_version`, `performing_consent`, `created_at`, `updated_at`, `created_by`) VALUES
(1, 'IRB578940', 'Yes', 'asdsada', 'Yes', 'asdsadsadsa', 'Yes', 'asdsadsadsa', '1', '1', '2024-08-04 00:00:00', '2024-08-04 00:00:00', '1');

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
  `created_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` DATETIME NOT NULL,
  `created_by` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TRIGGER before_update_investigator_information
BEFORE UPDATE ON investigator_information
FOR EACH ROW
SET NEW.updated_date = NOW();

--
-- Dumping data for table `investigator_information`
--

INSERT INTO `investigator_information` (`id`, `protocol_id`, `fda_audit`, `fda_audit_explain`, `fwa_number`, `investigator_email`, `investigator_name`, `investigator_research_number`, `investigators_npi`, `involved_years`, `pending_or_active_research`, `pending_or_active_research_explain`, `primary_contact`, `primary_contact_email`, `site_fwp`, `sub_investigator_email`, `sub_investigator_name`, `training_completed`, `training_completed_explain`, `created_date`, `updated_date`, `created_by`) VALUES
(1, '', 'Yes', 'Test', 'Test', 'Test', 'Test', 'Test', 'Test', 'New to research-1 year', 'Yes', 'Test', 'Test', 'Test', 'Yes', 'Test', 'Test', '1,2,3,4,8', 'Test', '2024-07-03 20:42:36', '2024-07-03 20:42:36', ''),
(2, 'IRB578940', 'Yes', 'sdfdsfdfds', 'sdfdsfdsfdsfsd', 'sdfdfds@gmail.com', 'sdfdsfd', 'sdfdsfdsfds', 'sdfdfdsfd', 'New to research-1 year', 'Yes', 'sdfdsfdsfdsfsd', 'sfdfdsfsd', 'sdfdfdfd@gmail.com', 'Yes', 'sdfdsfds@gmail.com', 'sdfdfdsf', '1,2,3,4,8', 'sdfdsfdsfdsfds', '2024-08-08 23:33:56', '2024-08-08 23:33:56', '1');

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
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NOT NULL,
  `created_by` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `investigator_instuation_info`
--

INSERT INTO `investigator_instuation_info` (`id`, `protocol_id`, `changes_explain`, `changes_law`, `changes_law_explain`, `changes_reported`, `changes_reported_explain`, `facility_any_changes`, `facility_any_changes_explain`, `facility_change_item`, `facility_changes`, `inv_or_comp`, `inv_or_comp_explain`, `inv_sit_quali`, `investigator_changes`, `created_at`, `updated_at`, `created_by`) VALUES
(1, 'IRB578940', 'sfsdfdsfdsfdsf', 'Yes', 'sdfdsfdsfdsf', 'No', 'sdfdsfdsfdsfds', 'Yes', 'sdfsdfdsfds', '1,2,3,4,5', 'Yes', 'Yes', 'sdfdsfdsfdsfsd', 'Yes', '1,2,3,4', '2024-08-04 00:00:00', '2024-08-04 00:00:00', 1);

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
  `created_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` DATETIME NOT NULL,
  `created_by` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


CREATE TRIGGER before_update_protocol_information
BEFORE UPDATE ON protocol_information
FOR EACH ROW
SET NEW.updated_date = NOW();

--
-- Dumping data for table `protocol_information`
--

INSERT INTO `protocol_information` (`id`, `protocol_id`, `protocol_title`, `protocol_number`, `study_duration`, `sponsor`, `disapproved_or_withdrawn`, `disapproved_or_withdrawn_explain`, `first_time_protocol`, `funding_source`, `oversite`, `oversite_explain`, `created_date`, `updated_date`, `created_by`) VALUES
(1, '', 'Test', 'Test', 'Test', 'Test', 'Yes', 'Test', 'No', 'Self/Investigator-Sponsor/Internally Funded', 'Yes', 'Test', '2024-07-03 20:41:20', '2024-07-03 20:41:20', ''),
(2, 'IRB578940', 'sdsdsds', 'sdsdsdsds', 'sdsdsds', 'sdsdsdsd', 'Yes', 'Test', 'No', 'Non-profit organization', 'Yes', 'Test', '2024-08-08 23:24:07', '2024-08-08 23:24:07', '1'),
(3, 'IRB568918', 'test2', 'test2', 'test2', 'test2', '', '', 'Yes', 'Non-profit organization', '', '', '2024-08-09 07:50:49', '2024-08-09 07:50:49', '1'),
(4, 'IRB568918', 'qqqqq', 'qqqqq', 'qqqqq', 'qqqqq', 'Yes', 'qqqqq', 'No', 'Non-profit organization', 'Yes', 'qqqqqq', '2024-08-09 07:54:37', '2024-08-09 07:54:37', '1');

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
  `created_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` DATETIME NOT NULL,
  `created_by` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TRIGGER before_update_protocol_procedure
BEFORE UPDATE ON protocol_procedure
FOR EACH ROW
SET NEW.updated_date = NOW();

--
-- Dumping data for table `protocol_procedure`
--

INSERT INTO `protocol_procedure` (`id`, `protocol_id`, `enrolled_group`, `enrolled_group_explain`, `enrolled_study_type`, `enrolled_subject`, `enrolled_type_explain`, `future_research`, `future_research_explain`, `recurement_method`, `recurement_method_explain`, `research_place_name_address`, `study_excluded`, `study_excluded_explain`, `created_date`, `updated_date`, `created_by`) VALUES
(1, '', '', '', '11,10', '3', '', '', '', '8,9,10', 'sdasdasd', 'ddddd', '', '', '2024-07-21 12:44:35', '2024-07-21 12:44:35', ''),
(2, 'IRB578940', '1,2,6,7,8,9', 'dsadsadsadsadsad', '1,2,3,4,5,6,7,20', 'dsfdfdsfsd', 'xzcxzcxzcxzcxzcxzc', 'Yes', 'dfdsfdsfdsfsdfs', '1,2,3,4,5,10', 'fdgfdgfdgfdgfdg', 'dfgdgfdgfdgfd', 'Yes', 'dsfdsfdsfdsfds', '2024-08-08 23:55:54', '2024-08-08 23:55:54', '1');

-- --------------------------------------------------------

--
-- Table structure for table `research_process_info`
--

CREATE TABLE `research_process_info` (
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
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL,
  `created_by` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TRIGGER before_update_research_process_info
BEFORE UPDATE ON research_process_info
FOR EACH ROW
SET NEW.updated_at = NOW();

--
-- Dumping data for table `research_process_info`
--

INSERT INTO `research_process_info` (`id`, `protocol_id`, `adverse_event_explain`, `adverse_event_not_reported_explain`, `adverse_event_submission`, `changes_not_reported_to_irb`, `discontinued_subjects`, `last_approval_change`, `last_approval_change_report`, `occured_adverse_event`, `sub_terminated_before_completion`, `sub_withdrew`, `subjecte_completed`, `subjects_enrolled`, `termination_reason_explain`, `withdrawal_reason_explain`, `created_at`, `updated_at`, `created_by`) VALUES
(1, 'IRB578940', 'sdfdsfdsfsd', 'sdfdsfdsfdsfds', 'No', 'sdfdsfdsfdsf', 'sdfdsfds', 'Yes', 'No', 'sdfdsfds', 'sdfdsfdsf', 'sdfdsfds', 'sdfdsfdsfds', 'sfdsfd', 'sdfdsfdsfds', 'sdfdsfdssadasdsadsadsadsadas', '2024-08-04 00:00:00', '2024-08-04 00:00:00', 1),
(2, 'IRB578940', 'qwewqewqewq', 'qwewqewqewq', 'No', 'qweqweqwewqewqe', 'wqewqewq', 'Yes', 'No', 'qweqwewq', 'qwewqewq', 'wqewqewq', 'qwewqewqewq', 'weqwewqe', 'qwewqewqe', 'wqewqewq', '2024-08-04 00:00:00', '2024-08-04 00:00:00', 1);

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
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL,
  `created_by` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TRIGGER before_update_risk_assessment
BEFORE UPDATE ON risk_assessment
FOR EACH ROW
SET NEW.updated_at = NOW();

--
-- Dumping data for table `risk_assessment`
--

INSERT INTO `risk_assessment` (`id`, `protocol_id`, `criteria_report`, `criteria_report_explain`, `irb_report`, `irb_report_explain`, `created_at`, `updated_at`, `created_by`) VALUES
(1, 'IRB578940', 'Yes', 'Since the date of the last approval, have you encountered any unanticipated problems? Unanticipated problems involve risks to subjects or others and include any incident, experience, or outcome that meets all of the following criteria:1. is unexpected (in terms of nature, severity, or frequency) given (a) the research procedures that are described in the protocol-related documents, such as the IRB-approved research protocol and informed consent document; and (b) the characteristics of the subject population being studied:2. is related or possibly related to a subject participation in the research; and 3. suggests that the research places subjects or others at a greater risk of harm (including physical, psychological, economic, or social harm) related to the research than was previously known or recognized.', 'Yes', 'Since the date of the last approval, has any regulatory agency including, but not limited to, the sponsor, statistical agency, medical monitor, data safety monitoring board (DSMB), or a data monitoring committee (DMC) provided any correspondence that has not yet been reported to the IRB?', '2024-08-04 00:00:00', '2024-08-04 00:00:00', 1);

-- --------------------------------------------------------

--
-- Table structure for table `study_information`
--

CREATE TABLE `study_information` (
  `id` int(100) NOT NULL,
  `protocol_id` varchar(500) NOT NULL,
  `research_type` varchar(500) NOT NULL,
  `research_type_explain` text NOT NULL,
  `created_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` DATETIME NOT NULL,
  `created_by` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TRIGGER before_update_study_information
BEFORE UPDATE ON study_information
FOR EACH ROW
SET NEW.updated_date = NOW();

--
-- Dumping data for table `study_information`
--

INSERT INTO `study_information` (`id`, `protocol_id`, `research_type`, `research_type_explain`, `created_date`, `updated_date`, `created_by`) VALUES
(1, 'IRB578940', 'Drug/biologic', '', '2024-08-08 23:41:26', '2024-08-08 23:41:26', '1'),
(2, 'IRB578940', 'Other', 'Text', '2024-08-08 23:43:35', '2024-08-08 23:43:35', '1'),
(3, 'IRB568918', 'Other', 'sfdsfdsfdsfds', '2024-08-09 08:45:08', '2024-08-09 08:45:08', '1');

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
  `created_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `mobile`, `email`, `password`, `researcher_type`, `city`, `created_date`) VALUES
(1, 'Chandan Prakash', '8553611554', 'chandanprakash2231@gmail.com', '$2a$10$JpG73pwO.oaIudL4zPbD5.PF7CviClFGbCSTcazfqrAjQ872zZUEW', 'contractor_researcher', 'Bangalore', '2024-07-28 21:03:07');

-- --------------------------------------------------------

--
-- Table structure for table `user_research`
--

CREATE TABLE `user_research` (
  `id` int(11) NOT NULL,
  `protocol_id` varchar(100) NOT NULL,
  `research_type` varchar(100) NOT NULL,
  `added_by` int(100) NOT NULL,
  `created_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_date` DATETIME NOT NULL,
  `added_timestamp` varchar(100) NOT NULL,
  `updated_timestamp` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_research`
--

INSERT INTO `user_research` (`id`, `protocol_id`, `research_type`, `added_by`, `created_date`, `updated_date`, `added_timestamp`, `updated_timestamp`) VALUES
(1, 'IRB578940', 'contractor_researcher', 1, '2024-07-28 21:03:07', '2024-07-28 21:03:07', '1722180787963', '1722180787963'),
(2, 'IRB568918', 'multi_site_sponsor', 1, '2024-07-28 21:04:25', '2024-07-28 21:04:25', '1722180865548', '1722180865548'),
(3, 'IRB756179', 'clinical_researcher', 1, '2024-07-28 21:07:26', '2024-07-28 21:07:26', '1722181046497', '1722181046497');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contact_information`
--
ALTER TABLE `contact_information`
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
-- Indexes for table `research_process_info`
--
ALTER TABLE `research_process_info`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `risk_assessment`
--
ALTER TABLE `risk_assessment`
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
-- AUTO_INCREMENT for table `contact_information`
--
ALTER TABLE `contact_information`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `informed_consent`
--
ALTER TABLE `informed_consent`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `informed_consent_process`
--
ALTER TABLE `informed_consent_process`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `investigator_information`
--
ALTER TABLE `investigator_information`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `investigator_instuation_info`
--
ALTER TABLE `investigator_instuation_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `protocol_information`
--
ALTER TABLE `protocol_information`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `protocol_procedure`
--
ALTER TABLE `protocol_procedure`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `research_process_info`
--
ALTER TABLE `research_process_info`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `risk_assessment`
--
ALTER TABLE `risk_assessment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `study_information`
--
ALTER TABLE `study_information`
  MODIFY `id` int(100) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_research`
--
ALTER TABLE `user_research`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
