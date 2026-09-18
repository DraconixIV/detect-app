import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabase";
import { getMyUserCode, getMyDisplayName } from "../services/sessionService";

/**
 * Hook to manage live GPS presence & real-time alerts for collaborative team sessions
 */
export default function useTeamPresence(workspace, position, setToast) {
  const [teammates, setTeammates] = useState([]);
  const channelRef = useRef(null);
  const positionRef = useRef(position);
  const hasSubscribedRef = useRef(false);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  // Push position updates whenever current user moves and channel is active
  useEffect(() => {
    if (!position || !channelRef.current || !hasSubscribedRef.current) return;
    if (workspace?.mode !== "session" || !workspace?.targetCode) return;

    const myCode = getMyUserCode();
    const myName = getMyDisplayName() || `Détecteuriste ${myCode.slice(-4)}`;

    channelRef.current.track({
      userCode: myCode,
      userName: myName,
      position: position,
      updatedAt: Date.now()
    }).catch((err) => {
      console.warn("Presence track update error:", err);
    });
  }, [position, workspace?.mode, workspace?.targetCode]);

  useEffect(() => {
    if (workspace?.mode !== "session" || !workspace?.targetCode) {
      setTeammates([]);
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        hasSubscribedRef.current = false;
      }
      return;
    }

    const sessionCode = workspace.targetCode.trim().toUpperCase();
    const myCode = getMyUserCode();
    const myName = getMyDisplayName() || `Détecteuriste ${myCode.slice(-4)}`;

    const channelName = `team-presence-${sessionCode}`;
    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: myCode
        }
      }
    });

    channelRef.current = channel;
    hasSubscribedRef.current = false;

    // 1. Presence Sync (State update of all active members)
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      const list = [];

      Object.keys(state).forEach((key) => {
        if (key === myCode) return; // Exclude self from teammates list
        const presences = state[key];
        if (presences && presences.length > 0) {
          const latest = presences[presences.length - 1];
          if (latest && latest.position && Array.isArray(latest.position)) {
            list.push({
              userCode: key,
              userName: latest.userName || `Détecteuriste ${key.slice(-4)}`,
              position: latest.position,
              updatedAt: latest.updatedAt || Date.now()
            });
          }
        }
      });

      setTeammates(list);
    });

    // 2. Presence Join (New teammate arrival alert)
    channel.on("presence", { event: "join" }, ({ key, newPresences }) => {
      if (key === myCode) return;
      const joinedUser = newPresences?.[0];
      const joinedName = joinedUser?.userName || `Détecteuriste ${key.slice(-4)}`;

      if (setToast) {
        setToast({
          message: `👋 ${joinedName} a rejoint la session d'équipe !`,
          type: "success"
        });
      }
    });

    // 3. Presence Leave (Teammate departure alert)
    channel.on("presence", { event: "leave" }, ({ key, leftPresences }) => {
      if (key === myCode) return;
      const leftUser = leftPresences?.[0];
      const leftName = leftUser?.userName || `Détecteuriste ${key.slice(-4)}`;

      if (setToast) {
        setToast({
          message: `🚪 ${leftName} a quitté la session.`,
          type: "info"
        });
      }
    });

    // 4. Subscribe and immediately broadcast self initial position
    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        hasSubscribedRef.current = true;
        try {
          await channel.track({
            userCode: myCode,
            userName: myName,
            position: positionRef.current || null,
            updatedAt: Date.now()
          });
        } catch (e) {
          console.warn("Initial presence track error:", e);
        }
      }
    });

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
      channelRef.current = null;
      hasSubscribedRef.current = false;
    };
  }, [workspace?.mode, workspace?.targetCode]);

  return { teammates };
}
