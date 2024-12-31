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
import AuthReducer from "./Auth/AuthSlice";
import DashboardReducer from "./Dashboard/DashboardSlice";
import ContinuinReviewReducer from "./ContinuinReview/ContinuinReviewSlice";
import ClinicalResearcherReducer from "./ProtocolType/ClinicalResearcherSlice";
import MultiSiteSponsorReducer from "./ProtocolType/MultiSiteSponsorSlice";
import ContractorResearcherReducer from "./ProtocolType/ContractorResearcherSlice";
import AdminReducer from "./Admin/AdminSlice";
import MembersReducer from "./Admin/MembersSlice";
import EventPriceReducer from "./Admin/EventPriceSlice";
import CommunicationReducer from "./Communication/CommunicationSlice";
import PaymentReducer from "./Payment/PaymentSlice";

const rootReducer = combineReducers({
  auth: AuthReducer,
  dashboard: DashboardReducer,
  continuinReview: ContinuinReviewReducer,
  clinicalResearcher: ClinicalResearcherReducer,
  multiSiteSponsor: MultiSiteSponsorReducer,
  contractorResearcher: ContractorResearcherReducer,
  admin: AdminReducer,
  member: MembersReducer,
  eventPrice: EventPriceReducer,
  communication: CommunicationReducer,
  payment: PaymentReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"], // Specify which slices you want to persist
  //whitelist: ["market", "application", "user", 'role', 'privilege', 'UserApplicationRole', 'team', 'hierarchy'], // Specify which slices you want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }),
// });

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

const persistor = persistStore(store);

export { store, persistor };
