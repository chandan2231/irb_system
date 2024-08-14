import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER} from "redux-persist";
import MarketReducer from "./Market/MarketSlice";
import ApplicationReducer from "./Application/ApplicationSlice";
import UserReducer from "./UserManagement/UserSlice";
import RoleReducer from "./UserManagement/RoleSlice";
import PrivilegeReducer from "./Privilege/PrivilegeSlice";
import UserApplicationRole from "./UserManagement/UserApplicationRoleSlice";
import TeamReducer from "./Team/TeamSlice";
import HierarchyReducer from "./Hierarchy/HierarchySlice";
import AuthReducer from "./Auth/AuthSlice";
import DashboardReducer from "./Dashboard/DashboardSlice";
import ContinuinReviewReducer from "./ContinuinReview/ContinuinReviewSlice";
import ClinicalResearcherReducer from "./ProtocolType/ClinicalResearcherSlice";
import MultiSiteSponsorReducer from "./ProtocolType/MultiSiteSponsorSlice";
import ContractorResearcherReducer from "./ProtocolType/ContractorResearcherSlice";

const rootReducer = combineReducers({
  market: MarketReducer,
  application: ApplicationReducer,
  user: UserReducer,
  role: RoleReducer,
  privilege: PrivilegeReducer,
  UserApplicationRole: UserApplicationRole,
  team: TeamReducer,
  hierarchy: HierarchyReducer,
  auth: AuthReducer,
  dashboard: DashboardReducer,
  continuinReview: ContinuinReviewReducer,
  clinicalResearcher: ClinicalResearcherReducer,
  multiSiteSponsor: MultiSiteSponsorReducer,
  contractorResearcher: ContractorResearcherReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ['auth'], // Specify which slices you want to persist
  //whitelist: ["market", "application", "user", 'role', 'privilege', 'UserApplicationRole', 'team', 'hierarchy'], // Specify which slices you want to persist
};

const persistedReducer = persistReducer(persistConfig, rootReducer);



const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
