"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ParentBottomNavigation,
  ParentChildrenSelector,
  ParentClassProgressList,
  ParentCompletedLessonsList,
  ParentDashboardTopbar,
  ParentLastSessionReportCard,
  ParentStreakCard,
  ParentWeeklyXpChart,
} from "@/features/dashboard/parent/components";
import { PARENT_DASHBOARD_MOCK } from "@/features/dashboard/parent/data";
import { getParentDashboardData } from "@/features/dashboard/parent/services";
import type { ParentDashboardData } from "@/features/dashboard/parent/types";

const ParentDashboardView = () => {
  const [dashboardData, setDashboardData] = useState<ParentDashboardData>(PARENT_DASHBOARD_MOCK);
  const [selectedChildId, setSelectedChildId] = useState(PARENT_DASHBOARD_MOCK.children[0]?.id ?? "");

  useEffect(() => {
    let mounted = true;

    const loadDashboardData = async () => {
      if (!selectedChildId) {
        return;
      }

      const response = await getParentDashboardData(selectedChildId);

      if (!mounted) {
        return;
      }

      setDashboardData(response);

      // Si backend trae hijos distintos, dejamos seleccionado el primero para evitar estado roto.
      setSelectedChildId((currentSelectedChildId) => {
        if (response.children.length === 0) {
          return "";
        }

        return response.children.some((child) => child.id === currentSelectedChildId)
          ? currentSelectedChildId
          : response.children[0].id;
      });
    };

    loadDashboardData();

    return () => {
      mounted = false;
    };
  }, [selectedChildId]);

  const selectedChild = useMemo(
    () => dashboardData.children.find((child) => child.id === selectedChildId) ?? dashboardData.children[0],
    [dashboardData.children, selectedChildId],
  );

  return (
    <div className="landing-module-shell pb-24">
      <ParentDashboardTopbar profile={dashboardData.profile} />

      <ParentChildrenSelector
        items={dashboardData.children}
        selectedChildId={selectedChild?.id ?? ""}
        onSelectChild={setSelectedChildId}
      />

      <ParentStreakCard streak={dashboardData.streak} />

      <ParentLastSessionReportCard report={dashboardData.lastSessionReport} />

      <ParentClassProgressList items={dashboardData.classProgress} />

      <ParentCompletedLessonsList lessons={dashboardData.completedLessons} />

      <ParentWeeklyXpChart items={dashboardData.weeklyXp} />

      <ParentBottomNavigation items={dashboardData.bottomNavigation} />
    </div>
  );
};

export default ParentDashboardView;
