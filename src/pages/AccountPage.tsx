import React, { useEffect, useState } from "react";
import { User, Weight, TrendingUp, Settings, Pencil } from "lucide-react";
import { useUserSettings } from "../hooks/useUserSettings";
import ProfileInformations from "../components/ProfileInformation";
import MeasurementsInfo from "../components/MeasurementsInfo";
import GoalsInformation from "../components/GoalsInformation";
import SettingsInformation from "../components/SettingsInformation";
import SidebarItem from "../components/SidebarItem";
import { AvatarUploader } from "../components/AvatarUploader";
import PageHeader from "../components/PageHeader";

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
    avatarUrl: initialAvatarUrl,
    loading: settingsLoading,
    error: settingsError,
  } = useUserSettings();

  const [selected, setSelected] = useState<SelectType>("prof");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

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

  useEffect(() => {
    if (initialAvatarUrl) {
      setAvatarUrl(initialAvatarUrl);
    }
  }, [initialAvatarUrl]);

  // Settings Error Handler
  useEffect(() => {
    if (settingsError) {
      setNotification({
        message: settingsError.message || "Faile to fetch user settings",
        type: "error",
      });
    }
  }, [settingsError]);

  return (
    <>
      {showUploader && (
        <AvatarUploader
          onClose={() => setShowUploader(false)}
          onUploadSuccess={(url: string) => {
            setAvatarUrl(url);
            setShowUploader(false);
          }}
        />
      )}
      <PageHeader
        title="Account"
        subtitle="Manage your profile and preferences"
      >
        <div className="flex flex-col sm:hidden w-full">
          <div className="flex flex-row items-center gap-4 mb-4">
            <div className="relative group w-16 h-16">
              <div className="bg-blue-200 rounded-full w-full h-full overflow-hidden">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <User width={30} height={30} className="text-blue-400" />
                  </div>
                )}
              </div>
              <div
                className="absolute inset-0 flex justify-center items-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                onClick={() => setShowUploader(true)}
              >
                <Pencil className="text-white" size={20} />
              </div>
            </div>
            <p className="text-xl font-bold tracking-wide">{name}</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {[
              {
                label: "Profile",
                icon: <User width={18} height={18} />,
                value: "prof" as SelectType,
              },
              {
                label: "Measurements",
                icon: <Weight width={18} height={18} />,
                value: "meas" as SelectType,
              },
              {
                label: "Goals",
                icon: <TrendingUp width={18} height={18} />,
                value: "goals" as SelectType,
              },
              {
                label: "Settings",
                icon: <Settings width={18} height={18} />,
                value: "set" as SelectType,
              },
            ].map((item) => (
              <SidebarItem
                key={item.value}
                label={item.label}
                icon={item.icon}
                value={item.value}
                selected={selected}
                onSelect={setSelected}
              />
            ))}
          </div>

          <div className="w-full">{renderSelectedComponent()}</div>
        </div>

        <div className="hidden sm:flex flex-row w-full py-4">
          <div className="bg-white shadow-md rounded-xl flex flex-col justify-start items-center w-1/4 m-6">
            <div className="relative group m-4 w-24 h-24">
              <div className="bg-blue-200 rounded-full w-full h-full overflow-hidden">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <User width={40} height={40} className="text-blue-400" />
                  </div>
                )}
              </div>
              <div
                className="absolute inset-0 flex justify-center items-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                onClick={() => setShowUploader(true)}
              >
                <Pencil className="text-white" size={24} />
              </div>
            </div>

            <p className="text-xl font-bold tracking-wide">{name}</p>

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

          <div className="flex flex-grow">{renderSelectedComponent()}</div>
        </div>
      </PageHeader>
    </>
  );
};

export default AccountPage;
