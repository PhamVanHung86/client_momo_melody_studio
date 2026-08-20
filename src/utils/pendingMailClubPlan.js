const PENDING_PLAN_KEY = "momo_pending_mailclub_plan";

export function setPendingMailClubPlan(planId) {
  sessionStorage.setItem(PENDING_PLAN_KEY, planId);
}

export function consumePendingMailClubPlan() {
  const plan = sessionStorage.getItem(PENDING_PLAN_KEY);
  if (plan) sessionStorage.removeItem(PENDING_PLAN_KEY);
  return plan;
}

export function hasPendingMailClubPlan() {
  return Boolean(sessionStorage.getItem(PENDING_PLAN_KEY));
}
