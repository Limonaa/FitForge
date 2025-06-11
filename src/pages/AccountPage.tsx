import React, { useState } from "react";
import { User, Weight, TrendingUp, Settings } from "lucide-react";
import { useUserSettings } from "../hooks/useUserSettings";
import ProfileInformations from "../components/ProfileInformation";
import MeasurementsInfo from "../components/MeasurementsInfo";
import GoalsInformation from "../components/GoalsInformation";
import SettingsInformation from "../components/SettingsInformation";
import SidebarItem from "../components/SidebarItem";

type SelectType = "prof" | "meas" | "goals" | "set";

const AccountPage = () => {
  const {
    weight,
    height,
    gender,
    caloriesGoal,
    proteinGoal,
    carbsGoal,
    fatsGoal,
    name,
    birthdate,
    activityLevel,
    goalType,
  } = useUserSettings();

  const [selected, setSelected] = useState<SelectType>("prof");

  const renderSelectedComponent = () => {
    switch (selected) {
      case "prof":
        return (
          <ProfileInformations
            name={name}
            email="test@example.com"
            gender={gender}
            birthdate={birthdate}
          />
        );
      case "meas":
        return <MeasurementsInfo height={height} weight={weight} />;
      case "goals":
        return (
          <GoalsInformation
            caloriesGoal={caloriesGoal}
            proteinGoal={proteinGoal}
            carbsGoal={carbsGoal}
            fatsGoal={fatsGoal}
            activityLevel={activityLevel}
            goalType={goalType}
          />
        );
      case "set":
        return <SettingsInformation />;
      default:
        return null;
    }
  };

  return (
    <>
      <p className="text-2xl font-bold mx-6">Account</p>
      <p className="text-gray-500 mx-6">Manage your profile and preferences</p>
      <div className="flex flex-row w-full">
        <div className="bg-white shadow-md rounded-xl flex flex-col justify-center items-center w-1/4 m-6">
          <div className="bg-blue-200 rounded-full w-24 h-24 flex justify-center items-center m-4">
            <User width={40} height={40} className="text-blue-400" />
          </div>
          <p className="text-xl font-semibold">{name}</p>
          <div className="my-2 w-3/4">
            <SidebarItem
              label="Profile"
              icon={<User width={18} height={18} />}
              value="prof"
              selected={selected}
              onSelect={setSelected}
            />
            <SidebarItem
              label="Measurements"
              icon={<Weight width={18} height={18} />}
              value="meas"
              selected={selected}
              onSelect={setSelected}
            />
            <SidebarItem
              label="Goals"
              icon={<TrendingUp width={18} height={18} />}
              value="goals"
              selected={selected}
              onSelect={setSelected}
            />
            <SidebarItem
              label="Settings"
              icon={<Settings width={18} height={18} />}
              value="set"
              selected={selected}
              onSelect={setSelected}
            />
          </div>
        </div>
        {renderSelectedComponent()}
      </div>
    </>
  );
};

export default AccountPage;
