import React from "react";
import Notification from "../../../pages/main/notification/Notification";
import OrderCreation from "../../../pages/main/orders/order-creation/OrderCreation";
import Profile from "../../..//pages/main/profile/Profile";
import FreelancerProf from "../../../pages/main/profile/FreelancerProf";
import Settings from "../../../pages/main/settings/Settings";
import OrderView from "../../../pages/main/orders/order-view/OrderView";
import ActivateAccount from "../../../components/main/modal/set-password/activate-account/ActivateAccount";
import { useEffect, useState } from "react";
import Navbar from "../../../components/main/navbar/Navbar";
import SideNav from "../../../components/main/sidenav/SideNav";
import Completed from "../../../pages/main/orders/completed/Completed";
import InProgress from "../../../pages/main/orders/in-progress/InProgress";
import Available from "../../../pages/main/orders/available/Available";
import PaymentConfirm from "../../../components/main/payment-confirm/PaymentConfirm";
import Solved from "../../../pages/main/solved/Solved";
import { Route, Routes } from "react-router-dom";
import Dashboard from "../../../pages/main/dashboard/Dashboard";
import { useAuthContext } from "../../../providers/AuthProvider";
export default function Main() {
  const { loadedUserProfile, userToken } = useAuthContext();

  return (
    <>
      <main className="app">
        <SideNav />
        <div className="app-main-content">
          <Navbar />
          <div className="routes">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/available" element={<Available />} />
              <Route path="/in-progress" element={<InProgress />} />
              <Route path="/completed" element={<Completed />} />
              <Route path="/notifications" element={<Notification />} />
              <Route path="/create-task" element={<OrderCreation />} />
              <Route path="/solved" element={<Solved />} />
              <Route path="/profile" element={<Profile />} />
              <Route
                path="/freelancer-prof/:freelancerParam"
                element={<FreelancerProf />}
              />
              <Route path="/settings" element={<Settings />} />
              <Route path="/order/:orderId/*" element={<OrderView />} />
              <Route path="/payment" element={<PaymentConfirm />} />
            </Routes>
          </div>
        </div>
      </main>
      {loadedUserProfile?.is_verified === "False" && (
        <ActivateAccount token={userToken} email={loadedUserProfile?.email} />
      )}
    </>
  );
}
