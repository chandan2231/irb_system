import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  getPaymentAmountInfo,
  createPayment,
  capturePayment,
  canclePayment,
  capturePaymentAdditionClinicSite,
} from "../services/Payment/PaymentService";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const PayPalButton = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const protocolTypeDetails = location?.state?.details;
  const identifierType = location?.state?.identifierType;
  console.log("protocolTypeDetails", protocolTypeDetails);
  console.log("identifierType", identifierType);
  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem("user"));
    if (userDetails) {
      setUser(userDetails);
    }
  }, []);

  const navigateToCanclePayment = (protocolTypeDetails, amount) => {
    navigate("/cancel", {
      state: { details: protocolTypeDetails, amount: amount },
    });
  };

  const navigateToSuccessPayment = (protocolTypeDetails, amount) => {
    navigate("/success", {
      state: { details: protocolTypeDetails, amount: amount },
    });
  };

  const { paymentAmount, paymentLoading, paymentError } = useSelector(
    (state) => ({
      error: state.payment.error,
      paymentAmount: state.payment.paymentAmount,
      loading: state.payment.loading,
    })
  );

  useEffect(() => {
    if (protocolTypeDetails === undefined) {
      window.location.replace("/dashboard");
    }
  }, [protocolTypeDetails === undefined]);

  useEffect(() => {
    if (!paymentLoading && protocolTypeDetails !== undefined) {
      const data = { paymentType: protocolTypeDetails };
      dispatch(getPaymentAmountInfo(data)).then((response) => {
        if (response.payload.status === 200) {
          // Log response to confirm payment data
          console.log("Payment amount data:", response.payload);
        }
      });
    }
  }, [dispatch, paymentLoading, protocolTypeDetails !== undefined]);

  useEffect(() => {
    // Dynamically load PayPal script
    if (paymentAmount !== null && paymentAmount?.data?.length > 0) {
      const script = document.createElement("script");
      script.src = `https://www.paypal.com/sdk/js?client-id=AUJ2ExPRI7HOoaNHIxWP-3wngxA-Bk_Bxew7RpIUxlLBkJDEyCiSBruQntP3BCYxP3rxMxlm6UZg0zMs&components=buttons`;
      let amountData = "";
      if (identifierType === "add_more_site") {
        amountData = {
          amount:
            paymentAmount?.data[0]?.price *
            0.2 *
            protocolTypeDetails?.protocol_count,
        };
      } else {
        amountData = { amount: paymentAmount?.data[0]?.price };
      }

      script.onload = () => {
        window.paypal
          .Buttons({
            createOrder: async (data, actions) => {
              try {
                // Dispatch createPayment action
                const response = await dispatch(createPayment(amountData));

                if (response.payload?.data?.approvalUrl) {
                  const approvalUrl = response.payload.data.approvalUrl;
                  // Instead of manually redirecting, just return the order ID
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: amountData.amount,
                        },
                      },
                    ],
                  });
                } else {
                  throw new Error("Approval URL not found in response.");
                }
              } catch (error) {
                console.error("Error creating PayPal payment:", error);
              }
            },

            onApprove: async (data, actions) => {
              try {
                const { orderID, payerID } = data;
                let response = "";
                // Dispatch capture payment action
                if (identifierType === "add_more_site") {
                  response = await dispatch(
                    capturePaymentAdditionClinicSite({
                      orderId: orderID,
                      payerId: payerID,
                      currencyCode: "USD",
                      amount:
                        paymentAmount?.data[0]?.price *
                        0.2 *
                        protocolTypeDetails?.protocol_count,
                      protocolId: protocolTypeDetails?.protocol_id,
                      researchType: protocolTypeDetails?.protocol_type,
                      userId: user.id,
                      protocolCount: protocolTypeDetails?.protocol_count,
                    })
                  );
                } else {
                  response = await dispatch(
                    capturePayment({
                      orderId: orderID,
                      payerId: payerID,
                      currencyCode: "USD",
                      amount: paymentAmount?.data[0]?.price,
                      protocolId: protocolTypeDetails?.protocol_id,
                      researchType: protocolTypeDetails?.protocol_type,
                      userId: user.id,
                    })
                  );
                }
                if (response.payload.status === 200) {
                  let amountPaid = "";
                  if (identifierType === "add_more_site") {
                    amountPaid =
                      paymentAmount?.data[0]?.price *
                      0.2 *
                      protocolTypeDetails?.protocol_count;
                  } else {
                    amountPaid = paymentAmount?.data[0]?.price;
                  }
                  navigateToSuccessPayment(protocolTypeDetails, amountPaid);
                }
              } catch (error) {
                console.error("Payment approval failed:", error);
              }
            },

            onCancel: async (data) => {
              try {
                const response = await dispatch(canclePayment()); // Dispatch the cancel payment action
                console.log("Cancel response", response); // Log the cancel response
                if (response.payload.status === 200) {
                  let amountPaid = "";
                  if (identifierType === "add_more_site") {
                    amountPaid =
                      paymentAmount?.data[0]?.price *
                      0.2 *
                      protocolTypeDetails?.protocol_count;
                  } else {
                    amountPaid = paymentAmount?.data[0]?.price;
                  }
                  navigateToCanclePayment(protocolTypeDetails, amountPaid);
                }
              } catch (error) {
                console.error("Error cancelling payment:", error);
              }
            },

            onError: (error) => {
              console.error("Error:", error); // Log any PayPal button SDK errors
            },
          })
          .render("#paypal-button-container");
      };

      document.body.appendChild(script);
    }
  }, [paymentAmount, dispatch]);

  if (protocolTypeDetails === undefined) {
    return <Loader />;
  }

  return (
    <div
      id="paypal-button-container"
      style={{ left: "50%", position: "absolute", top: "50%", width: "25%" }}
    ></div>
  );
};

export default PayPalButton;
