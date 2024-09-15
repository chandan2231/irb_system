import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import { generatePdfFromHTML } from "../utils/pdfService.js";
import * as s3Service from "../utils/s3Service.js";
import PdfTemplates from "../templates/generate-pdf.js";

export const getProtocolList = (req, res) => {
  const que = "select * from user_research where added_by = ?";
  db.query(que, [req.body.login_id], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length >= 0) {
      return res.status(200).json(data);
    }
  });
};

// export const createProtocol = (req, res) => {
//     // CHECK RESEARCH TYPE IF EXIST
//     const que = "select * from user_research where research_type = ? AND added_by = ?"
//     db.query(que, [req.body.research_type_id, req.body.login_id], (err, data) => {
//         if (err) return res.status(500).json(err)
//         if (data.length > 0) {
//             return res.status(400).json('You have already added the selected research type, try with other')
//         }
//         // CREATE A NEW Entry
//         const protocolNumber = "IRB" + Math.floor(Math.random() * 899999 + 100000);
//         const que2 = 'insert into user_research (`protocol_id`, `research_type`, `added_by`, `added_timestamp`, `updated_timestamp`) value (?)';
//         const protocolValue = [
//             protocolNumber,
//             req.body.research_type_id,
//             req.body.login_id,
//             new Date().getTime(),
//             new Date().getTime(),
//         ]
//         db.query(que2, [protocolValue], (err2, data) => {
//             if (err2) return res.status(500).json(err2)
//             return res.status(200).json('Research type has been created.')
//         })
//     })

// }

export const createProtocol = (req, res) => {
  // CREATE A NEW Entry
  const protocolNumber = "IRB" + Math.floor(Math.random() * 899999 + 100000);
  const que2 =
    "insert into user_research (`protocol_id`, `research_type`, `added_by`, `added_timestamp`, `updated_timestamp`) value (?)";
  const protocolValue = [
    protocolNumber,
    req.body.research_type_id,
    req.body.login_id,
    new Date().getTime(),
    new Date().getTime(),
  ];
  db.query(que2, [protocolValue], (err2, data) => {
    if (err2) {
      return res.status(500).json(err2);
    } else {
      let result = {};
      result.status = 200;
      result.msg = "Research type has been created.";
      return res.json(result);
    }
  });
};

export const saveFile = async (req, res) => {
  var datetime = new Date();
  try {
    if (req.file) {
      let sRL = await s3Service.uploadFile(req.file.path);
      let imageUrl = sRL.cdnUrl;
      // Remove the file from the local server
      fs.unlinkSync(req.file.path);
      if (req.body.protocolType === "continuein_review") {
        const que2 =
          "insert into continuein_review_documents (`protocol_id`, `protocol_type`, `information_type`, `document_name`, `file_name`, `file_url`, `created_by`, `created_at`, `updated_at`) value (?)";
        const protocolValue = [
          req.body.protocolId,
          req.body.protocolType,
          req.body.informationType,
          req.body.documentName,
          req.file.filename,
          imageUrl,
          req.body.createdBy,
          datetime.toISOString().slice(0, 10),
          datetime.toISOString().slice(0, 10),
        ];
        db.query(que2, [protocolValue], (err, data) => {
          if (err) return res.status(500).json(err);
          if (data) {
            return res.status(200).json({ id: data.insertId });
          }
        });
      } else {
        const que2 =
          "insert into protocol_documents (`protocol_id`, `protocol_type`, `information_type`, `document_name`, `file_name`, `file_url`, `created_by`, `created_at`, `updated_at`) value (?)";
        const protocolValue = [
          req.body.protocolId,
          req.body.protocolType,
          req.body.informationType,
          req.body.documentName,
          req.file.filename,
          imageUrl,
          req.body.createdBy,
          datetime.toISOString().slice(0, 10),
          datetime.toISOString().slice(0, 10),
        ];
        db.query(que2, [protocolValue], (err, data) => {
          if (err) return res.status(500).json(err);
          if (data) {
            return res.status(200).json({ id: data.insertId });
          }
        });
      }
    } else {
      return res.status(400).json({ message: "No file uploaded" });
    }
  } catch (error) {
    console.log({ error });
    fs.unlinkSync(req.file?.path);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const continueinReviewGeneratePdf = async (req, res) => {
  console.log("reqreqreq", req.body);
  const continuinReviewDetailObj = {};
  const que = "select * from risk_assessment where protocol_id = ?";
  db.query(que, [req.body.protocolId], (err, data) => {
    if (data.length >= 0) {
      continuinReviewDetailObj.risk_assessment = data[0] || {};
      const docQue =
        "select * from continuein_review_documents where protocol_id = ? AND information_type = ?";
      db.query(
        docQue,
        [req.body.protocolId, "risk_assessment"],
        (err, data) => {
          if (data.length >= 0) {
            continuinReviewDetailObj.risk_assessment.documents = data || {};
          } else {
            continuinReviewDetailObj.risk_assessment.documents = [];
          }
        }
      );
      const que2 =
        "select * from informed_consent_process where protocol_id = ?";
      db.query(que2, [req.body.protocolId], (err, data) => {
        if (data.length >= 0) {
          continuinReviewDetailObj.informed_consent_process = data[0] || {};
          const docQue =
            "select * from continuein_review_documents where protocol_id = ? AND information_type = ?";
          db.query(
            docQue,
            [req.body.protocolId, "informed_consent_process"],
            (err, data) => {
              if (data.length >= 0) {
                continuinReviewDetailObj.informed_consent_process.documents =
                  data || {};
              } else {
                continuinReviewDetailObj.informed_consent_process.documents =
                  [];
              }
            }
          );
          const que3 =
            "select * from investigator_instuation_info where protocol_id = ?";
          db.query(que3, [req.body.protocolId], (err, data) => {
            if (data.length >= 0) {
              continuinReviewDetailObj.investigator_instuation_info =
                data[0] || {};
              const docQue =
                "select * from continuein_review_documents where protocol_id = ? AND information_type = ?";
              db.query(
                docQue,
                [req.body.protocolId, "investigator_and_institution"],
                (err, data) => {
                  if (data.length >= 0) {
                    continuinReviewDetailObj.investigator_instuation_info.documents =
                      data || {};
                  } else {
                    continuinReviewDetailObj.investigator_instuation_info.documents =
                      [];
                  }
                }
              );
              const que4 =
                "select * from research_progress_info where protocol_id = ?";
              db.query(que4, [req.body.protocolId], (err, data) => {
                if (data.length >= 0) {
                  continuinReviewDetailObj.research_progress_info =
                    data[0] || {};
                  const docQue =
                    "select * from continuein_review_documents where protocol_id = ? AND information_type = ?";
                  db.query(
                    docQue,
                    [req.body.protocolId, "research_progress"],
                    async (err, data) => {
                      if (data.length >= 0) {
                        continuinReviewDetailObj.research_progress_info.documents =
                          data || {};
                      } else {
                        continuinReviewDetailObj.research_progress_info.documents =
                          [];
                      }
                      console.log(
                        "continuinReviewDetailObj",
                        continuinReviewDetailObj
                      );
                      try {
                        const protocolId = req.body;
                        const template =
                          await PdfTemplates.ContinuingReviewPdfTemplate(
                            continuinReviewDetailObj,
                            protocolId
                          );
                        let filePath = await generatePdfFromHTML(template);
                        console.log("filePath", filePath);
                        let sRL = await s3Service.uploadFile(filePath);
                        console.log("sRL", sRL);
                        let pdfUrl = sRL.cdnUrl;
                        // Remove the file from the local server
                        // fs.unlinkSync(filePath);
                        return res.status(200).json({ pdfUrl });
                      } catch (error) {
                        console.log(error);
                        return res
                          .status(500)
                          .json({ message: "Internal Server Error" });
                      }
                    }
                  );
                }
              });
            }
          });
        }
      });
    }
  });
  return;
};

export const protocolGeneratePdf = async (req, res) => {
  const protocolDetailsObj = {};
  if (req.body.protocolType === "Clinical Site") {
    const que1 = "select * from protocol_information where protocol_id = ?";
    db.query(que1, [req.body.protocolId], (err, data) => {
      if (data.length >= 0) {
        protocolDetailsObj.protocol_information = data[0] || {};
        const docQue =
          "select * from protocol_documents where protocol_id = ? AND information_type = ?";
        db.query(
          docQue,
          [req.body.protocolId, "protocol_information"],
          async (err, data) => {
            if (data.length >= 0) {
              protocolDetailsObj.protocol_information.documents = data || {};
            } else {
              protocolDetailsObj.protocol_information.documents = [];
            }
          }
        );
        const que2 =
          "select * from investigator_information where protocol_id = ?";
        db.query(que2, [req.body.protocolId], (err, data) => {
          if (data.length >= 0) {
            protocolDetailsObj.investigator_information = data[0] || {};
            const docQue =
              "select * from protocol_documents where protocol_id = ? AND information_type = ?";
            db.query(
              docQue,
              [req.body.protocolId, "investigator_information"],
              async (err, data) => {
                if (data.length >= 0) {
                  protocolDetailsObj.investigator_information.documents =
                    data || {};
                } else {
                  protocolDetailsObj.investigator_information.documents = [];
                }
              }
            );
            const que3 =
              "select * from study_information where protocol_id = ?";
            db.query(que3, [req.body.protocolId], (err, data) => {
              if (data.length >= 0) {
                protocolDetailsObj.study_information = data[0] || {};
                const docQue =
                  "select * from protocol_documents where protocol_id = ? AND information_type = ?";
                db.query(
                  docQue,
                  [req.body.protocolId, "study_information"],
                  async (err, data) => {
                    if (data.length >= 0) {
                      protocolDetailsObj.study_information.documents =
                        data || {};
                    } else {
                      protocolDetailsObj.study_information.documents = [];
                    }
                  }
                );
                const que4 =
                  "select * from informed_consent where protocol_id = ?";
                db.query(que4, [req.body.protocolId], (err, data) => {
                  if (data.length >= 0) {
                    protocolDetailsObj.informed_consent = data[0] || {};
                    const docQue =
                      "select * from protocol_documents where protocol_id = ? AND information_type = ?";
                    db.query(
                      docQue,
                      [req.body.protocolId, "informed_consent"],
                      async (err, data) => {
                        if (data.length >= 0) {
                          protocolDetailsObj.informed_consent.documents = data;
                        } else {
                          protocolDetailsObj.informed_consent.documents = [];
                        }
                      }
                    );
                    const que5 =
                      "select * from protocol_procedure where protocol_id = ?";
                    db.query(que5, [req.body.protocolId], (err, data) => {
                      if (data.length >= 0) {
                        protocolDetailsObj.protocol_procedure = data[0] || {};
                        const docQue =
                          "select * from protocol_documents where protocol_id = ? AND information_type = ?";
                        db.query(
                          docQue,
                          [req.body.protocolId, "protocol_procedure"],
                          async (err, data) => {
                            if (data.length >= 0) {
                              protocolDetailsObj.protocol_procedure.documents =
                                data;
                            } else {
                              protocolDetailsObj.protocol_procedure.documents =
                                [];
                            }
                            console.log(
                              "Clinical Site",
                              protocolDetailsObj,
                              req.body.protocolId
                            );
                            // return res.status(200).json(protocolDetailsObj)
                            try {
                              const protocolId = req.body;
                              const template =
                                await PdfTemplates.protocolAmendmentRequestPdfTemplate.ClinicalSitePdfTemplate(
                                  protocolDetailsObj,
                                  protocolId
                                );
                              let filePath = await generatePdfFromHTML(
                                template
                              );
                              console.log("filePath", filePath);
                              let sRL = await s3Service.uploadFile(filePath);
                              console.log("sRL", sRL);
                              let pdfUrl = sRL.cdnUrl;
                              // Remove the file from the local server
                              // fs.unlinkSync(filePath);
                              return res
                                .status(200)
                                .json({ pdfUrl, protocolDetailsObj });
                              // console.log("Clinical Site", {
                              //   protocolDetailsObj
                              // });
                            } catch (error) {
                              console.log(error);
                              return res
                                .status(500)
                                .json({ message: "Internal Server Error" });
                            }
                          }
                        );
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else if (req.body.protocolType === "Multi Site Sponsor") {
    const que1 = "select * from protocol_information where protocol_id = ?";
    db.query(que1, [req.body.protocolId], (err, data) => {
      if (data.length >= 0) {
        protocolDetailsObj.protocol_information = data[0] || {};
        const docQue =
          "select * from protocol_documents where protocol_id = ? AND information_type = ?";
        db.query(
          docQue,
          [req.body.protocolId, "protocol_information"],
          async (err, data) => {
            if (data.length >= 0) {
              protocolDetailsObj.protocol_information.documents = data;
            } else {
              protocolDetailsObj.protocol_information.documents = [];
            }
          }
        );
        const que2 = "select * from contact_information where protocol_id = ?";
        db.query(que2, [req.body.protocolId], (err, data) => {
          if (data.length >= 0) {
            protocolDetailsObj.contact_information = data[0] || {};
            const docQue =
              "select * from protocol_documents where protocol_id = ? AND information_type = ?";
            db.query(
              docQue,
              [req.body.protocolId, "contact_information"],
              async (err, data) => {
                if (data.length >= 0) {
                  protocolDetailsObj.contact_information.documents = data;
                } else {
                  protocolDetailsObj.contact_information.documents = [];
                }
              }
            );
            const que3 =
              "select * from study_information where protocol_id = ?";
            db.query(que3, [req.body.protocolId], (err, data) => {
              if (data.length >= 0) {
                protocolDetailsObj.study_information = data[0] || {};
                const docQue =
                  "select * from protocol_documents where protocol_id = ? AND information_type = ?";
                db.query(
                  docQue,
                  [req.body.protocolId, "study_information"],
                  async (err, data) => {
                    if (data.length >= 0) {
                      protocolDetailsObj.study_information.documents = data;
                    } else {
                      protocolDetailsObj.study_information.documents = [];
                    }
                  }
                );
                const que4 =
                  "select * from informed_consent where protocol_id = ?";
                db.query(que4, [req.body.protocolId], (err, data) => {
                  if (data.length >= 0) {
                    protocolDetailsObj.informed_consent = data[0] || {};
                    const docQue =
                      "select * from protocol_documents where protocol_id = ? AND information_type = ?";
                    db.query(
                      docQue,
                      [req.body.protocolId, "informed_consent"],
                      async (err, data) => {
                        if (data.length >= 0) {
                          protocolDetailsObj.informed_consent.documents = data;
                        } else {
                          protocolDetailsObj.informed_consent.documents = [];
                        }
                      }
                    );
                    const que5 =
                      "select * from protocol_procedure where protocol_id = ?";
                    db.query(que5, [req.body.protocolId], (err, data) => {
                      if (data.length >= 0) {
                        protocolDetailsObj.protocol_procedure = data[0] || {};
                        const docQue =
                          "select * from protocol_documents where protocol_id = ? AND information_type = ?";
                        db.query(
                          docQue,
                          [req.body.protocolId, "protocol_procedure"],
                          async (err, data) => {
                            if (data.length >= 0) {
                              protocolDetailsObj.protocol_procedure.documents =
                                data;
                            } else {
                              protocolDetailsObj.protocol_procedure.documents =
                                [];
                            }
                            // return res.status(200).json(protocolDetailsObj);
                            try {
                              const protocolId = req.body;
                              const template =
                                await PdfTemplates.protocolAmendmentRequestPdfTemplate.MultiSiteSponsorPdfTemplate(
                                  protocolDetailsObj,
                                  protocolId
                                );
                              let filePath = await generatePdfFromHTML(
                                template
                              );
                              console.log("filePath", filePath);
                              let sRL = await s3Service.uploadFile(filePath);
                              console.log("sRL", sRL);
                              let pdfUrl = sRL.cdnUrl;
                              // Remove the file from the local server
                              // fs.unlinkSync(filePath);
                              // console.log("Multi Site Sponser", {
                              //   protocolDetailsObj,
                              // });
                              return res
                                .status(200)
                                .json({ pdfUrl, protocolDetailsObj });
                            } catch (error) {
                              console.log(error);
                              return res
                                .status(500)
                                .json({ message: "Internal Server Error" });
                            }
                          }
                        );
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  } else {
    const que1 =
      "select * from investigator_protocol_information where protocol_id = ?";
    db.query(que1, [req.body.protocolId], (err, data) => {
      if (data.length >= 0) {
        protocolDetailsObj.investigator_protocol_information = data[0] || {};
        const docQue =
          "select * from protocol_documents where protocol_id = ? AND information_type = ?";
        db.query(
          docQue,
          [req.body.protocolId, "investigator_protocol_information"],
          async (err, data) => {
            if (data.length >= 0) {
              protocolDetailsObj.investigator_protocol_information.documents =
                data;
            } else {
              protocolDetailsObj.investigator_protocol_information.documents =
                [];
            }
          }
        );
        const que2 =
          "select * from clinical_consent_information where protocol_id = ?";
        db.query(que2, [req.body.protocolId], (err, data) => {
          if (data.length >= 0) {
            protocolDetailsObj.consent_information = data[0] || {};
            const docQue =
              "select * from protocol_documents where protocol_id = ? AND information_type = ?";
            db.query(
              docQue,
              [req.body.protocolId, "consent_information"],
              async (err, data) => {
                if (data.length >= 0) {
                  protocolDetailsObj.consent_information.documents = data;
                } else {
                  protocolDetailsObj.consent_information.documents = [];
                }
                // return res.status(200).json(protocolDetailsObj);
                try {
                  const protocolId = req.body;
                  const template =
                    await PdfTemplates.protocolAmendmentRequestPdfTemplate.PrincipalInvestigatorPdfTemplate(
                      protocolDetailsObj,
                      protocolId
                    );
                  let filePath = await generatePdfFromHTML(template);
                  console.log("filePath", filePath);
                  let sRL = await s3Service.uploadFile(filePath);
                  console.log("sRL", sRL);
                  let pdfUrl = sRL.cdnUrl;
                  // Remove the file from the local server
                  // fs.unlinkSync(filePath);
                  // console.log("Principal Investigator", {
                  //   protocolDetailsObj,
                  // });
                  return res.status(200).json({ pdfUrl, protocolDetailsObj });
                } catch (error) {
                  console.log(error);
                  return res
                    .status(500)
                    .json({ message: "Internal Server Error" });
                }
              }
            );
          }
        });
      }
    });
  }
};
