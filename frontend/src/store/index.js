import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import AuthReducer from "./Auth/AuthSlice";
import DashboardReducer from "./Dashboard/DashboardSlice";
import ContinuinReviewReducer from "./ContinuinReview/ContinuinReviewSlice";
import ClinicalResearcherReducer from "./ProtocolType/ClinicalResearcherSlice";
import MultiSiteSponsorReducer from "./ProtocolType/MultiSiteSponsorSlice";
import ContractorResearcherReducer from "./ProtocolType/ContractorResearcherSlice";
import DocumentReviewReducer from "./ProtocolType/DocumentReviewSlice";
import AdminReducer from "./Admin/AdminSlice";
import MembersReducer from "./Admin/MembersSlice";
import EventPriceReducer from "./Admin/EventPriceSlice";
import CommunicationReducer from "./Communication/CommunicationSlice";
import PaymentReducer from "./Payment/PaymentSlice";
import ExternalMonitorReducer from "./ExternalMonitor/ExternalMonitorSlice";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error("No secret key. Add it to .env file");
}

const encryptor = encryptTransform({
  secretKey: SECRET_KEY,
  onError: (error) => {
    console.error("Encryption error:", error);
  },
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],
  transforms: [encryptor],
};

const rootReducer = combineReducers({
  auth: AuthReducer,
  dashboard: DashboardReducer,
  continuinReview: ContinuinReviewReducer,
  clinicalResearcher: ClinicalResearcherReducer,
  multiSiteSponsor: MultiSiteSponsorReducer,
  contractorResearcher: ContractorResearcherReducer,
  documentReview: DocumentReviewReducer,
  admin: AdminReducer,
  member: MembersReducer,
  eventPrice: EventPriceReducer,
  communication: CommunicationReducer,
  payment: PaymentReducer,
  externalMonitor: ExternalMonitorReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
