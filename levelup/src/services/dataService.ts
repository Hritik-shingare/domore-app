import { supabase } from '../lib/supabase';
import { DailyActivity, LeaderboardUser, Skill, UserProfile } from '../types';

/**
 * Fetch the authenticated user's profile and lifetime milestone statistics.
 * Scoped strictly to the provided userId.
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile> {
  // 1. Fetch user_profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('id, username, display_name, avatar_url')
    .eq('id', userId)
    .single();

  // 2. Fetch latest weekly_score
  const { data: scoreData } = await supabase
    .from('weekly_scores')
    .select('total_score, rank_in_friend_group')
    .eq('user_id', userId)
    .order('week_start_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  // 3. Count days active in daily_logs
  const { count: daysActiveCount } = await supabase
    .from('daily_logs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  // 4. Count days where steps >= 8000 as completed goals
  const { count: completedGoalsCount } = await supabase
    .from('daily_logs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('steps', 8000);

  const weeklyScore = scoreData?.total_score ? Math.round(Number(scoreData.total_score)) : 0;
  const overallScore = weeklyScore * 5; // scaled milestone points or 0
  const level = Math.max(1, Math.floor(overallScore / 250) + 1);

  return {
    name: profile?.display_name || profile?.username || 'LevelUp User',
    username: `@${profile?.username || 'user'}`,
    level,
    overallScore,
    weeklyScore,
    rank: scoreData?.rank_in_friend_group || 1,
    daysActive: daysActiveCount || 0,
    completedGoals: completedGoalsCount || 0,
  };
}

/**
 * Fetch today's activity log and goals for the authenticated user.
 * Scoped strictly to the provided userId.
 */
export async function fetchTodayActivity(userId: string): Promise<DailyActivity> {
  const today = new Date().toISOString().split('T')[0];

  // 1. Fetch user_goals
  const { data: goals } = await supabase
    .from('user_goals')
    .select('step_goal, calorie_burn_goal')
    .eq('user_id', userId)
    .maybeSingle();

  const stepGoal = goals?.step_goal || 8000;
  const calorieGoal = goals?.calorie_burn_goal || 500;

  // 2. Fetch today's daily_log
  const { data: log } = await supabase
    .from('daily_logs')
    .select('steps, ran_today, run_distance_km, calories_burned')
    .eq('user_id', userId)
    .eq('log_date', today)
    .maybeSingle();

  // 3. Calculate streak (consecutive days with daily_logs ending today or yesterday)
  const { data: recentLogs } = await supabase
    .from('daily_logs')
    .select('log_date')
    .eq('user_id', userId)
    .order('log_date', { ascending: false })
    .limit(30);

  let streakDays = 0;
  if (recentLogs && recentLogs.length > 0) {
    const dates = recentLogs.map((l) => l.log_date);
    const currentDate = new Date();
    // Check if logged today or yesterday
    let checkDate = new Date(currentDate);
    const todayStr = checkDate.toISOString().split('T')[0];
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayStr = checkDate.toISOString().split('T')[0];

    let startStr = dates.includes(todayStr) ? todayStr : (dates.includes(yesterdayStr) ? yesterdayStr : null);

    if (startStr) {
      let iterDate = new Date(startStr);
      while (true) {
        const iterStr = iterDate.toISOString().split('T')[0];
        if (dates.includes(iterStr)) {
          streakDays++;
          iterDate.setDate(iterDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
  }

  const steps = log?.steps || 0;
  const caloriesBurned = log?.calories_burned || 0;
  const hasRunToday = Boolean(log?.ran_today);
  const runDistanceKm = log?.run_distance_km ? Number(log.run_distance_km) : 0;

  // Calculate score (0 - 100)
  const score = Math.min(
    100,
    Math.round((steps / stepGoal) * 60 + (caloriesBurned / calorieGoal) * 40)
  );

  return {
    score,
    maxScore: 100,
    steps,
    stepGoal,
    hasRunToday,
    runDistanceKm,
    caloriesBurned,
    calorieGoal,
    streakDays,
  };
}

/**
 * Fetch all skills tracked by the authenticated user.
 * Scoped strictly to the provided userId.
 */
export async function fetchUserSkills(userId: string): Promise<Skill[]> {
  const { data: skillsData } = await supabase
    .from('skills')
    .select(`
      id,
      name,
      created_at,
      skill_areas (
        id,
        name,
        progress_percent
      ),
      skill_time_logs (
        minutes_spent
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (!skillsData || skillsData.length === 0) {
    return [];
  }

  const inferCategory = (name: string): Skill['category'] => {
    const lower = name.toLowerCase();
    if (lower.includes('run') || lower.includes('gym') || lower.includes('fit') || lower.includes('workout')) return 'Fitness';
    if (lower.includes('code') || lower.includes('react') || lower.includes('python') || lower.includes('dev')) return 'Coding';
    if (lower.includes('meditat') || lower.includes('mind') || lower.includes('journal')) return 'Mindset';
    if (lower.includes('spanish') || lower.includes('french') || lower.includes('english') || lower.includes('lang')) return 'Language';
    return 'Productivity';
  };

  return skillsData.map((s: any) => {
    const areas = s.skill_areas || [];
    const avgProgress = areas.length > 0
      ? Math.round(areas.reduce((sum: number, a: any) => sum + (a.progress_percent || 0), 0) / areas.length)
      : 15;

    const timeLogs = s.skill_time_logs || [];
    const totalMinutes = timeLogs.reduce((sum: number, l: any) => sum + (l.minutes_spent || 0), 0);
    const hoursInvested = Math.round(totalMinutes / 60);
    const level = Math.max(1, Math.floor(hoursInvested / 5) + 1);

    return {
      id: s.id,
      name: s.name,
      category: inferCategory(s.name),
      level,
      progressPercent: Math.min(100, Math.max(0, avgProgress)),
      hoursInvested,
    };
  });
}

/**
 * Create a new skill in Supabase for the authenticated user.
 */
export async function createSkill(
  userId: string,
  name: string,
  category: Skill['category']
): Promise<Skill | null> {
  const { data: skill, error: skillError } = await supabase
    .from('skills')
    .insert({
      user_id: userId,
      name: name.trim(),
    })
    .select('id, name, created_at')
    .single();

  if (skillError || !skill) {
    console.warn('Failed to create skill:', skillError?.message);
    return null;
  }

  // Create an initial skill_area
  await supabase.from('skill_areas').insert({
    skill_id: skill.id,
    name: 'Fundamentals',
    progress_percent: 15,
  });

  return {
    id: skill.id,
    name: skill.name,
    category,
    level: 1,
    progressPercent: 15,
    hoursInvested: 0,
  };
}

/**
 * Log or update today's activity for the authenticated user.
 */
export async function logTodayActivity(
  userId: string,
  data: {
    steps?: number;
    ran_today?: boolean;
    run_distance_km?: number;
    calories_burned?: number;
  }
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];

  const payload: any = {
    user_id: userId,
    log_date: today,
  };
  if (data.steps !== undefined) payload.steps = data.steps;
  if (data.ran_today !== undefined) payload.ran_today = data.ran_today;
  if (data.run_distance_km !== undefined) payload.run_distance_km = data.run_distance_km;
  if (data.calories_burned !== undefined) payload.calories_burned = data.calories_burned;

  const { error } = await supabase
    .from('daily_logs')
    .upsert(payload, { onConflict: 'user_id,log_date' });

  if (error) {
    console.warn('Failed to upsert daily_log:', error.message);
  }
}

/**
 * Fetch the leaderboard for the user.
 * Displays friends or community members with current user clearly identified.
 */
export async function fetchLeaderboard(
  userId: string,
  currentUserProfile?: UserProfile
): Promise<LeaderboardUser[]> {
  // 1. Fetch current user's profile info
  const { data: selfProfile } = await supabase
    .from('user_profiles')
    .select('id, username, display_name')
    .eq('id', userId)
    .single();

  // 2. Fetch all public user profiles (up to 10)
  const { data: allProfiles } = await supabase
    .from('user_profiles')
    .select('id, username, display_name')
    .limit(10);

  // 3. Fetch latest weekly_scores
  const { data: scores } = await supabase
    .from('weekly_scores')
    .select('user_id, total_score')
    .order('week_start_date', { ascending: false })
    .limit(20);

  const scoreMap = new Map<string, number>();
  if (scores) {
    for (const s of scores) {
      if (!scoreMap.has(s.user_id)) {
        scoreMap.set(s.user_id, Math.round(Number(s.total_score || 0)));
      }
    }
  }

  // Ensure current user is present
  const profileList = allProfiles ? [...allProfiles] : [];
  if (selfProfile && !profileList.some((p) => p.id === userId)) {
    profileList.unshift(selfProfile);
  }

  const avatars = ['🥇', '⚡', '🥉', '🏃', '🧠', '💻', '🔥', '🎯', '🚀', '🌟'];

  const users: LeaderboardUser[] = profileList.map((p, index) => {
    const isCurrentUser = p.id === userId;
    const score = scoreMap.get(p.id) || (isCurrentUser && currentUserProfile ? currentUserProfile.weeklyScore : 0);
    return {
      id: p.id,
      name: isCurrentUser ? `${p.display_name || p.username} (You)` : (p.display_name || p.username),
      avatar: isCurrentUser ? '⚡' : avatars[index % avatars.length],
      weeklyScore: score,
      isCurrentUser,
      rank: 0, // will be assigned below
    };
  });

  // Sort by weeklyScore descending
  users.sort((a, b) => b.weeklyScore - a.weeklyScore);
  users.forEach((u, idx) => {
    u.rank = idx + 1;
  });

  return users;
}
